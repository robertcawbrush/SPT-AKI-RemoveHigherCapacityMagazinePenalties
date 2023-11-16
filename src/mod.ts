import { DependencyContainer } from "tsyringe";

import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

const config = require("../config/config.json");

interface IItem {
    _id: string,
    _name: string,
    _parent: string
    _props: IItemProps
}

interface IItemProps {
    Accuracy: number
    AnimationVariantsNumber: number
    BackgroundColor: string
    BeltMagazineRefreshCount: number
    BlocksCollapsible: boolean
    BlocksFolding: boolean
    CanAdmin: boolean
    CanFast: boolean
    CanHit: boolean
    CanPutIntoDuringTheRaid: boolean
    CanRequireOnRagfair: boolean
    CanSellOnRagfair: boolean
    CantRemoveFromSlotsDuringRaid: any[]
    Cartridges: ICartridges[]
    CheckOverride: number
    CheckTimeModifier: number
    ConflictingItems: string[]
    "Description": string
    "DiscardLimit": number
    "DiscardingBlock": boolean
    "DoubleActionAccuracyPenaltyMult": number
    "DropSoundType": string
    "Durability": number
    "EffectiveDistance": number
    "Ergonomics": number
    "ExamineExperience": number
    "ExamineTime": number
    "ExaminedByDefault": boolean
    "ExtraSizeDown": number
    "ExtraSizeForceAdd": boolean
    "ExtraSizeLeft": number
    "ExtraSizeRight": number
    "ExtraSizeUp": number,
    Grids: any[],
    "HasShoulderContact": boolean
    "Height": number
    "HideEntrails": boolean
    "InsuranceDisabled": boolean
    "IsAlwaysAvailableForInsurance": boolean
    "IsAnimated": boolean
    "IsLockedafterEquip": boolean
    "IsMagazineForStationaryWeapon": boolean
    "IsSpecialSlotOnly": boolean
    "IsUnbuyable": boolean
    "IsUndiscardable": boolean
    "IsUngivable": boolean
    "IsUnremovable": boolean
    "IsUnsaleable": boolean
    "ItemSound": string
    "LoadUnloadModifier": number
    "LootExperience": number
    "Loudness": number
    "MagazineWithBelt": boolean
    "MalfunctionChance": number
    "MergesWithChildren": boolean
    "Name": string
    "NotShownInSlot": boolean
}

interface ICartridges {
    _id: number,
    _max_count: number
    _name: string,
    _parent: string,
    _props: ICartridgeProps
    _proto: string
}

interface ICartridgeProps {
    filters: IFilter[]
}

interface IFilter {
    Filter: string[]
}

type ItemIds = string[]

const MODTITLE = "[RemoveMagazineLoadPenalties]"

class RemoveHigherCapacityMagazineLoadPenalties implements IPostDBLoadMod {

    public postDBLoad(container: DependencyContainer): void {

        let logger = container.resolve<ILogger>("WinstonLogger");

        // check config
        if (config.debug) {
            logger.info(`${MODTITLE} DEBUG VALUE SET TO TRUE, ENABLING ADDITIONAL LOGGING\nset the debug value to false to turn off verbose logging`)
        }

        let loadUnloadTimeModifierValue = 0
        let checkTimeModifierValue = 10
        if (config) {
            const {loadUnloadModifier, checkTimeModifier} = config

            if (loadUnloadModifier !== null && loadUnloadModifier !== undefined) {
                loadUnloadTimeModifierValue = loadUnloadModifier
            }

            if (checkTimeModifier !== null && checkTimeModifier !== undefined) {
                checkTimeModifierValue = checkTimeModifier
            }
        }

        // get database from server
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");

        // Get all the in-memory json found in /assets/database
        const tables = databaseServer.getTables();

        // find the magazines in the database
        const magazines: ItemIds = []

        logger.info(`${MODTITLE} applying changes`);

        if (config.debug) {
            logger.info(`${MODTITLE} starting database scan for qualifying magazines. A magazine is qualified if its capacity is higher than 32`)
            logger.info(`${MODTITLE} generally, magazines less than 32 do not need the debuff removed, and if done so will remove positive buffs`)
            logger.info(`${MODTITLE} UnloadModifier is set to ${loadUnloadTimeModifierValue}, Magazine check time modifier is set to ${checkTimeModifierValue}`)
        }

        for (const [_, item] of Object.entries(tables.templates.items)) {
            config.magazineScanLog && logger.info(`${MODTITLE} scanning item of id: ${item._id} to see if it is magazine`)
            const currentItem: IItem = item
            const cartridgesRoot = currentItem?._props?.Cartridges

            if (cartridgesRoot !== undefined && cartridgesRoot.length > 0) {
                const currentItem = cartridgesRoot[0]
                const magazineIsOfHigherCapacity = currentItem._max_count > 32
                if (magazineIsOfHigherCapacity) {
                    config.debug && logger.info(`${MODTITLE} item of id: ${item._id} is a higher capacity magazine as it has a capacity of ${currentItem._max_count}`)
                    magazines.push(item._id)
                }
            }
        }

        // modify the items properties
        magazines.map(mag => {
            if (mag !== null && mag !== undefined) {
                config.debug && logger.info(`${MODTITLE} Starting removing penalties of magazine of id:${mag}`)
                let magazine = tables?.templates?.items[mag];
                if (magazine !== undefined) {
                    config.debug && logger.info(`${MODTITLE} Item found in database, Removing Penalties of id:${mag}`)

                    magazine._props.LoadUnloadModifier = loadUnloadTimeModifierValue;
                    magazine._props.CheckTimeModifier = checkTimeModifierValue;

                    config.debug && logger.info(`${MODTITLE} Penalties removed of item id:${mag}`)
                    return
                }
                logger.error(`${MODTITLE}: failed to remove penalties of magazine with the id: ${mag}. If this is a modded item then it may not be compatible with this mod`)
            }
        })

        logger.info(`${MODTITLE} ${magazines.length} Higher capacity Magazine Penalties removed`);
        logger.info(`${MODTITLE} has finished`);
    }
}

module.exports = {mod: new RemoveHigherCapacityMagazineLoadPenalties()}