var crypto = require("./crypt");

var cry = new crypto();

//Get Random Key

var key = cry.getKey();

var enc = "041251729145129312722680549567491297386219430817193453769298"

//Decrypt Enc Return Data

var dec = cry.decrypt(enc, key)

console.log(dec)

//Decrypt File Return Data

var dec = cry.decryptFile("output.enc", key)

console.log(dec)

//Decrypt File And Write Decrypt data in a new File 

cry.writeDecryptFile("file_to_encrypt.txt", "output.enc", key)