/*:
 * @plugindesc Debug Files
 * @author Sarlecc
 * @help
 * Copyright (c) 2017, Sarlecc (Mythical Games)
 * Licensed under GPL-3.0 https://github.com/Sarlecc/ExEngine/blob/master/LICENSE
 * Permission to use, copy, modify, and/or distribute this software for free or for a fee 
 * are hereby granted provided that the above copyright notice and this permission notice 
 * appear in all copies.
 *
 * TODO rewrite original Scene_Debug to be more powerful
 * Because of this will not be including it in this release yet.
 */
 
 //-----------------------------------------------------------------------------
// Window_SkillStatsCommand
//
// The window for selecting either actors or enemies to show in the SkillStats list
// window.
// This class should be fairly self explantory as it is based off of Window_MenuCommand

function Window_SkillStatsCommand() {
    this.initialize.apply(this, arguments);
}

Window_SkillStatsCommand.prototype = Object.create(Window_Command.prototype);
Window_SkillStatsCommand.prototype.constructor = Window_SkillStatsCommand;

Window_SkillStatsCommand.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
    this.selectLast();
};

Window_SkillStatsCommand._lastCommandSymbol = null;

Window_SkillStatsCommand.initCommandPosition = function() {
    this._lastCommandSymbol = null;
};

Window_SkillStatsCommand.prototype.windowWidth = function() {
    return 240;
};

Window_SkillStatsCommand.prototype.numVisibleRows = function() {
    return this.maxItems();
};

Window_SkillStatsCommand.prototype.makeCommandList = function() {
    this.addMainCommands();
    this.addOriginalCommands();
};

Window_SkillStatsCommand.prototype.addMainCommands = function() {
        this.addCommand('Actors', 'actors', true);
        this.addCommand('Enemies', 'enemies', true);
        this.addCommand('Search', 'search', true);
        this.addCommand('Cancel', 'cancel', true);
};

Window_SkillStatsCommand.prototype.addOriginalCommands = function() {
};

Window_SkillStatsCommand.prototype.processOk = function() {
    Window_SkillStatsCommand._lastCommandSymbol = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};

Window_SkillStatsCommand.prototype.selectLast = function() {
    this.selectSymbol(Window_SkillStatsCommand._lastCommandSymbol);
};

//-----------------------------------------------------------------------------
// Window_SkillStatsSelection
//
// The window for selecting a particular monster/actor
function Window_SkillStatsSelection() {
    this.initialize.apply(this, arguments);
}

Window_SkillStatsSelection.prototype = Object.create(Window_Selectable.prototype);
Window_SkillStatsSelection.prototype.constructor = Window_SkillStatsSelection;

/**
 * initialize explantion of variables:
 * this._actors is used when the actors command is selected.
 * this._enemies is used when the enemies command is selected.
 * this._all is used when the search command is selected.
 * this._symbol is the command that is currently selected.
 * this._current this is the actor/enemy that is currently selected.
 * 
 * unused variables?:
 * this._formationMode 
 */
Window_SkillStatsSelection.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    this._actors = [];
    this._enemies = [];
    this._all = [];
    this._symbol = '';
    this._current = null;
    this.createDataArrays();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._formationMode = false;
    this._pendingIndex = -1;
    this.loadImages();
    this.refresh();
};

Window_SkillStatsSelection.prototype.windowWidth = function() {
    return Graphics.boxWidth - 240;
};

Window_SkillStatsSelection.prototype.windowHeight = function() {
    return Graphics.boxHeight - 72;
};

/**
 * createDataArrays
 * this function creates all Game_Actors and Game_Enemies and
 * stores them into their arrays. Finally the arrays get combined and stored
 * in the this._all array.
 */
