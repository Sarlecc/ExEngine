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
 */
var admin = {
	user : 'admin',
	pass : 'pass'
	};

/**
* The variable that holds the name of your
* project folder represented as a string.
*/
var projectFolder = "projectFolderName";

// DO NOT CHANGE ANYTHING PAST THIS LINE UNLESS YOU KNOW WHAT YOU ARE DOING

var fs = require('fs');
var app = require('express')();

/**
 *  creates a secure https server
 */
var https = require('https');
var server = https.createServer({
    key: fs.readFileSync('/root/+projectFolder+/key.pem'),
    cert: fs.readFileSync('/root/+projectFolder+/cert.pem'),
    ca: fs.readFileSync('/root/+projectFolder+/cert.pem'),
    requestCert: false,
    rejectUnauthorized: false
},app);
server.listen(3000);

var io = require('socket.io').listen(server, function () {
	console.log('Server is now listening')
});

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
app.post('/js/utility/*', function(req, res){
	console.log('logging scene_debug access');
	// might have to make this into a callback function
	//TODO this will have to get changed to the socket.id and load the proper user object from the 
	//users object
	    var isAdmin = {user: req.body.user, pass: req.body.pass};
	    var db = mongoskin.db(isAdmin.user + ':' + isAdmin.pass + '@' + dbHost + ':' + 
  	                          dbPort + '/multiplayer', {safe:true});
	  	db.bind('system.users', {
  		    findAdminStatus : function (info, fn) {
  		    	//TODO the following might be an incorrect method of checking user rights
  			    db.collection('system.users').findOne({name: info.user}, function(error, item) {
  				    if (error) {
  					//io.emit('returned admin status', false);
  					    console.error(error);
  					//process.exit(1);
  				    }
  				    console.info('findOne: ', item);
  				    if (!!item) {
  				        var path = __dirname + '/js/utility/' + req.params[0];
  				        res.sendFile(path);
  				    } else {
  				    	res.status(403).send('access to this resource has been denied');
  				    }
  				    return fn(item);
  				});
  			}
  		});
  		
  		db.collection('system.users').findAdminStatus(admin.user, function(count, id){
  		    db.collection('system.users').find({
  			    _id: db.collection('system.users').id(id)
  		    }).toArray(function(error, items){
  			    console.info("find: ", items);
  			    db.close();
  			//process.exit(0);  		
  	       });
  	    });
	
});

io.on('connection', function(socket){
  /**
   * save skill data
   */
  socket.on('save skill data', function(data, user){
  	var db = mongoskin.db(user.user + ':' + user.pass + '@' + dbHost + ':' + 
  	                  dbPort + '/multiplayer', {safe:true});
  	var information = data;
  	var collection = information.collection;
  	db.bind(collection, {
  		findOneSkillAndUpdate : function (info, fn) {
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
  						return fn(count, id);
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
  					return fn(count, id);
  				});
  				}
  			});
  		}
  	});
  	
  	db.collection(collection).findOneSkillAndUpdate(information, function(count, id){
  		db.collection(information.collection).find({
  			_id: db.collection(information.collection).id(id)
  		}).toArray(function(error, items){
  			console.info("find: ", items);
  			db.close();
  			//process.exit(0);  		
  	   });
  	});
  }); // on save skill data
  
  /**
   * retrieve skill data
   */
  socket.on('retrieve data', function (request, fnd){
  	var db = mongoskin.db(admin.user + ':' + admin.pass + '@' + dbHost + ':' + 
  	                  dbPort + '/multiplayer', {safe:true});
  	var information = request;
  	var collection = information.collection;
  	db.bind(collection, {
  		findOneEntryAndSend : function (info, fn) {
  			db.collection(info.collection).findOne({name: info.name}, function(error, item) {
  				if (error) {
  					io.emit('Error', error);
  					console.error(error);
  					process.exit(1);
  				}
  				console.info('findOne: ', item);
  				if (item === null) {
  					fnd({data: 'No data for ' + info.name});
  				} else {
  				    fnd({data: item});
  				}
  				var id = item._id.toString();
  				//TODO make sure following is correct
  				return fn(item, id);
  				});
  			}
  		});
  	
     db.collection(collection).findOneEntryAndSend(information, function(count, id){
  		db.collection(information.collection).find({
  			_id: db.collection(information.collection).id(id)
  		}).toArray(function(error, items){
  			console.info("find: ", items);
  			db.close();
  			//process.exit(0);  		
  	   });
  	});
  });
  
 }); 
