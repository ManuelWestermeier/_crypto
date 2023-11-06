var crypto = require("./crypt");

var cry = new crypto();

//Get Random Key

var key = cry.getKey();

console.log(key)

//Get Random Key As String

var keyString = cry.stringifyKey(key);

console.log(keyString)

//Get Key from File

var parsedKey = cry.parseKey(keyString);

console.log(parsedKey)

//Write and Get Random in File

var key = cry.setKeyInFile("key.key")

console.log(key)

//Get Key from File

var key = cry.getKeyFromFile("key.key");

console.log(key)