Window_SkillStatsSelection.prototype.createDataArrays = function() {
	var aLength = $dataActors.length;
	var eLength = $dataEnemies.length;
	var data = {};
	for (var i = 1; i < aLength; i++) {
		data = new Game_Actor(i);
		this._actors.push(data);
	}
	for (var i = 1; i < eLength; i++) {
		data = new Game_Enemy(i, 0, 0);
		this._enemies.push(data);
	}
	this._all = this._actors.concat(this._enemies);
};

Window_SkillStatsSelection.prototype.maxCols = function() {
	return 3;
};

/**
 * maxItems this function returns the length of the arrays
 * based on which command was selected. Defaults to the actor
 * array if no command was found yet. 
 */
Window_SkillStatsSelection.prototype.maxItems = function() {
	switch (this._symbol) {
		case 'actors':
		return this._actors.length;
		break;
		case 'enemies':
		return this._enemies.length;
		break;
		case 'search':
		return this._all.length;
		break;
		default:
		return this._actors.length;
	}
};

Window_SkillStatsSelection.prototype.itemHeight = function() {
    var clientHeight = this.height - this.padding * 2;
    return Math.floor(clientHeight / this.numVisibleRows());
};

Window_SkillStatsSelection.prototype.numVisibleRows = function() {
    return 3;
};

Window_SkillStatsSelection.prototype.loadImages = function() {
		this._actors.forEach(function(actor) {
			ImageManager.loadFace(actor._faceName);
		}, this);
		this._enemies.forEach(function(enemy) {
			ImageManager.loadEnemy(enemy.battlerName(), enemy.battlerHue());
		}, this);
};

/**
 * drawItem this function handles which images to draw  
 */
Window_SkillStatsSelection.prototype.drawItem = function(index) {
    this.drawItemBackground(index);
    var rect = this.itemRect(index);
    rect.width -= this.textPadding();
    switch (this._symbol) {
    	case 'actors':
    	var actor = this._actors[index];
        this.drawActorImage(actor, rect.x, rect.y, rect.width - 3, rect);
        break;
    	case 'enemies':
    	var enemy = this._enemies[index];
        this.drawEnemyImage(enemy, rect.x, rect.y, rect.width - 3, rect);
        break;
    	case 'search':
    	var element = this._all[index];
    	console.log(element);
    	if (element.isActor()) {
    		this.drawActorImage(element, rect.x, rect.y, rect.width - 3, rect);
    	} else if (element.isEnemy()) {
    		this.drawEnemyImage(element, rect.x, rect.y, rect.width - 3, rect);
    	}
    	break;
    	default:
    	var actor = this._actors[index];
        this.drawActorImage(actor, rect.x, rect.y, rect.width - 3, rect);
    }
};

/**
 * drawActorImage this function handles the drawing of Actor images.  
 */
Window_SkillStatsSelection.prototype.drawActorImage = function(item, x, y, width, rect) {
	var rect = rect;
    var width = width || 312;
    if (item) {
        var faceBoxHeight = Window_Base._faceHeight - 14;
        this.resetTextColor();
        this.drawActorFace(item, x + 2, y + 2, 144, rect.height - 2);
        this.drawText(item.name(), x + 24, y + faceBoxHeight, width);
    }
};

/**
 * drawEnemyImage this function handles the drawing of EnemyImages. 
 */
Window_SkillStatsSelection.prototype.drawEnemyImage = function (item, x, y, width, rect) {
	var rect = rect;
	var width = width || 312;
	if (item) {
		var boxHeight = Window_Base._faceHeight - 14;
		this.resetTextColor();
		this.drawEnemy(item, x + 2, y + 2, 144, rect.height - 2);
		this.drawText(item.name(), x + 24, y + boxHeight, width);
	}
};
//TODO you know I may actually want to put this in the Window_Base class.
/**
 * drawEnemy this function allows for drawing enemies on a window. 
 */
