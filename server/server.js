class baseuser {
    constructor(id) {
        this.id = id
        this.locx = 720
        this.locy = 720
        this.colour = 0
    }
}

//Setup express and enable static hosting
const fs = require('fs')
const express = require('express')
const app = express()
app.use(express.static('public'))

//Setup socket.io and bind to existing express app
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { pingInterval: 1000, pingTimeout: 5000 });

//Setup lokiDB
const loki = require('lokijs')
const { v4: uuidv4 } = require('uuid');
var userdb = new loki('userdb.json')
var users = userdb.addCollection('users')
/*
users.insert({
    id: 'uuid',
    locx: 710,
    locy: 710,
    colour: 0
})
*/
/*
let fakeuser1 = new baseuser('123456789')
fakeuser1.locx = 300
fakeuser1.locy = 300
fakeuser1.colour = 1
let fakeuser2 = new baseuser('987654321')
fakeuser2.locx = 450
fakeuser2.locy = 450
fakeuser2.colour = 2
users.insert(fakeuser1)
users.insert(fakeuser2)
console.log(users.data)
console.log(makeUserList(users.data))
*/

io.on('connection', (socket) => {
    let user = new baseuser(socket.id)
    user.colour = Math.floor(Math.random() * (5 + 1))
    users.insert(user)
    console.log('user ' + socket.id + ' connected!')

    io.emit('user-list', makeUserList(users.data))
    let updater = setInterval(() => { socket.emit('user-list', makeUserList(users.data)); console.log(makeUserList(users.data)) }, 2000)

    let allowMove = true
    
    socket.on('request-move', (positions) => {
        if (allowMove) {
            let user = users.findOne({id: socket.id})
            if (user.locx + positions.x >= 20 && user.locx + positions.x <= 720) {
                user.locx += positions.x
            }
            if (user.locy + positions.y >= 20 && user.locy + positions.y <= 720) {
                user.locy += positions.y
            }
            users.update(user)
            io.emit('user-list', makeUserList(users.data))
            //io.emit('user-move', { id: socket.id, x: positions.x, y: positions.y })
            /* potential anti-cheat code, not yet needed
            allowMove = false
            setTimeout(() => { allowMove = true }, 10)
            */
        }
    })

    socket.on('disconnect', () => {
        clearInterval(updater)
        //users.chain().findOne({id: socket.id}).remove()
        users.remove(users.findOne({id: socket.id}))
        socket.emit('user-list', makeUserList(users.data))
        console.log('user ' + socket.id + ' disconnected!')
    })
})

server.listen(3000, () => console.log('Server started on port 3000'))


//Only use if socket.id doesn't work for whatever reason
async function genUUID() {
    while (true) {
        var uuid = uuidv4()
        let user = users.findOne({id: uuid})
        if (user == null) {
            return uuid
        }
    }
}

function makeUserList(data) {
    let list = []
    for (i = 0; i < data.length; i++) {
        var user = {}
        user.id = data[i].id
        user.locx = data[i].locx
        user.locy = data[i].locy
        user.colour = data[i].colour
        list.push(user)
    }
    return list
}