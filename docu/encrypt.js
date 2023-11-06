var crypto = require("./crypt");

var cry = new crypto();

//Get Random Key

var key = cry.getKey();

var text = "Hallo Welt"

//Encrypt Data Return Enc

var enc = cry.encrypt(text, key)

console.log(enc)

//Encrypt File Return Enc

var enc = cry.decryptFile("file_to_encrypt.txt", key)

console.log(enc)

//Encrypt File And Write Encrypt data in a new File 

cry.writeEncryptFile("file_to_encrypt.txt", "output.enc", key)