Window_SkillStatsSelection.prototype.drawEnemy = function(enemy, x, y, width, height) {
    width = width || Window_Base._faceWidth;
    height = height || Window_Base._faceHeight;
    var bitmap = ImageManager.loadEnemy(enemy.battlerName(), enemy.battlerHue());
    var pw = Window_Base._faceWidth;
    var ph = Window_Base._faceHeight;
    var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    var sx = 0;
    var sy = 0;
    var dw = Math.floor(pw - 6);
    var dh = Math.floor(ph - 7);
    this.contents.blt(bitmap, sx, sy, bitmap.width, bitmap.height, dx, dy, dw, dh);
};

Window_SkillStatsSelection.prototype.drawItemBackground = function(index) {
    if (index === this._pendingIndex) {
        var rect = this.itemRect(index);
        var color = this.pendingColor();
        this.changePaintOpacity(false);
        this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.changePaintOpacity(true);
    }
};

Window_SkillStatsSelection.prototype.processOk = function() {
    Window_Selectable.prototype.processOk.call(this);
};

/**
 * setCurrent this sets which actor/enemy you are currently selecting. 
 */
Window_SkillStatsSelection.prototype.setCurrent = function () {
	    switch (this._symbol) {
    	case 'actors':
    	this._current = this._actors[this._index];
        break;
    	case 'enemies':
    	this._current = this._enemies[this._index];
        break;
    	case 'search':
    	this._current = this._all[this._index];
    	break;
    	default:
    	this._current = this._actors[this._index];
    }
};

/**
 * returnCurrent this function returns what is currently selected. 
 */
Window_SkillStatsSelection.prototype.returnCurrent = function () {
	return this._current;
};

//FIXME make this select the last item that was selected
//This may be difficult as it takes information from both Game_Actors and Game_Enemy
Window_SkillStatsSelection.prototype.selectLast = function() {
    this.select(0);
};

Window_SkillStatsSelection.prototype.pendingIndex = function() {
    return this._pendingIndex;
};

Window_SkillStatsSelection.prototype.setPendingIndex = function(index) {
    var lastPendingIndex = this._pendingIndex;
    this._pendingIndex = index;
    this.redrawItem(this._pendingIndex);
    this.redrawItem(lastPendingIndex);
};

Window_SkillStatsSelection.prototype.refresh = function(symbol, text) {
	this._symbol = symbol || this._symbol;
	this.updateArrays(text);
	if (this.contents) {
        this.contents.clear();
        this.drawAllItems();
    }
};

// FIXME Complexity of this code may be to great might want to reduce
//complexity 10-14
//might also want to use switch case statements instead of if else statements as it might be eaiser to read.
/**
 * updateArrays this function updates the arrays based on what is typed in the search bar.
 *  
 */
Window_SkillStatsSelection.prototype.updateArrays = function (text) {
	text = text || '.';
	var data = {},
        i,
        regexp,
        aLength = $dataActors.length,
        eLength = $dataEnemies.length;
	try {
	  regexp = new RegExp(text, 'g');
	} catch (e) {
		text = '.';
		regexp = /./g;
		console.warn(e + ': in skill stats search bar. Defaulting to all.');
	}
	if (this._symbol === 'actors') {
		this._actors = [];
	    for (i = 1; i < aLength; i++) {
		     data = new Game_Actor(i);
		     if (data.name().match(regexp)){
		         this._actors.push(data);
		     }
	      }
		} else if (this._symbol === 'enemies') {
			this._enemies = [];
			for (i = 1; i < eLength; i++){
				data = new Game_Enemy(i, 0, 0);
				if (data.name().match(regexp)){
					this._enemies.push(data);
				}
			}
		} else if (this._symbol === 'search') {
	        this._all = [];
	        for (i = 1; i < aLength; i++) {
		         data = new Game_Actor(i);
		         if (data.name().match(regexp)){
		             this._all.push(data);
		         }
	        }
	        for (i = 1; i < eLength; i++){
				 data = new Game_Enemy(i, 0, 0);
				 if (data.name().match(regexp)){
					 this._all.push(data);
				 }
			}
		}
};

/**
 * drawAllItems this function loops through the indexes and calles the drawItem function. 
 */
