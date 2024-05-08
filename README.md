# What

This mod removes the check and loading of magazines that have debuffs to loading/unloading times and checking times. It does this by first scanning the database, then programmatically setting the debuffs to whatever the config is.



This is compatible with other mods that add new magazines like THE LITTLE DRUMMER BOY by Tron. It should work for any magazine that is less than whatever the value in the config, load/unload and checkTime are evaluated separately. You could try setting negative values but I have only tested this with the loadUnload and checkTime values below. In order for this mod to remove other mod's debuffs you will need to load this mod AFTER those mods. Use LOE (LOAD ORDER EDITOR) by Hazelify to modify your "order.json" file. Remember this only changes what it sees in the database, if a magazine is added after it then this mod will never know about it. As of 1.1, You can specify magazine's to be ignored in the config.



# How to install

This is a server side mod, just unzip it and place it in your "user/mods" folder and ensure it loads after any mod that adds magazines that you want to change.



in the server log you will see lines starting with "[RemoveMagazineLoadPenalties]", every log from this mod should start with this. The number in the log line

[tt]" [RemoveMagazineLoadPenalties] {{number}} Magazine Penalties removed"[/tt] should be self explanatory but only magazines that had values worse than the modifiers in the config should count towards this number. If only one value is changed it will count toward this number so keep that in mind if it is not behaving how you want it to. It's really just for removing debuffs, not buffing mags. Extend the mod if you want to be able to modify mags, read the bottom about reusing this code.



# Default config



    {
    "debug": false,
    "debugMagazineScanLog": false,
    "loadUnloadModifier": 0,
    "checkTimeModifier": 10,
    "magazinesToIgnore": [
    "ItemIdHere",
    "IfYourMagazineIsAVanillaTarkovItemUseThisSite{https://db.sp-tarkov.com/}",
    "OtherwiseYouWillEitherNeedToBuyItFromTheStoreAndLookAtTheRunningServerLog",
    "OrReadTheCodeOfTheModYouAreUsing"
     ]
    }


# debug

changing debug to true will set logging to verbose. If you are having an issue with a magazine not being modified this should be the first place you look

## debugMagazineScanLog

This is another debug logging level that scans every single item in the database. It is set to false so that normal debugging is still readable. If you are not seeing your magazine id in the original debug logs than set this to true and you should be able to find logs from this mod and what it does with those Id's



## loadUnloadModifier

This is the main debuff and it nullifies the mag to behave like a standard lower capacity mag at least where loading/unloading is concerned



## checkTimeModifier

This is another debuff that is mostly removed however not completely removed. a value in the 10-30 range is fair but nothing is stopping you from going lower.



Expect very little help concerning this mod. You have every ability to read what the code is doing and fix it. I am planning on abandoning this very quickly.



## magazinesToIgnore

added as of 1.1, this is a list of the magazines in which you intend for their debuffs to remain. You will need to place the items id here. Use https://db.sp-tarkov.com/ if the item you want to ignore is a vanilla item. You want the [tt]_id[/tt] field, not the tpl. If the item you want to be ignored is a modded item then you will have to either buy the item from the store and note the Node server's running log as it will specify what itemId was just purchased or sold OR you will have to read the database template json file of the mod you added. This is much easier than you think, most of the time modders use the same id as its internal name such as LittleDrummerBoy's UMP casket mag is like this



    ...
    "UMPCasketMagazine": {
        "_id": "UMPCasketMagazine",
        "_name": "UMPCasketMagazine",
    ... }


### Note to other Developers

The code in its base state is completely free to use or incorporate into other mods. I wouldn't ask permission if I wanted to make something and I won't expect anything different from anyone else. That includes merely changing the version numbers in the future to make it compatible with newer version of SPT and uploading under your own name. The code should be completely fine for future versions of SPT unless the database object changes. Consult the interfaces in the ts file and verify that structure is the same if it isn't working.



smooches XOXOXO



Source code
