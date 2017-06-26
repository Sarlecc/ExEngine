/*:
 * @plugindesc Core methods and classes for ExEngine
 * @author Sarlecc
 * @help
 * Copyright (c) 2017, Sarlecc (Mythical Games)
 * Licensed under GPL-3.0 https://github.com/Sarlecc/ExEngine/blob/master/LICENSE
 * Permission to use, copy, modify, and/or distribute this software for free or for a fee 
 * are hereby granted provided that the above copyright notice and this permission notice 
 * appear in all copies.
 * 
 * Extra Credits:
 * Yanfly Window_ValueBar based off yanfly's rpgmaker vx ace debug script
 */

//-----------------------------------------------------------------------------
// Window_ValueBar
//
// Essentially an input bar that displays whats typed has many, many uses.
// The following code is based off a piece of yanfly's rpgmaker vx ace
// debug script
function Window_ValueBar() {
    this.initialize.apply(this, arguments);
};

Window_ValueBar.prototype = Object.create(Window_Selectable.prototype);
Window_ValueBar.prototype.constructor = Window_ValueBar;

Window_ValueBar.prototype.initialize = function (x, y) {
	 var width = Graphics.width;
     var height = 72;
     this.blinker = false;
     this.maxium = 300;
     this.text = '';
     Window_Selectable.prototype.initialize.call(this, x, y, width, height);
     this.contents.fontSize = 16;
     this.contents.textColor = '#0FAB84';
     this.refresh();
};

Window_ValueBar.prototype.refresh = function() {
	this.contents.clear();
	this.contents.fillRect(0, 0, this.width, this.height, '#FFFFFF');
	 this.contents.fillRect(1, 1, this.width-2, this.height-2, '#000000');
	if (this.blinker) {
		this.drawText(this.text+ '▌', 4, 4, this.width);
	} else {
		this.drawText(this.text, 4, 4, this.width);
	}
};