Window_SkillStatsSelection.prototype.drawAllItems = function() {
    var topIndex = this.topIndex();
    for (var i = 0; i < this.maxPageItems(); i++) {
        var index = topIndex + i;
        if (index < this.maxItems()) {
            this.drawItem(index);
        }
    }
};
//-----------------------------------------------------------------------------
// Window_SkillStatsSearch
//
// The search bar for looking for a particular monster/actor
// The following code is based off a piece of yanfly's rpgmaker vx ace
// debug script
function Window_SkillStatsSearch() {
    this.initialize.apply(this, arguments);
};

Window_SkillStatsSearch.prototype = Object.create(Window_Base.prototype);
Window_SkillStatsSearch.prototype.constructor = Window_SkillStatsSearch;

Window_SkillStatsSearch.prototype.initialize = function (x, y) {
	 var width = Graphics.width;
     var height = 72;
     this.blinker = false;
     this.maxium = 300;
     this.text = '';
     Window_Base.prototype.initialize.call(this, x, y, width, height);
     this.contents.fontSize = 16;
     this.contents.textColor = '#0FAB84';
     this.refresh();
};

Window_SkillStatsSearch.prototype.refresh = function() {
	this.contents.clear();
	this.contents.fillRect(0, 0, this.width, this.height, '#FFFFFF');
	 this.contents.fillRect(1, 1, this.width-2, this.height-2, '#000000');
	if (this.blinker) {
		this.drawText(this.text+ '▌', 4, 4, this.width);
	} else {
		this.drawText(this.text, 4, 4, this.width);
	}
};

Window_SkillStatsSearch.prototype.update = function() {
	this.blinker = Graphics.frameCount % 30 === 0 ? !this.blinker : this.blinker;
	if (Input._latestButton !== null && Input.isRepeated(Input._latestButton)) {
		if (Input._latestButton === 'backspace' && this.text.length > 0) {
			this.text = this.text.slice(0, -1);
		} else if (this.text.length <= this.maxium && !Input.dontType.includes(Input._latestButton)) {
			this.text = this.text + Input._latestButton;
		}	
	}
	this.refresh();
};

Window_SkillStatsSearch.prototype.getText = function() {
	return this.text;
};

//-----------------------------------------------------------------------------
// Window_SkillStats
//
// The end window which displays infomation on skills used by the monster/actor
//TODO create a scroll through long skill lists feature?
function Window_SkillStats(){
	this.initialize.apply(this, arguments);
};

Window_SkillStats.prototype = Object.create(Window_Selectable.prototype);
Window_SkillStats.prototype.constructor = Window_SkillStats;

Window_SkillStats.prototype.initialize = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    this._totalUses = 0;
    this._skillData = {};
    this._checking = false;
    this.refresh();
    this.activate();
};

/**
 * createLine this function creates a new PIXI.Graphics object allowing
 * a line to be drawn on the graph. 
 */
Window_SkillStats.prototype.createLine = function() {
	this.line = new PIXI.Graphics;
	this.line.lineStyle(1, 0x994000, 1);
};

//TODO will need to change this so that it is more global
//how about setCharacter?
/**
 * setActor this function handles the current character that you are viewing. 
 */
Window_SkillStats.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.getSkillData();
        this.createLine();
        this.refresh();
    }
};

/**
 * getSkillData this function requests data from the server based on the character you are viewing. 
 */
Window_SkillStats.prototype.getSkillData = function(){
	//FIXME check if it is an enemy grab from enemySkills think this one is done but leaving this message in
	//to be sure
	if (this._actor.isActor()) {
	   var request = {name: this._actor._name, collection: "actorSkills"};
	} else {
	   var request = {name: $dataEnemies[this._actor._enemyId].name, collection: "enemySkills"};
	}
	var self = this;
	socket.emit("retrieve data", request, function(data) {
		self._skillData = data;
		self.getMaxSkillUsed();
		self.totalUses();
		self.refresh(); //TODO added this line.... from update think this is good
	});
};

