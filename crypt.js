const chars = "1234567890abcdef";
const fs = require("fs");

module.exports = class {
    decrypt(encr, key) {
        var decr = "";
        for (let index = 0; index < encr.length; index++) {
            decr += key[encr[index].x][encr[index].y][encr[index].z];
        }
        return this.antiHex(decr);
    }

    encrypt(string, key) {
        var charTable = this.getCharTable(key)
        var dat = this.toHex(string)
        var data = [];
        for (let index = 0; index < dat.length; index++) {
            data.push(charTable[dat[index]][Math.floor(Math.random() * charTable[dat[index]].length)]);
        }
        return data;
    }

    getCharTable(key) {
        var charTable = {};
        for (let x = 0; x < key.length; x++) {
            for (let y = 0; y < key[x].length; y++) {
                for (let z = 0; z < key[x][y].length; z++) {
                    var char = key[x][y][z];
                    if (charTable[char]) {
                        charTable[char].push({ x, y, z });
                    } else {
                        charTable[char] = [{ x, y, z }];
                    }
                }
            }
        }
        return charTable;
    }

    getKey() {
        var key = [];
        var usedChars = [];
        var keyWidth = 10;
        for (let x = 0; x < keyWidth; x++) {
            key.push([]);
            for (let y = 0; y < keyWidth; y++) {
                key[x].push([]);
                for (let z = 0; z < keyWidth; z++) {
                    var char = this.randmString(1, chars);
                    if (!usedChars.includes(char)) usedChars.push(char);
                    key[x][y].push(char);
                }
            }
        }
        if (usedChars.length != chars.length) key = this.getKey(chars);
        return key;
    }

    setKeyInFile(outputPath) {
        var key = this.getKey();
        fs.writeFileSync(outputPath, this.stringifyKey(key), "utf8");
        return key;
    }

    getKeyFromFile(path) {
        var key = this.parseKey(fs.readFileSync(path, "utf-8"));
        return key;
    }

    randmString(length, allowedChars) {
        var str = "";
        for (let index = 0; index < length; index++) {
            str += allowedChars[Math.floor(Math.random() * allowedChars.length)];
        }
        return str;
    }

    antiHex(hex) {
        let buf = Buffer.from(hex, "hex");
        let data = buf.toString("utf8");
        return data;
    }

    toHex(string) {
        return Buffer.from(string).toString("hex");
    }

    encryptFile(filePath, key) {
        var data = fs.readFileSync(filePath, "binary");
        var enc = JSON.stringify(this.encrypt(data, this.getCharTable(key)));
        return enc;
    }

    decryptFile(encFilePath, key) {
        var data = JSON.parse(fs.readFileSync(encFilePath, "binary"));
        var dec = this.decrypt(data, key);
        return dec;
    }

    writeEncryptFile(filePath, outputFilePath, key) {
        var data = fs.readFileSync(filePath, "binary");
        var enc = this.stringify(this.encrypt(data, key));
        fs.writeFileSync(outputFilePath, enc, "utf-8")
    }

    writeDecryptFile(encFilePath, outputFilePath, key) {
        var data = this.parse(fs.readFileSync(encFilePath, "utf-8"));
        var dec = this.decrypt(data, key);
        fs.writeFileSync(outputFilePath, dec, "binary");
    }

    stringify(enc) {
        var str = "";
        enc.forEach((choord) => {
            str += `${choord.x}${choord.y}${choord.z}`;
        });
        return str;
    }

    parse(dec) {
        var data = [];
        for (let index = 0; index < dec.length; index += 3) {
            data.push({ x: parseInt(dec[index]), y: parseInt(dec[index + 1]), z: parseInt(dec[index + 2]) });
        }
        return data;
    }

    stringifyKey(key) {
        var data = "10|"
        for (let x = 0; x < key.length; x++) {
            for (let y = 0; y < key[x].length; y++) {
                for (let z = 0; z < key[x][y].length; z++) {
                    data += key[x][y][z];
                }
            }
        }
        return data
    }

    parseKey(string) {
        var key = []
        var width = parseInt(string.split("|")[0])
        var data = string.split("|")[1].split("")
        var index = 0
        for (let x = 0; x < width; x++) {
            key.push([])
            for (let y = 0; y < width; y++) {
                key[x].push([])
                for (let z = 0; z < width; z++) {
                    key[x][y].push(data[index])
                    index++;
                }
            }
        }
        return key
    }
}