Window_ValueBar.prototype.update = function() {
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

Window_ValueBar.prototype.getText = function() {
	return this.text;
};

Window_ValueBar.prototype.resetText = function() {
	this.text = '';
};


 
//TODO note Sarlecc that using this in the login/create account screens may not be a good idea
//this is because it could be used to log key strokes.
//if I still want to do it this way then I'll have to find a way to make it more secure.
(function (In) {
	
	In.dontType = ['pageup', 'pagedown', 'left', 'right', 'down', 
	               'up', 'alt', 'control', 'backspace', 'ok', 'tab',
	               'delete', 'escape', 'shift', 'enter', 'capslock'];
	
	In.keyMapperLowerCase = {
		8: 'backspace',
        9:  'tab', 13: 'enter', 16: 'shift', 17: 'control',  
        18: 'alt', 20: 'capslock', 27: 'escape', 32: ' ', 33: 'pageup',   
        34: 'pagedown', 37: 'left', 38: 'up', 39: 'right',    
        40: 'down', 45: 'escape', 46: 'delete', 48: '0',        
        49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6',        
        55: '7', 56: '8', 57: '9', 59: ';', 61: '=', 65: 'a', 
        66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 
        72: 'h', 73: 'i', 74: 'j', 75: 'k', 76: 'l', 77: 'm', 
        78: 'n', 79: 'o', 80: 'p', 81: 'q', 82: 'r', 83: 's', 
        84: 't', 85: 'u', 86: 'v', 87: 'w', 88: 'x', 89: 'y', 
        90: 'z', 96: '0', 97: '1', 98: '2', 99: '3', 100: '4', 
        101: '5', 102: '6', 103: '7', 104: '8', 105: '9', 
        120: 'debug', 173: '-', 188: ',', 190: '.', 191: '/', 
        192: '`', 219: '[', 220: '\\', 221: ']', 222: "'"      
     };
      
      In.keyMapperUpperCase = {
      	8: 'backspace',
      	9:  'tab', 13: 'enter', 16: 'shift', 17: 'control',  
        18: 'alt', 20: 'capslock', 27: 'escape', 32: ' ', 33: 'pageup',   
        34: 'pagedown', 37: 'left', 38: 'up', 39: 'right',    
        40: 'down', 45: 'escape', 46: 'delete', 48: ')',        
        49: '!', 50: '@', 51: '#', 52: '$', 53: '%', 54: '^',        
        55: '&', 56: '*', 57: '(', 59: ':', 61: '+', 65: 'A', 
        66: 'B', 67: 'C', 68: 'D', 69: 'E', 70: 'F', 71: 'G', 
        72: 'H', 73: 'I', 74: 'J', 75: 'K', 76: 'L', 77: 'M', 
        78: 'N', 79: 'O', 80: 'P', 81: 'Q', 82: 'R', 83: 'S', 
        84: 'T', 85: 'U', 86: 'V', 87: 'W', 88: 'X', 89: 'Y', 
        90: 'Z', 96: '0', 97: '1', 98: '2', 99: '3', 100: '4', 
        101: '5', 102: '6', 103: '7', 104: '8', 105: '9', 
        120: 'debug', 173: '_', 188: '<', 190: '>', 191: '?', 
        192: '~', 219: '{', 220: '|', 221: '}', 222: '"'
      };
      
      In._shiftState = false;
      In._capsState = false;
      
      In.update = function() {
        this._pollGamepads();
        if (this._currentState[this._latestButton]) {
            this._pressedTime++;
        } else {
           this._latestButton = null;
        }
        for (var name in this._currentState) {
            if (this._currentState[name] && !this._previousState[name] && (name !== 'shift' ||
                name !== 'capslock')) {
                this._latestButton = name;
                this._pressedTime = 0;
                this._date = Date.now();
            }
            this._previousState[name] = this._currentState[name];
        }
        this._updateDirection();
      };

      /**
       * Overwritten function _onKeyDown
       * @param {Object} event
       */
      In._onKeyDown = function(event) {
          if (this._shouldPreventDefault(event.keyCode)) {
              event.preventDefault();
          }
          if (event.keyCode === 144) {    // Numlock
             this.clear();
          }
          if (event.keyCode === 16) {
        	  this._shiftState = true;
          }
          if (event.keyCode === 20) {
          	if (!this.tabState) {
          		this._capsState = true;
          	} else {
          		this._capsState = false;
          	}
          }
          var buttonName = 0;

          if (SceneManager._scene.advInput === true){
        	  if (this._shiftState || this._capsState) {
        		  buttonName = this.keyMapperUpperCase[event.keyCode];
        	  } else {
        		  buttonName = this.keyMapperLowerCase[event.keyCode];
        	  }
          } else {
        	  buttonName = this.keyMapper[event.keyCode];
          }
          if (buttonName) {
              this._currentState[buttonName] = true;
          }
      };
      
      var Input_onKeyUp = In._onKeyUp;
      In._onKeyUp = function(event) {
          Input_onKeyUp.call(this, event);
          if (event.keyCode === 16) {
          	this._shiftState = false;
          }
          this.clear();
      };
      
 /**
 * @static
 * @method _shouldPreventDefault
 * @param {Number} keyCode
 * @private
 */
    In._shouldPreventDefault = function(keyCode) {
        switch (keyCode) {
        case 8:     // backspace
	      case 9:     // tab
        case 33:    // pageup
        case 34:    // pagedown
        case 37:    // left arrow
        case 38:    // up arrow
        case 39:    // right arrow
        case 40:    // down arrow
        case 191:   // forward slash
        case 222:   // ' or "
            return true;
        }
        return false;
    };
      
})(Input);

(function (TI) {
    //Found out I could pull this off without adding a mousemove event
    //due to the TouchInput already having one
    //in fact all I needed to do was change the _onMouseMove function and remove the if statement
    TI._onMouseMove = function(event) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
    };
    
    
    /**
     * called like so in a windows update method
     * TouchInput.isMouseOver(this, this.myFunction1, this.myFunction2);
     * @param {Object} item
     * @param {function} fn1 this decides what you want to happen when mouse is over window
     * @param {function} fn2 this decides what you want to happen when mouse is not over window
     */
    TI.isMouseOver = function (item, fn1, fn2) {
    	if (this._x >= item.x && this._x <= item.width + item.x &&
    		this._y >= item.y && this._y <= item.height + item.y) {
    		if (typeof fn1 === 'function') {
    		    fn1(item);
    		} else {
    			return true;
    		}
    	} else {
    		if (typeof fn2 === 'function') {
    			fn2(item);
    		} else {
    			return false;
    		}
    	}
    };
    
})(TouchInput);