/**
 * getMaxSkillUsed this function is used by the graph to figure out how high to draw each line 
 */
Window_SkillStats.prototype.getMaxSkillUsed = function() {
	var tempArray = [];
	console.log(this._skillData.data.skills);
	for (var i = 0; i < this._skillData.data.skills.length; i++) {
		 tempArray.push(this._skillData.data.skills[i][2])
    };
    this._maxSkillUsed = Math.max.apply(Math, tempArray);
    tempArray = [];
};

/**
 * totalUses this function adds up all the skill uses together to figure out percents. 
 */
Window_SkillStats.prototype.totalUses = function() {
	for (var i = 0; i < this._skillData.data.skills.length; i++) {
		this._totalUses += this._skillData.data.skills[i][2];
	}
	this.makePercent();
	this.avgDamage();
};

/**
 * makePercent this function adds percent data to the data array. 
 */
Window_SkillStats.prototype.makePercent = function() {
	for (var i = 0; i < this._skillData.data.skills.length; i++) {
		this._skillData.data.skills[i].splice(3, 0, ((this._skillData.data.skills[i][2] / this._totalUses) * 100).toFixed(2) + '%');
	}
};

/**
 * avgDamage calculates the avgDamage that the skills have inflicted. 
 */ 
Window_SkillStats.prototype.avgDamage = function () {
	for (var i = 0; i < this._skillData.data.skills.length; i++) {
		this._skillData.data.skills[i][4] = 
		(this._skillData.data.skills[i][4].reduce(function (acc, currV){return acc + currV;}) / 
		this._skillData.data.skills[i][4].length).toFixed(2);
	}
};

Window_SkillStats.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        var lineHeight = this.lineHeight();
        this.drawBlock1(lineHeight * 0); // draw the name
        this.drawHorzLine(lineHeight * 1);
        this.drawBlock2(lineHeight * 0); // draw the face / enemy graphic
        this.drawHorzLine(lineHeight * 8);
        this.drawBlock3(lineHeight * 2); // draw params this will get changed to draw skill data columns
        this.drawBlock4(lineHeight * 3); // draw skill stats
        this.drawBlock5(lineHeight * 9);
    }
};

Window_SkillStats.prototype.drawBlock1 = function(y) {
	//TODO change this to draw text instead?
    this.drawActorName(this._actor, 68, y);
    //TODO change this._actor to a more univerisal name
    if (this._actor.isActor()) {
        this.drawActorFace(this._actor, 2, y - 4);
    } else {
   	    this.drawEnemyGraphic(this._actor, 2, y - 4);
    }
};

//TODO use this block to draw some commands?
Window_SkillStats.prototype.drawBlock2 = function(y) {
	
};

//TODO Move this function to Window_Base rename to drawFaceResizable
//also make a drawEnemyGraphicResizable version though I might take the one I have and turn it into that
/**
 * Draws an actor face that can be resized
 * @param faceName
 * @param faceIndex
 * @param x location of picture on x axis
 * @param y location of picture on y axis
 * @param pwd a divisor that divides the width of the final picture
 * @param phd a divisor that divides the height of the final picture 
 */
Window_SkillStats.prototype.drawFace = function(faceName, faceIndex, x, y, pwd, phd) {
	//TODO do I want to allow changes to the width and height variables?
	pwd = pwd || 1;
	phd = phd || 1;
    var width = Window_Base._faceWidth;
    var height = Window_Base._faceHeight;
    var bitmap = ImageManager.loadFace(faceName);
    var pw = Window_Base._faceWidth;
    var ph = Window_Base._faceHeight;
    var sw = Math.min(width, pw);
    var sh = Math.min(height, ph);
    var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    var sx = faceIndex % 4 * pw + (pw - sw) / 2;
    var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, pw / pwd, ph / phd);
};

