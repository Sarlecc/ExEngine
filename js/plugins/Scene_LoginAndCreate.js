/*:
 * @plugindesc NOT FOR A PRODUCTION ENVIROMENT YET
 * @author Sarlecc
 * @help
 * Copyright (c) 2017, Sarlecc (Mythical Games)
 * Licensed under GPL-3.0 https://github.com/Sarlecc/ExEngine/blob/master/LICENSE
 * Permission to use, copy, modify, and/or distribute this software for free or for a fee 
 * are hereby granted provided that the above copyright notice and this permission notice 
 * appear in all copies.
 */

//THIS CODE IS FOR A NON PRODUCTION ENVIROMENT AT THE MOMENT
//TODO add a cancel button? needs to get changed to esc button
//TODO add someparams for using .pngs for the background windows?
//TODO store the username and pass on server when client logs in along with socketid will avoid some potential
//security risks then. Also might want to go through code and rewrite parts of it.
//also if I store the username and pass on the server I can remove some of the sending username and pass to server
//that I am currently doing.
//TODO change Create and Login method in help window only codes to use TextManager.newGame and TextManager.continue_
const SAR_Special = {};
var SAR = SAR || {};
/**
 * SAR_Special.Window_User constructor function for private variables
 * relating to login and account creation
 */
Object.defineProperty(SAR_Special, 'Window_User', {
	value: function (){
		
	var user = {
		'name': "",
		'pass': ""
	};
    var maxLength = 20;
    var indexes = {
    	'name': user['name'].length,
    	'pass': user['pass'].length
    }; 
    var asterx = "";
    
    if (typeof SAR_Special.Window_User.userName === 'undefined') {
    /**
     * function SAR_Special.Winow_User.userName
     * returns the user name
     */
     Object.defineProperty(SAR_Special.Window_User, 'userName', {
            value: function() { 
            	      return user['name']; 
            	   }
     });
    
    /**
     * function SAR_Special.Window_User.asterx
     * returns the pass in asterxes '*'
     */
    Object.defineProperty(SAR_Special.Window_User, 'asterx', {
            value: function() { 
            	      return asterx;
            	   }
     });

    */
    /**
     * function SAR_Special.Window_User.reset
     * params key {string}
     * 
     * erases the user name or pass depending on the key
     * 
     * returns false
     */
    Object.defineProperty(SAR_Special.Window_User, 'reset', {
            value: function(key) { 
            	       user[key] = "";
    	               if (key === 'pass') {
    		               asterx = "";
    	               }
    	               indexes[key] = user[key].length;
    	               return user[key].length > 0;
    	           }
     });

    /**
     * function SAR_Special.Window_User.add
     * params key {string}
     * params ch {string}
     * 
     * adds a character to the end of the user name or pass depending
     * on the key and if it is below the max length.
     * 
     * returns true or false
     */
    Object.defineProperty(SAR_Special.Window_User, 'add', {
            value: function(key, ch) {
    	               if (indexes[key] < maxLength) {
    		               user[key] += ch;
    		               if (key === 'pass') {
    			               asterx += '*';
    		               }
    		               indexes[key]++;
    		               return true;
    	               } else {
    		               return false;
    	               }
    	           }
     });
     
    /**
     * function SAR_Special.Window_User.back
     * params key {string}
     * 
     * removes a character from the end of the user name or pass depending
     * on the key and if it is below the max length.
     * 
     * returns true or false
     */
     Object.defineProperty(SAR_Special.Window_User, 'back', {
            value: function(key) {
    	               if (indexes[key] > 0) {
    		               indexes[key]--;
    		               if (key === 'pass') {
    			               asterx = asterx.slice(0, indexes[key]);
    		               }
    		              user[key] = user[key].slice(0, indexes[key]);
    		              return true;
    	               } else {
    		              return false;
    	               }
    	           }
     });

    /**
     * function SAR_Special.Window_User.maxLengthed
     * 
     * returns the maxlength
     */
    Object.defineProperty(SAR_Special.Window_User, 'maxLengthed', {
            value: function() {
    	               return maxLength;
    	           }
     });

    /**
     * SAR_Special.Window_User.indexed
     * params key {string}
     * 
     * returns the length of the user name or pass
     */
    Object.defineProperty(SAR_Special.Window_User, 'indexed', {
           value: function(key) {
    	              return indexes[key];
    	          }
    });

    /**
     * SAR_Special.Window_User.send
     * params method {string}
     * 
     * sends user name and pass to server
     * 
     * returns TODO what does it return or do
     * returns error
     */
    Object.defineProperty(SAR_Special.Window_User, 'send', {
           value: function(method) {
    	              //TODO SOCKET.IO call here
    	              socket.emit(method, user, function(data) {
    		              try {
    		                  if (data.success === true) {
    			                  // success
    		                  } else if (data.success === false) {
    			                  throw data.err
    		                  }
    		              } catch (e) {
    			              return e
    		              }
    	              });
    	          }
    });
    
    Object.defineProperty(SAR_Special.Window_User, 'resetAll', {
    	value: function () {
    		user['name'] = '';
    		user['pass'] = '';
    		asterx = '';
    		}
    });
    
    } else {
    	SAR_Special.Window_User.resetAll();
    }
    return SAR_Special.Window_User
    }
});
    
    SAR.Window_User = function () {
    	this.initialize.apply(this, arguments);
    };
    
    SAR.Window_User.prototype = Object.create(Window_Base.prototype);
	SAR.Window_User.prototype.constuctor = SAR.Window_User;
	
    SAR.Window_User.prototype.initialize = function () {
	    var width = this.windowWidth();
	    var height = this.windowHeight() / 2;
	    //TODO change location to be more center screen?
	    var x = (Graphics.boxWidth - width) / 2;
        var y = (Graphics.boxHeight - (height + this.fittingHeight(9) + 8)) / 1.5;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._accept = {'name': false, 'pass': false};
        this._data = 'name';
        this._special = SAR_Special.Window_User();
        this.deactivate();
        this.refresh();
    };
    
    //the window width of the user name window
    SAR.Window_User.prototype.windowWidth = function () {
    	return 480;
    };
    
    SAR.Window_User.prototype.windowHeight = function () {
    	return this.fittingHeight(4);
    };
    
    SAR.Window_User.prototype.charWidth = function() {
        var text = $gameSystem.isJapanese() ? '\uff21' : 'A';
        return this.textWidth(text);
    };
    
    SAR.Window_User.prototype.add = function (key, ch) {
    	return this._special.add(key, ch);
    };
    
    SAR.Window_User.prototype.back = function (key) {
    	return this._special.back(key);
    };
    
    SAR.Window_User.prototype.reset = function (key) {
    	return this._special.reset(key);
    };
    
    SAR.Window_User.prototype.data = function () {
    	return this._special.userName();
    };
    
    SAR.Window_User.prototype.accepted = function () {
    	return this._accept;
    };
    
    //TODO not sure if I can use return here due to callback functions
    SAR.Window_User.prototype.send = function (method) {
    	return this._special.send(method);
    };
    
    SAR.Window_User.prototype.left = function() {
        var nameCenter = (this.contentsWidth()) / 2;
        var nameWidth = (this._special.maxLengthed() + 1) * this.charWidth();
        return Math.min(nameCenter - nameWidth / 2, this.contentsWidth() - nameWidth);
    };

    SAR.Window_User.prototype.itemRect = function(index) {
        return {
            x: this.left() + index * this.charWidth(),
            y: 16, // normal 54
            width: this.charWidth(),
            height: this.lineHeight()
        };
    };

    SAR.Window_User.prototype.underlineRect = function(index) {
        var rect = this.itemRect(index);
        rect.x++;
        rect.y += rect.height - 4;
        rect.width -= 2;
        rect.height = 2;
        return rect;
    };
    
    SAR.Window_User.prototype.underlineColor = function() {
        return this.normalColor();
    };

    SAR.Window_User.prototype.drawUnderline = function(index) {
        var rect = this.underlineRect(index);
        var color = this.underlineColor();
        this.contents.paintOpacity = 48;
        this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.contents.paintOpacity = 255;
    };
    
    //TODO this will need to get changed so as to show asterxes on the window when writing passwords
    //Think this works?
    SAR.Window_User.prototype.drawChar = function(index) {
        var rect = this.itemRect(index);
        this.resetTextColor();
        if (this._data === 'name') {
        this.drawText(this._special.userName()[index] || '', rect.x, rect.y);
        } else if (this._data === 'pass') {
        	this.drawText(this._special.asterx()[index] || '', rect.x, rect.y);
        }
    };

    SAR.Window_User.prototype.refresh = function() {
        this.contents.clear();
        for (var i = 0; i < this._special.maxLengthed(); i++) {
            this.drawUnderline(i);
        }
        if (this._data === 'name') {
            for (var n = 0; n < this._special.userName().length; n++) {
                this.drawChar(n);
            }
        } else if (this._data === 'pass') {
        	for (var p = 0; p < this._special.asterx().length; p++) {
        		this.drawChar(p)
        	}
        }
        var rect = this.itemRect(this._special.indexed(this._data));
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    };
    
    SAR.Window_User.prototype.update = function () {
    	if (Input._latestButton !== null && Input.isRepeated(Input._latestButton) && this.active) {
		    if (Input._latestButton === 'backspace' && this.back(this._data)) {
		    	this.refresh();
		    } else if (!Input.dontType.includes(Input._latestButton)) {
		    	if (this.add(this._data, Input._latestButton)) {
		    	    this.refresh();
		    	}
		    } else if (Input._latestButton === 'enter') {
		    	this._accept[this._data] = true;
		    }
	    }
    };
 
