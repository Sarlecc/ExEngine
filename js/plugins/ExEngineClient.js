/*:
 * @plugindesc client side of ExEngine
 * @author Sarlecc
 * @help
 * Copyright (c) 2017, Sarlecc (Mythical Games)
 * Licensed under GPL-3.0 https://github.com/Sarlecc/ExEngine/blob/master/LICENSE
 * Permission to use, copy, modify, and/or distribute this software for free or for a fee 
 * are hereby granted provided that the above copyright notice and this permission notice 
 * appear in all copies.
 * 
 * TODO does it still require jQuery?
 * requires jQuery2-2-3.js note that because of this, plug-ins that use $
 * in their functions might cause errors.
 */
//TODO rename the client to something else?
var SAR = SAR || {};
SAR.skillUsage = (function() {

	var user = {
		user : 'admin',//admin
		pass : 'pass' //password
	};
  
	(function(B) {

		var BattleManager_startAction = B.startAction;
		B.startAction = function() {
			BattleManager_startAction.call(this);
			this._targetLength = this._targets.length;
		};

		var BattleManager_invokeNormalAction = B.invokeNormalAction;
		B.invokeNormalAction = function(subject, target) {
			BattleManager_invokeNormalAction.call(this, subject, target);
			if (subject._name && this._action.isSkill()) {
				sending = {
					name : subject._name,
					//0 = id
					//1 = name
					//2 = uses
					//3 = [] with skill damage
					//4 = [] with adverage targets
					skills : [[this._action.item().id, this._action.item().name, 1, [target.result().hpDamage || 0], [this._targetLength]]],
					collection : "actorSkills"
				};
			} else if (this._action.isSkill()) {
				sending = {
					name : $dataEnemies[subject._enemyId].name,
					//0 = id
					//1 = name
					//2 = uses
					//3 = [] with skill damage
					//4 = [] with adverage targets
					skills : [[this._action.item().id, this._action.item().name, 1, [target.result().hpDamage || 0], [this._targetLength]]],
					collection : "enemySkills"
				};
			}
			sendData(sending, user);
			function sendData(dat, use) {
				socket.emit('save skill data', dat, use);
				sending = {};
				return false;
			};
		};
	})(BattleManager);

	// Class Scene_Map
	(function(SM) {
		SM.prototype.updateCallDebug = function() {
            this.isDebugCalled()
        };

    SM.prototype.isDebugCalled = function() {
        if (Input.isTriggered('debug')) {
            var head = document.getElementsByTagName('head');
            var script = document.createElement('script');
            head[0].appendChild(script);
            var http = new XMLHttpRequest();
            var url = "js/utility/Scene_Debug.js";
            //TODO this line needs to get removed after Scene_LoginAndCreate is finished
            var params = "user=" + user.user + "&pass=" + user.pass;
            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.setRequestHeader("Content-length", params.length);
            http.setRequestHeader("Connection", "close");
            http.onreadystatechange = function() {
                if(http.readyState == 4 && http.status == 200) {
		               console.log('okay debug has been sent');
	              }
             }
             http.onload = function () {
                if (http.status < 400) {
                    script.innerHTML = http.responseText;
                    SceneManager.push(Scene_Debug)
                }
             };
             http.send(params);
         }
	    };
	})(Scene_Map);

})();