//TODO move this to window_Base. Merge with the other enemy graphic drawing function?
Window_SkillStats.prototype.drawEnemyGraphic = function(enemy, x, y, width, height, pwd, phd) {
    width = width || Window_Base._faceWidth;
    height = height || Window_Base._faceHeight;
    pwd = pwd || 2.5;
	phd = phd || 2.5;
    var bitmap = ImageManager.loadEnemy(enemy.battlerName(), enemy.battlerHue());
    var pw = Window_Base._faceWidth;
    var ph = Window_Base._faceHeight;
    var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    var sx = 0;
    var sy = 0;
    var dw = Math.floor(pw - 6);
    var dh = Math.floor(ph - 7);
    this.contents.blt(bitmap, sx, sy, bitmap.width, bitmap.height, dx, dy, dw / pwd, dh / phd);
};

Window_SkillStats.prototype.drawActorFace = function(actor, x, y, width, height) {
    this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
};

Window_SkillStats.prototype.drawBlock3 = function(y) {
    this.drawDataColumns(4, y);
};

Window_SkillStats.prototype.drawBlock4 = function(y) {
	if (typeof this._skillData.data !== 'undefined') {
        this.drawSkillData(28, y);
   }
};

//FIXME graph needs some more work i.e needs vertical/horizantal information
//my thoughts on how to do the graph
/*
 * 1. the uses will be on the left hand side with the skill id numbers at bottom
 * 2. damage will be on right hand side? not sure if I will do this one
 */
Window_SkillStats.prototype.drawBlock5 = function(y) {
	this.contents.gradientFillRect(50, y, 816 - 140, 220, '#00108033', '#301050', true);
	this.drawVerticalInfo(y); //draws the vertical side text
	this.drawHorizantalInfo(y); //draws the horizantal text
	if (typeof this._skillData.data !== 'undefined') {
	    this.drawLineGraph(y); //draws the line graph.
	}
};

/**
 * drawLineGraph draws a line graph based on skill id (x axis) and skill usage (y axis) 
 */
Window_SkillStats.prototype.drawLineGraph = function (y) {
	var x = 24;
    var m = 0;
    this.line.position.x = 50;
    this.line.position.y = y;
    this.line.moveTo(18,y-86);
    for (i = 0; i < this._skillData.data.skills.length; i++){
    	m = this._skillData.data.skills[i][2] / this._maxSkillUsed;
    	m === 1 ? m = 0.082 : m = 1.087 - m;
    	this.line.lineTo(x, (220)*m);
    	x += (670.04 / (this._skillData.data.skills.length - 1));
    }
    this.addChild(this.line);
};

Window_SkillStats.prototype.drawVerticalInfo = function(y) {
	//TODO write code that draws the vertical info here
};

Window_SkillStats.prototype.drawHorizantalInfo = function(y) {
	//TODO write code that draws the horizantal info here
}

Window_SkillStats.prototype.drawHorzLine = function(y) {
    var lineY = y + this.lineHeight() / 2 - 1;
    this.contents.paintOpacity = 48;
    this.contents.fillRect(0, lineY, this.contentsWidth(), 2, this.lineColor());
    this.contents.paintOpacity = 255;
};

Window_SkillStats.prototype.lineColor = function() {
    return this.normalColor();
};

/**
 * drawDataColumns this function draws the first column displaying what each column represents. 
 */
Window_SkillStats.prototype.drawDataColumns = function(x, y) {
	this.contents.paintOpacity = 48;
	this.contents.fillRect(x, y, 88, 36, this.lineColor());
	this.contents.paintOpacity = 255;
	this.drawText('ID#', x + 20, y, 168);
	x += 100;
	this.contents.paintOpacity = 48;
	this.contents.fillRect(x, y, 288, 36, this.lineColor());
	this.contents.paintOpacity = 255;
	this.drawText('Skill Name', x + 60, y, 168);
	x += 300;
	this.contents.paintOpacity = 48;
	this.contents.fillRect(x, y, 88, 36, this.lineColor());
	this.contents.paintOpacity = 255;
	this.drawText('Uses', x + 18, y, 168);
	x += 100;
	this.contents.paintOpacity = 48;
	this.contents.fillRect(x, y, 130, 36, this.lineColor());
	this.contents.paintOpacity = 255;
	this.drawText('Percent', x + 18, y, 168);
	x += 142;
	this.contents.paintOpacity = 48;
	this.contents.fillRect(x, y, 130, 36, this.lineColor());
	this.contents.paintOpacity = 255;
	this.drawText('Avg Dmg', x + 18, y, 168);
};

