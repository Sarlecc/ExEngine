/**
 * @Author Sarlecc
 * Copyright (c) 2017, Sarlecc (Mythical Games)
 * Licensed under GPL-3.0 https://github.com/Sarlecc/ExEngine/blob/master/LICENSE
 * Permission to use, copy, modify, and/or distribute this software for free or for a fee 
 * are hereby granted provided that the above copyright notice and this permission notice 
 * appear in all copies.
 */
 
const stream = require("stream");
const fs = require("fs");

var configuration = fs.existsSync('config/config.json') ? require('./config/config.json') : {
	adminName: ['string', 'Please enter the name of the Mongodb multiplayer admin:'],
	adminPwd: ['string', 'Please enter the pass of the Mongodb multiplayer admin:'],
	projectPath: ['string', 'Please enter the path to your project folder:'],
	sslPath: ['string', 'Please enter the path of the SSL certificates:'],
	encryptionNumber: ['number', 'Please enter a number for the simple encryption 1..~32000\nThis number '+
	'encrypts player data to be saved on the mongodb server:']
};

var readStream = process.stdin;
readStream.setEncoding("utf8");

var i = 0;
var keys = Object.keys(configuration);

function next () {
	i++;
}

console.log(configuration[keys[i]][1]);
readStream.on('data', function(chunk) {
	 if (typeof keys[i] !== 'undefined') {
	 	chunk = chunk.replace(/\n/, '');
	     configuration[keys[i]][0] = chunk.length > 0 ? chunk : configuration[keys[i]][0];
	     next();
	     console.log(typeof keys[i] !== 'undefined' ? configuration[keys[i]][1] : 'configuration complete');
	 } else {
	 	if (fs.existsSync("config") !== true) {
	 	    fs.mkdirSync("config");
	 	}
	    fs.writeFile("config/config.json", JSON.stringify(configuration), 'utf8', function (error) {
        if (error) {
           console.log(error)
           process.exit(0)
        }
 	    	process.exit(0);
	 	});
	 	
	 }
});

