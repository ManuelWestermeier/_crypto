var chars = "qwertzuiopasdfghjklyxcvbnmQWERTZUIOPADFGHJKLXCVBNM1234567890"
var ws = new WebSocket("ws://localhost:8080")
var form = document.getElementById("form")
var input = document.querySelector("textarea")
var msgs = document.getElementById("msgs")


input.focus()

ws.onclose = () => { window.location.reload() }
ws.onerror = () => { window.location.reload() }


if (localStorage.getItem("_.user") == null || localStorage.getItem("_.password") == null) {
    localStorage.setItem("_.user", randomString(20))
    localStorage.setItem("_.password", randomString(20))
}


ws.onopen = async () => {
    ws.send(JSON.stringify({
        auth: true,
        user: localStorage.getItem("_.user"),
        password: localStorage.getItem("_.password"),
        room: document.location.pathname
    }))
    var data = await fetch(`${document.location.origin}/GetChatt?room=${document.location.pathname}`)
    var massages = await data.json()
    massages.reverse()
    massages.forEach(massage => {
        var massage = JSON.parse(massage)
        renderMsg(massage)
    });

    /*
    for (let index = 0; index < 300; index++) {
        ws.send(JSON.stringify({
            send: true,
            msg: "input.value"
        }))
    }
    */
}


ws.onmessage = (data) => {
    var data = JSON.parse(data.data)
    if (data?.msg) {
        renderMsg(data)
    }
}

function renderMsg(data) {
    msgs.innerHTML =
        `<div class="msg">
                <p id="text${data?.msgID}"></p>
                <span class="header" id="header${data?.msgID}"></span>
            </div>` + msgs.innerHTML;
    document.getElementById(`header${data?.msgID}`).innerText = data?.user + "  " + data?.time;
    document.getElementById(`text${data?.msgID}`).innerText = data?.msg;
}


form.addEventListener("submit", e => {
    input.focus()
    e.preventDefault()
    ws.send(JSON.stringify({
        send: true,
        msg: input.value
    }))
    input.value = ""
})


function randomString(l) {
    var str = ""
    for (let index = 0; index < l; index++) {
        str += chars[Math.floor(Math.random() * chars.length)]
    }
    return str
}