/**
 * drawSkillData this function draws the skill data under the proper columns 
 */
Window_SkillStats.prototype.drawSkillData = function(x, y) {
    var lineHeight = this.lineHeight();
    for (var i = 0; i < this._skillData.data.skills.length; i++) {
    	var y2 = y + lineHeight * i;
    	for (var o = 0; o < this._skillData.data.skills[i].length; o++){
    		x = 10 + (o >= 2 ? o * 199 : o * 100) - (o >= 3 ? o * o + 90 : 0) - (o === 4 ? o * o + 36 : 0);
    		this.changeTextColor(this.textColor(21));
    		this.drawText(this._skillData.data.skills[i][o], x, y2, 168);
    		this.resetTextColor();
    	}
    }
};

Window_SkillStats.prototype.update = function() {
	if(typeof this._skillData.data !== 'undefined' && this._checking === false) {
		this._checking = true;
		this.getSkillData();
	}
};

//-----------------------------------------------------------------------------
// Window_DebugCommand
//
// The window for selecting a debug scene.
// TODO need to test Window_DebugCommand and Scene_DebugCommand more

function Window_DebugCommand() {
    this.initialize.apply(this, arguments);
};

Window_DebugCommand.prototype = Object.create(Window_Command.prototype);
Window_DebugCommand.prototype.constructor = Window_DebugCommand;

Window_DebugCommand.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
    this.selectLast();
};

Window_DebugCommand._lastCommandSymbol = null;

Window_DebugCommand.initCommandPosition = function() {
    this._lastCommandSymbol = null;
};

Window_DebugCommand.prototype.windowWidth = function() {
    return 240;
};

Window_DebugCommand.prototype.numVisibleRows = function() {
    return this.maxItems();
};

Window_DebugCommand.prototype.makeCommandList = function() {
    this.addMainCommands();
    this.addOriginalCommands();
};

Window_DebugCommand.prototype.addMainCommands = function() {
        this.addCommand('Debug', 'debug', true);
        this.addCommand('Skill Stats', 'skillStats', true);
};

Window_DebugCommand.prototype.addOriginalCommands = function() {
};

Window_DebugCommand.prototype.processOk = function() {
    Window_DebugCommand._lastCommandSymbol = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};

Window_DebugCommand.prototype.selectLast = function() {
    this.selectSymbol(Window_DebugCommand._lastCommandSymbol);
};


/*----------------------------------------------------------------------------------
 * Scene_DebugCommand
 * 
 * This is a precommand scene that has commands to go to different Debugging scenes
 * TODO this class needs to get tested.
 */

function Scene_DebugCommand() {
    this.initialize.apply(this, arguments);
}

Scene_DebugCommand.prototype = Object.create(Scene_Base.prototype);
Scene_DebugCommand.prototype.constructor = Scene_DebugCommand;

Scene_DebugCommand.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_DebugCommand.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createWindowLayer();
    this.createCommandWindow();
};

Scene_DebugCommand.prototype.update = function() {
    if (!this.isBusy()) {
        this._commandWindow.open();
    }
    Scene_Base.prototype.update.call(this);
};

Scene_DebugCommand.prototype.isBusy = function() {
    return this._commandWindow.isClosing() || Scene_Base.prototype.isBusy.call(this);
};

Scene_DebugCommand.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    SceneManager.snapForBackground();
};

