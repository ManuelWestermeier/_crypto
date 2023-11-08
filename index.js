const { log } = require("console")
var chars = "qwertzuiopasdfghjklyxcvbnmQWERTZUIOPADFGHJKLXCVBNM1234567890"
var fs = require("fs")
var ws = require("ws")
var multiparty = require("multiparty")
const path = require("path")


var wss = new ws.WebSocketServer({
    port: 8080
})


var obj = {
    user: {},
    room: {},
    massages: {}
}


wss.on("connection", socket => {
    var user = ""
    var room = ""
    var id = randomString(20)

    socket.on("message", data => {
        var data = JSON.parse(bufferToString(data))
        if (data?.send) {
            var msg = JSON.stringify({
                msgId: randomString(20),
                user,
                msg: data?.msg,
                time: `${new Date().getHours()}:${new Date().getMinutes()} ${new Date().getMonth()}.${new Date().getDate()}`
            })

            var array = Object.keys(obj.room?.[room])

            for (let index = 0; index < array.length; index++) {
                obj.room?.[room]?.[array?.[index]]?.send(msg)
            }

            if (obj.massages?.[room]) {
                obj.massages?.[room]?.unshift(msg)
            } else {
                obj.massages[room] = [msg]
            }
            if (obj.massages?.[room].length > 50) obj.massages[room].length = 50
        }
        else if (data?.auth) {
            if (!auth(data?.user, data?.password)) return
            user = data?.user
            room = data?.room
            if (!(obj.room?.[room])) {
                obj.room[room] = {}
                obj.room[room][id] = socket
            } else {
                obj.room[room][id] = socket
            }
        }
    })

    socket.on("error", close)
    socket.on("close", close)

    function close() {
        try {
            delete obj.room[room][id]
        } catch (error) {

        }
    }
})

function auth(u, p) {
    if (obj.user?.[u]) {
        return obj.user?.[u].password == p
    } else {
        obj.user[u] = {
            password: p
        }
        return true
    }
}


require("http").createServer((req, res) => {
    var url = new URL("http://localhost" + req.url)
    if (req.method == "POST") {
        if (auth(url.searchParams.get("u"), url.searchParams.get("p"))) {
            var form = new multiparty.Form()
            form.on("part", part => {
                var path = "uploads/" + url.searchParams.get("u") + "/" + randomString(2) + part.filename
                log(part)
                if (fs.existsSync("uploads/" + url.searchParams.get("u") + "/")) {
                    part.pipe(fs.createWriteStream(path))
                } else {
                    fs.mkdirSync("uploads/" + url.searchParams.get("u") + "/")
                    part.pipe(fs.createWriteStream(path))
                }
                res.end(path)
            })

            form.parse(req)
        }
        res.end()
    } else {
        if (url.pathname == "/GetChatt") {
            try {
                res.writeHead(200, { "content-type": "application/json" })
                res.end(JSON.stringify(obj.massages[url.searchParams.get("room")]))
                return
            } catch (error) {
                return res.end("[]")
            }
        }
        try {
            var ext = path.parse("." + url.pathname).ext
            switch (ext) {
                case ".js":
                    res.writeHead(200, { "content-type": "text/javascript" })
                    break;
                case ".css":
                    res.writeHead(200, { "content-type": "text/css" })
                    break;
                default:
                    res.writeHead(200, { "content-type": "text/html" })
                    break;
            }
            res.end(fs.readFileSync("app" + url.pathname))
        } catch (error) {
            res.writeHead(200, { "content-type": "text/html" })
            res.end(fs.readFileSync("app/index.html"))
        }
    }
}).listen(80)


function bufferToString(bufferOne) {
    let json = JSON.stringify(bufferOne);
    let bufferOriginal = Buffer.from(JSON.parse(json).data);
    return bufferOriginal.toString('utf8')
}

function randomString(l) {
    var str = ""
    for (let index = 0; index < l; index++) {
        str += chars[Math.floor(Math.random() * chars.length)]
    }
    return str
}

process.on("uncaughtException", err => { log(err) })