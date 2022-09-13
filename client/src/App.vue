<template>
  <div id="stage">
    <UserBox v-for="user in userlist" :key="user.id" :name="user.name" :posx="user.locx" :posy="user.locy" :colour="colourChart[user.colour].value" :isplayer="true"/>
    <div id="namechanger">
      <input type="text" id="nameinput" v-model="nameinputval" placeholder="Enter new name..." maxlength="11"/>
      <button id="namebutton" @click="changeName" :disabled="!(nameinputval.length > 0)">Change</button>
    </div>
    <ChatBox :messages="messagelist" @send-message="sendMessage" />
  </div>
</template>

<script>
import UserBox from './components/UserBox.vue'
import ChatBox from './components/ChatBox.vue'
import io from 'socket.io-client'
import kd from 'keydrown'

export default {
  name: 'App',
  components: {
    UserBox,
    ChatBox
  },
  data() {
    return {
      colourChart: [
        { colour: 'white', value: '#ffffff' },
        { colour: 'red', value: '#b32b2b' },
        { colour: 'blue', value: '#3a68c9' },
        { colour: 'green', value: '#229926' },
        { colour: 'yellow', value: '#c4d950' },
        { colour: 'pink', value: '#c74485'}
      ],
      userlist: [],
      nameinputval: '',
      socket: null,
      messagelist: [
        { name: "Server", message: "Welcome to the chat!" },
        { name: "Server", message: "Hello!" }
      ]
    }
  },
  mounted() {
    //var url = "http://localhost:3001"
    var url = "/"
    this.socket = io(url, { pingInterval: 1000, pingTimeout: 5000 })
    this.socket.on('user-list', (data) => {
      //console.log(data)
      this.userlist = data
    })

    this.socket.on('connect', () => {
      console.log('Connected to server')
    })

    this.socket.on('sent-message', (msgobj) => {
      this.messagelist.unshift(msgobj)
    })

    this.socket.on('disconnect', () => {
      location.reload()
      console.log('Disconnected from server')
    })

    //up down left right
    let keyvalues = [0, 0, 0, 0]
    let keyvalchanged = false
    setInterval(() => {
      //console.log(keyvalchanged)
      kd.tick()
      if (keyvalchanged) {
        keyvalchanged = false
        //emit values
        let ymove = (keyvalues[0] * -1) + keyvalues[1]
        let xmove = (keyvalues[2] * -1) + keyvalues[3]
        //console.log(xmove + " " + ymove)
        if (xmove != 0 || ymove != 0) {
          this.socket.emit('request-move', { x: xmove, y: ymove })
        }
      }
    }, 10)

    //There is a better way to do this, i.e. keycodes mapped to array index, but I'm lazy
    kd.UP.down(() => { keyvalues[0] = 1; keyvalchanged = true })
    kd.DOWN.down(() => { keyvalues[1] = 1; keyvalchanged = true })
    kd.LEFT.down(() => { keyvalues[2] = 1; keyvalchanged = true })
    kd.RIGHT.down(() => { keyvalues[3] = 1; keyvalchanged = true })

    kd.UP.up(() => { keyvalues[0] = 0; keyvalchanged = true })
    kd.DOWN.up(() => { keyvalues[1] = 0; keyvalchanged = true })
    kd.LEFT.up(() => { keyvalues[2] = 0; keyvalchanged = true })
    kd.RIGHT.up(() => { keyvalues[3] = 0; keyvalchanged = true })
  },
  methods: {
    changeName() {
      if (this.nameinputval != '') {
        this.socket.emit('request-change-name', this.nameinputval)
        this.nameinputval = ''
      }
    },
    sendMessage(message) {
      let msgreq = {
        id: this.socket.id,
        message: message
      }
      this.socket.emit('request-send-message', msgreq)
    }
  }
}
</script>

<style>
#app {
  text-align: center;
  width: 100vw;
  height: 100vh;
  background-color: rgb(136, 136, 136); 
  display: grid;
  place-items: center;
}

#stage {
  height: 720px;
  width: 720px;
  background-color: rgba(87, 87, 87);
}

#namechanger {
  height: 30px;
  width: 200px;
  background-color: rgba(250, 235, 215, 0.284);
  position: absolute;
  margin-top: 720px;
  padding-top: 6px;
}

#nameinput {
  width: 60%;
}
</style>