Scene_DebugCommand.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_DebugCommand(Graphics.width / 2, Graphics.hieght / 2);
    this._commandWindow.setHandler('debug',  this.commandDebug.bind(this));
    this._commandWindow.setHandler('skillStats', this.commandSkillStats.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_DebugCommand.prototype.commandDebug = function() {
    this._commandWindow.close();
    SceneManager.goto(Scene_Debug);
};

Scene_DebugCommand.prototype.commandSkillStats = function() {
    this._commandWindow.close();
    SceneManager.goto(Scene_SkillStats);
};

/* ------------------------------------------------------------
 * Scene_SkillStats
 */

function Scene_SkillStats () {
	this.initialize.call(this, arguments);
};

Scene_SkillStats.prototype = Object.create(Scene_MenuBase.prototype);
Scene_SkillStats.prototype.constructor = Scene_SkillStats;

Scene_SkillStats.prototype.initialize = function () {
	Scene_MenuBase.prototype.initialize.call(this);
	this.sceneName = 'Scene_SkillStats';
};

Scene_SkillStats.prototype.create = function () {
	Scene_MenuBase.prototype.create.call(this);
	this.createWindowLayer();
	this.createCommandWindow();
	this.createListWindow();
	this.createSearchBar();
	this._textSize = 0;
};

Scene_SkillStats.prototype.createCommandWindow = function () {
	this._commandWindow = new Window_SkillStatsCommand(0, 0);
	this._commandWindow.setHandler('actors',  this.commandList.bind(this));
    this._commandWindow.setHandler('enemies', this.commandList.bind(this));
    this._commandWindow.setHandler('search', this.commandList.bind(this));
    this._commandWindow.setHandler('cancel',  this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_SkillStats.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._listWindow.refresh(this._commandWindow.currentSymbol(), this._searchBar.getText());
};

Scene_SkillStats.prototype.createListWindow = function () {
	this._listWindow = new Window_SkillStatsSelection(240, 0);
	this.addWindow(this._listWindow);
};

Scene_SkillStats.prototype.createSearchBar = function () {
	this._searchBar = new Window_SkillStatsSearch(0, Graphics.height - 72);
	this.addWindow(this._searchBar);
};

Scene_SkillStats.prototype.commandList = function() {
	this._listWindow.refresh(this._commandWindow.currentSymbol(), this._searchBar.getText())
    this._listWindow.selectLast();
    this._listWindow.activate();
    this._listWindow.setHandler('ok',     this.onListOk.bind(this));
    this._listWindow.setHandler('cancel', this.onListCancel.bind(this));
};

Scene_SkillStats.prototype.onListOk = function () {
	this._listWindow.setCurrent();
	SceneManager.push(Scene_SkillStatData);
	SceneManager.prepareNextScene(this._listWindow.returnCurrent());
};

Scene_SkillStats.prototype.onListCancel = function() {
    this._listWindow.deselect();
    this._commandWindow.activate();
};

/*----------------------------------------------------------------
 * Scene_SkillStatData
 */

function Scene_SkillStatData () {
	this.initialize.call(this, arguments);
};

Scene_SkillStatData.prototype = Object.create(Scene_MenuBase.prototype);
Scene_SkillStatData.prototype.constructor = Scene_SkillStatData;

Scene_SkillStatData.prototype.initialize = function () {
	Scene_MenuBase.prototype.initialize.call(this);
	this.sceneName = 'Scene_SkillStatData';
	this._character = {};
};

Scene_SkillStatData.prototype.prepare = function (character) {
	this._character = character;
};

Scene_SkillStatData.prototype.create = function () {
	Scene_MenuBase.prototype.create.call(this);
	this.createWindowLayer();
	this.createDataWindow();
	this._textSize = 0;
};

Scene_SkillStatData.prototype.createDataWindow = function () {
	this._dataWindow = new Window_SkillStats(0, 0);
	this.addWindow(this._dataWindow);
	this._dataWindow.setActor(this._character);
};