/*
 * Scene_CreateLoginAccount
 */
SAR.Scene_CreateLoginAccount = function (){
	this.initialize.apply(this, arguments);
};

	SAR.Scene_CreateLoginAccount.prototype = Object.create(Scene_MenuBase.prototype);
    SAR.Scene_CreateLoginAccount.prototype.constructor = SAR.Scene_CreateLoginAccount;
    
    SAR.Scene_CreateLoginAccount.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
        this.sceneName = "Scene_CreateLoginAccount";
        this._method = "Login";
    };

    SAR.Scene_CreateLoginAccount.prototype.prepare = function (method) {
    	this._method = method;
    };

    SAR.Scene_CreateLoginAccount.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createEditWindow();
        this.createHelpWindow();
    };

    SAR.Scene_CreateLoginAccount.prototype.start = function () {
        Scene_MenuBase.prototype.start.call(this);
        this._editWindow.refresh();
    };

    SAR.Scene_CreateLoginAccount.prototype.createEditWindow = function () {
        this._editWindow = new SAR.Window_User;
        this.addWindow(this._editWindow);
        this._editWindow.activate();
    };
       
    SAR.Scene_CreateLoginAccount.prototype.createHelpWindow = function () {
    	this._helpWindow = new Window_Help;
    	this.addWindow(this._helpWindow);
    	this._helpWindow.setText(this._method + ": please enter a user name");
    };

    SAR.Scene_CreateLoginAccount.prototype.onInputUserOk = function () {
    	this._editWindow._data = 'pass';
    	this._editWindow.refresh();
    	this._helpWindow.setText(this._method + ": please enter a password for... " + this._editWindow.data());
    };
    
    //TODO this will need to get changed to to reflect the socket.io server
    SAR.Scene_CreateLoginAccount.prototype.onInputPassOk = function () {
    	if (this._method === "Create") {
    		this._editWindow = null;
    		this._helpWindow = null;
    		SceneManager.goto(Scene_Map);
    		//this._editWindow.send(this._method);
    	} else if (this._method === "Login") {
    		//this.editWindow.send(this._method);
    	}
    };
    
    SAR.Scene_CreateLoginAccount.reupdate = SAR.Scene_CreateLoginAccount.prototype.update;
    
    SAR.Scene_CreateLoginAccount.prototype.update = function () {
    	SAR.Scene_CreateLoginAccount.reupdate.call(this);
    	if (this._editWindow.accepted()['name'] && this._editWindow._data !== 'pass') {
    		this.onInputUserOk();
    	}
    	if (this._editWindow.accepted()['pass']) {
    		this.onInputPassOk();
    	}
    };

