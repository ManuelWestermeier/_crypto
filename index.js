const { log } = require("console");
var crypto = require("./crypt");
const { writeFileSync } = require("fs");
var cry = new crypto();

writeFileSync("docu/jsonKey.json", JSON.stringify(cry.getKey(), null, 4))