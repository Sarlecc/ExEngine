/**
 * @Author Sarlecc
 * Copyright (c) 2017, Sarlecc (Mythical Games)
 * Licensed under GPL-3.0 https://github.com/Sarlecc/ExEngine/blob/master/LICENSE
 * Permission to use, copy, modify, and/or distribute this software for free or for a fee 
 * are hereby granted provided that the above copyright notice and this permission notice 
 * appear in all copies.
 */

/**
 * admin object
 * user this is the name of the administrator
 * pass this is the pass of the administrator
 * 
 * this object holds the mongodb admin data and needs to get
 * set to the correct values.
 * NOTE that this may be changed/removed in the future.
 */
var admin = {
	user : 'admin',
	pass : 'pass'
	};

/**
* The variable that holds the path of your
* project folder represented as a string.
*/
var projectPath = '/path';

/**
* Encryption number used for encrypting player saves
* Once you set this to a number do not change it again
* after you have players. Keep a copy of this number in
* safe place NOT ON YOUR COMPUTERS DESKTOP
*/
var encryptionNumber = 325;

// DO NOT CHANGE ANYTHING PAST THIS LINE UNLESS YOU KNOW WHAT YOU ARE DOING
	
var users = {};

var fs = require('fs');
var app = require('express')();

/**
 *  creates a secure https server
 */
var https = require('https');
var server = https.createServer({
    key: fs.readFileSync(projectPath+'/key.pem'),
    cert: fs.readFileSync(projectPath+'/cert.pem'),
    ca: fs.readFileSync(projectPath+'/cert.pem'),
    requestCert: false,
    rejectUnauthorized: false
},app);
server.listen(3000);

var io = require('socket.io').listen(server);
console.log("server is now listening")

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

/**
 * the mongo database variable
 */
var mongoskin = require('mongoskin'),
    dbHost = 'localhost',
    dbPort = 27017;

/**
* This is the encryptin function
*/
const simplEncrypt = function (string, num) {
	return string.split('').map(function(a) { 
		       return a.charCodeAt() ^ num 
		   }).map(function(a) { 
		   	   return String.fromCharCode(a) 
		   } ).join('')
};

/**
 * This function sends files to the client at the clients request.
 * It will not load any files from the utility folder. If a request asks for a file
 * from that folder a 403 access denied error will be sent instead.
 */
app.get('/*', function(req, res){
	var path = __dirname + '/' + req.params[0];
	if (path.match(/utility/g)){
        res.sendStatus(403);
    } else {
   	    res.sendFile(path);
    }
});

/**
 * This function loads scripts from the utility folder
 * it requires the client to be an admin otherwise it will send a 403
 * access denied error
 */
app.post('/js/utility/*', function(req, res) {
    console.log('logging scene_debug access');
    //TODO because players are not users of the database I am going to have to find a
    //different way to check if they can access the utility folder
    var isAdmin = {user: req.body.user, pass: req.body.pass};
    var db = mongoskin.db('mongodb://' + admin.user + ':' + admin.pass + '@' + dbHost + ':' +
		           dbPort + '/multiplayer');
    //TODO I need to find a way to limit admin access to only admins
    db.authenticate(admin.user, admin.pass, function(error, item) {
        if (error) {
  	    io.emit('Error', error);
  	    console.error(error);
	    db.close
  	    process.exit(1);
        }
  	    console.info('findOne: ', item);
  	if (item === true) {
  	    var path = __dirname + '/js/utility/' + req.params[0];
  	    res.sendFile(path);
        } else {
  	    res.status(403).send('access to this resource has been denied');
    }
    db.close();
    });
});