/*
 * Class Window_TitleCommand
 */    
(function (WTC) {
	
	/**
	 * overwrite of makeCommandList
	 */
	WTC.prototype.makeCommandList = function() {
        this.addCommand(TextManager.newGame,   'createAccount');
        this.addCommand(TextManager.continue_, 'loginAccount');
        this.addCommand(TextManager.options,   'options');
    };
    
})(Window_TitleCommand);

/*
 * Class Window_MenuCommand
 */
(function (WMC) {
	
	/**
	 * overwrite of makeCommandList
	 */
	WMC.prototype.makeCommandList = function() {
        this.addMainCommands();
        this.addFormationCommand();
        this.addOriginalCommands();
        this.addOptionsCommand();
        this.addGameEndCommand();
    };
    
})(Window_MenuCommand);


/*
 *  Class Scene_Title
 */    
(function (ST) {
	
	/**
	 * overwrite of createCommandWindow
	 */
    ST.prototype.createCommandWindow = function() {
        this._commandWindow = new Window_TitleCommand();
        this._commandWindow.setHandler('createAccount',  this.commandNewGame.bind(this));
        this._commandWindow.setHandler('loginAccount', this.commandContinue.bind(this));
        this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
        this.addWindow(this._commandWindow);
    };
    
    /**
     * overwrite of commandNewGame
     */
    ST.prototype.commandNewGame = function() {
        this._commandWindow.close();
        //TODO use goto or push?
        SceneManager.push(SAR.Scene_CreateLoginAccount);
        SceneManager.prepareNextScene("Create");
    };
    
    /**
     * overwrite of commandContinue
     */
    ST.prototype.commandContinue = function() {
        this._commandWindow.close();
        SceneManager.push(SAR.Scene_CreateLoginAccount);
        SceneManager.prepareNextScene("Login");
    };
})(Scene_Title);

