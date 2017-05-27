/*:
 * @plugindesc depreacted classes
 * @author Sarlecc
 * @help
 * Copyright (c) 2017, Sarlecc (Mythical Games)
 * Licensed under GPL-3.0 https://github.com/Sarlecc/ExEngine/blob/master/LICENSE
 * Permission to use, copy, modify, and/or distribute this software for free or for a fee 
 * are hereby granted provided that the above copyright notice and this permission notice 
 * appear in all copies.
 */
 
/*
 * deprecated classes
 */
(function () {

/*
 * deprecation of class Scene_Load
 */
function Scene_Load () {
	console.warn("Scene_Load is deprecated and no longer has any functionality");
};

/*
 * deprecation of class Scene_Save
 */
function Scene_Save () {
	console.warn("Scene_Save is deprecated and no longer has any functionality");
};

/*
 * deprecation of class Scene_Debug
 */
 function Scene_Debug () {
   console.warn("Scene_Debug is deprecated and no longer has any functionality");
 };

/*
 * deprecation of class Window_SaveFileList
 */
function Window_SaveFileList () {
	console.warn("Window_SaveFileList is deprecated and no longer has any functionality");
};

/*
 * deprecation of class Window_DebugEdit
 */
 function Window_DebugEdit () {
   console.warn("Window_DebugEdit is deprecated and no longer has any functionality");
 };
 
 /*
  * deprecation of class Window_DebugRange
  */
  function Window_DebugRange () {
     console.warn("Window_DebugRange is deprecated and no longer has any functionality");
  };
})();

/*
 * deprecated functions
 */
(function () {
	//TODO actually might want to keep loadGlobalInfo and saveGlobalInfo only rewrite them to save to server
	DataManager.loadGlobalInfo = function() {
        console.warn("loadGlobalInfo has been deprecated");
    };

    DataManager.saveGlobalInfo = function() {
        console.warn("saveGlobalInfo has been deprecated");
    };

    DataManager.isThisGameFile = function() {
    	console.warn("isThisGameFile has been deprecated");
    };
	
	DataManager.isAnySavefileExists = function() {
		console.warn("isAnySavefileExists has been deprecated");
    };
	
	DataManager.latestSavefileId = function() {
		console.warn("latestSavefileId has been deprecated");
    };
	
	DataManager.saveGame = function() {
        console.warn("saveGame has been deprecated");
    };

    DataManager.loadGame = function() {
        console.warn("loadGame has been deprecated");
    };

    DataManager.loadSavefileInfo = function() {
        console.warn("loadSavefileInfo has been deprecated");
    };

    DataManager.lastAccessedSavefileId = function() {
        console.warn("lastAccessedSavedfileId has been deprecated");
    };

    DataManager.saveGameWithoutRescue = function() {
        console.warn("saveGameWithoutRescue has been deprecated");
    };

    DataManager.loadGameWithoutRescue = function() {
    	console.warn("loadGameWithoutRescue has been deprecated");
    };

    DataManager.selectSavefileForNewGame = function() {
        console.warn("selectSavefileForNewGame has been deprecated");
    };

    DataManager.makeSavefileInfo = function() {
    	console.warn("makeSavefileInfo has been deprecated");
    };

})();