io.on('connection', function(socket){
       console.log("A socket has connected to the server, they are not logged in yet. socket id: " + socket.id);
        /**
	 * This function creates a new player and stores the player in the players collection
	 */
	socket.on('Create', function(user, fnd){
		var db = mongoskin.db('mongodb://'+ admin.user + ':' + admin.pass + '@' + 
		                      dbHost + ':' + dbPort + '/multiplayer');
	    user.logonAttempts = 0;
	    user.pass = simplEncrypt(user.pass, encryptionNumber);
  	    db.collection('players').findOne({name: user.name}, function(error, item) {
  		   var saved = false;
  		   if (error) {
  			   io.emit('Error', error);
  			   console.error(error);
  			   db.close();
  			   process.exit(1);
  		    }
  		    if (item === null) {
  			db.collection('players').insert(user, function(error, count){
  		            return console.info('Created new player: ', user.name);
  		        });
  			users[socket.id] = user.name;
  			fnd(true, null);
  			db.close();	
 		     } else {
  			fnd(false, {}, "Name aleady exists");
  			db.close();
       		    }
  	    });
		
	});
	
	/**
	 * This function allows the player to login it checks to see if that player is already logged in first
	 * then checks to see if their is a name by that player name in the data base.
	 */
	socket.on('Login', function(user, fnd){
		var db = mongoskin.db('mongodb://' + admin.user + ':' + admin.pass + '@' + dbHost + ':' +
		                      dbPort + '/multiplayer');
		for (var id in users) {
		     if (users[id] === user.name) {
		         return fnd(false, {}, "Can't be logged in twice");
		     }
		}
		
		db.collection('players').findOne({name: user.name}, function (error, item) {
			if (error) {
			   io.emit('Error', error);
  			   console.error(error);
  			   db.close();
  			   process.exit(1);
			}
			if (item === null) {
				fnd(false, {}, "Wrong user name or pass");
				db.close();
			} else if (item.logonAttempts === 7){
				fnd(false, {}, "Login Attempts exceeded for this player please contact game Admin")
			} else {
			        var pass = simplEncrypt(item.pass, encryptionNumber);
				if (user.pass === pass) {
					console.log("Player: " + user.name + " has logged in")
					users[socket.id] = user.name;
					item.save = simplEncrypt(item.save, encryptionNumber);
					fnd(true, item.save);
					db.close();
				} else {
					fnd(false, {}, "Wrong user name or pass");
					item.logonAttempts += 1;
					db.collection('players').updateOne({name: item.name}, {$set: {logonAttempts: item.logonAttempts}}, 
						function(error, data){
						   if (error) {
						       io.emit('Error', error);
  			                               console.error(error);
  			                               db.close();
  			                               process.exit(1);
						   }
					    console.log("login attempts for: " + item.name +
						        " has increased by 1 and are now: " + item.logonAttempts);
					});
					db.close();
				}
			}
		});

	});
	
	/**
	 * This function removes the user from the users object thus no longer being logged in
	 */
	socket.on('Logout', function(save, fnd){
		var db = mongoskin.db('mongodb://' + admin.user + ':' + admin.pass + '@' + dbHost + ':' +
		                      dbPort + '/multiplayer');
		save = simplEncrypt(save, encryptionNumber);
		db.collection('players').findOne({name: users[socket.id]}, function (error, item) {
			if (error) {
			   io.emit('Error', error);
  			   console.error(error);
  			   db.close();
  			   process.exit(1);
			}
			db.collection('players').updateOne({name: users[socket.id]}, {$set: {save: save}},
				function(error, data) {
				    if (error) {
			                io.emit('Error', error);
  			                console.error(error);
  			                db.close();
  			                process.exit(1);
			            }
			            console.log(data);
			});
			console.log("Player: " + users[socket.id] + " has logged out successfully");
		        fnd(true, "Player data saved successfully; goodbye")
			db.close();
		});
		users[socket.id] = undefined;
		users = JSON.parse(JSON.stringify(users));
	});
	
	/**
	* This function saves the player data
	*/
	socket.on('SaveUserData', function(save, fnd){
		var db = mongoskin.db('mongodb://' + admin.user + ':' + admin.pass + '@' + dbHost + ':' +
		                      dbPort + '/multiplayer');
		save = simplEncrypt(save, encryptionNumber);
		db.collection('players').findOne({name: users[socket.id]}, function (error, item) {
			if (error) {
			   fnd(false, null, error);
  			   console.error(error);
  			   db.close();
  			   process.exit(1);
			}
			db.collection('players').updateOne({name: item.name}, {$set: {save: save}},
				function(error, data) {
				    if (error) {
			                fnd(false, null, error);
  			                console.error(error);
  			                db.close();
  			                process.exit(1);
			            }
			        console.log(data);
			 });
		        fnd(true, "Player data saved successfully")
			db.close();
		});
	});
	
   /**
   * disconnect
   * This is fired whenever a player disconnects from the game
   * through unintentional means (like loss of connection) or
   * through intentional means (like hitting the refresh button or closing the browser)
   */
  socket.on('disconnect', function(){
  	if (typeof users[socket.id] !== 'undefined'){
  	    console.log("Player: " + users[socket.id] + " disconnected this was not done through a normal logout.");
  	    users[socket.id] = undefined;
	    users = JSON.parse(JSON.stringify(users));
  	} else {
  	    console.log("A socket disconnected without being logged in. socket id: " + socket.id);
  	}
  });
  
  /**
   * save skill data
   */
  //TODO remove all cases of user from functions and use the users object instead.
  socket.on('save skill data', function(data, user){
  	var db = mongoskin.db('mongodb://' + admin.user + ':' + admin.pass + '@' + dbHost + ':' +
		                      dbPort + '/multiplayer');
  	var info = data;
  	db.collection(info.collection).findOne({name: info.name}, function(error, item) {
  	    var saved = false;
  		if (error) {
  	            io.emit('Error', error);
  		    console.error(error);
  		    process.exit(1);
  		}
  		console.info('findOne: ', item);
  		if (item === null) {
  			db.collection(info.collection).insert(info, function(error, count){
  			    io.emit('saved skill data', 'saved skill data');
  			    console.info('saved skill data', count);
  			});	
  		} else {
  		    for (var i = 0; i < item.skills.length; i++){
  		 	    if (item.skills[i][0] === info.skills[0][0]) {
  			        item.skills[i][2] += 1;
  			    if (item.skills[i][3].length === 10) {
			          item.skills[i][3].shift();
  		          item.skills[i][3].push(info.skills[0][3][0]);
  			    } else {
  			    	  item.skills[i][3].push(info.skills[0][3][0]);
  			    }
  			    if (item.skills[i][4].length === 10) {
 				       item.skills[i][4].shift();
  			    	 item.skills[i][4].push(info.skills[0][4][0]);
  			    } else {
  			    	item.skills[i][4].push(info.skills[0][4][0]);
  			    }
 			       saved = true;
  			     break;
  			  }		
       }
  		 if (saved === false) {
  			  item.skills.push([
  			  info.skills[0][0],
  			  info.skills[0][1],
  			  info.skills[0][2],
  			  [info.skills[0][3][0]],
  			  [info.skills[0][4][0]]
          ]);
  			  saved = true;
  	    }
  				  
  		      var id = item._id.toString();
  		      console.info('before saving: ', item);
  		      db.collection(info.collection).save(item, function(error, count) {
  		         io.emit('updated skill data', 'updated skill data');
  		         console.info('save: ', count);
  		      });
  		}
  	    db.close();
  	});
  }); // on save skill data
  
  /**
   * retrieve skill data
   */
  socket.on('retrieve data', function (request, fnd){
  	var db = mongoskin.db('mongodb://' + admin.user + ':' + admin.pass + '@' + dbHost + ':' +
		                      dbPort + '/multiplayer');
  	var info = request;
  	db.collection(info.collection).findOne({name: info.name}, function(error, item) {
  		if (error) {
  			io.emit('Error', error);
  			console.error(error);
  			process.exit(1);
  		}
  		if (item === null) {
  			fnd({data: 'No data for ' + info.name});
  		} else {
  			fnd({data: item});
  		}
  		var id = item._id.toString();
  		console.info('findOne: ', item, id);
  		db.close();
  	});
  });
  
 }); 
