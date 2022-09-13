const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

class baseuser {
    constructor(id) {
        this.id = id
        let name = "twelvecharacterslong"
        while (name.length > 11) {
            name = uniqueNamesGenerator({dictionaries: [colors, animals], separator: '-', length: 2})
        }
        this.name = name,
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
var userchanges = userdb.addCollection('userchanges')

/*
users.insert({
    id: 'uuid',
    locx: 710,
    locy: 710,
    colour: 0
})
userchanges.insert({
    id: 'socketid',
    dx: 10,
    dy: 10
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

//10 ticks per second, 10ms per tick
const tickrate = 10
//10 pixels moved per tick
const moverate = 4

let userlistchange = false

function mainLoop() {
    //begin timer
    let start = Date.now()
    let emitrequired = false

    if (userchanges.data.length > 0) {
        emitrequired = true
        //apply current transformations
        userchanges.data.forEach((change) => {
            let user = users.findOne({ id: change.id })
            if (user.locx + (change.dx * moverate) >= 20 && user.locx + (change.dx * moverate) <= 720) {
                user.locx += (change.dx * moverate)
            }
            if (user.locy + (change.dy * moverate) >= 20 && user.locy + (change.dy * moverate) <= 720) {
                user.locy += (change.dy * moverate)
            }
            //user.locy += (change.dy * moverate)
            users.update(user)
        })
        userchanges.clear()
    }

    if (userlistchange) {
        emitrequired = true
        userlistchange = false
    }

    if (emitrequired) {
        //push changes to clients
        io.emit('user-list', makeUserList(users.data))
    }

    //end timer
    let end = Date.now()
    let elapsed = end - start
    if (elapsed < tickrate) {
        //console.log('Tick took ' + elapsed + 'ms, sleeping for ' + (tickrate - elapsed) + 'ms')
        setTimeout(mainLoop, tickrate - elapsed)
    } else {
        console.log('Tick took too long! Time: ' + elapsed)
    }
}

mainLoop()

io.on('connection', (socket) => {
    let user = new baseuser(socket.id)
    user.colour = Math.floor(Math.random() * (5 + 1))
    users.insert(user)
    console.log('user ' + socket.id + ' connected!')
    userlistchange = true

    socket.on('request-move', (positions) => {
        var change = {
            id: socket.id,
            dx: positions.x,
            dy: positions.y
        }
        if (userchanges.findOne({id: socket.id}) == null) {
            userchanges.insert(change)
        }
    })

    socket.on('request-change-name', (name) => {
        console.log('user ' + socket.id + ' requested name change to ' + name)
        let user = users.findOne({ id: socket.id })
        if (name.length <= 11) {
            user.name = name
            users.update(user)
            userlistchange = true
        } else {
            socket.disconnect()
        }
    })

    socket.on('disconnect', () => {
        users.remove(users.findOne({id: socket.id}))
        console.log('user ' + socket.id + ' disconnected!')
    })
})

server.listen(3001, () => console.log('Server started on port 3000'))

function makeUserList(data) {
    let list = []
    for (i = 0; i < data.length; i++) {
        var user = {}
        user.id = data[i].id
        user.name = data[i].name
        user.locx = data[i].locx
        user.locy = data[i].locy
        user.colour = data[i].colour
        list.push(user)
    }
    return list
}