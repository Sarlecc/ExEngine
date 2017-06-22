# ExEngine
An experimental engine for adding server related tools to RPG maker MV games.
Anyfile placed here gets placed in the main game folder.

# config.js
In your project folder you can now use `node config.js` to setup some server variables without having to open any files.
When runned it will promt you to enter the following information. On the first time you run config.js you should enter all of the information; however if you made a mistake or want to change it later, you can press enter on entries you want to keep without inputting anything. This information gets stored in the config/config.json file.

`name of multiplayer admin`
This is the name of the administrator of the multiplayer database. This is not the admin of the mongodb admin database.

`pass of multiplayer admin`
This is the password of the administrator of the multiplayer database.

`project path`
This is the path to your project folder following the format `/path/to/project`.

`ssl path`
This is the path to the SSL certificates following the format `/path/to/ssl`.
Note that there should be three files there `privkey.pem`, `cert.pem` and `chain.pem`.

`encryption number`
This is a number for basic encryption when storing player data in the mongodb multiplayer database.
