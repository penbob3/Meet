<template>
  <div id="stage">
    <UserBox v-for="user in userlist" :key="user.id" :name="user.name" :posx="user.locx" :posy="user.locy" :colour="colourChart[user.colour].value"/>
  </div>
</template>

<script>
import UserBox from './components/UserBox.vue'
import io from 'socket.io-client'
import kd from 'keydrown'

export default {
  name: 'App',
  components: {
    UserBox
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
      userlist: []
    }
  },
  mounted() {
    var url = "http://localhost:3001"
    //var url = "/"
    const socket = io(url, { pingInterval: 1000, pingTimeout: 5000 })
    socket.on('user-list', (data) => {
      //console.log(data)
      this.userlist = data
    })

    /*
    kd.run(function () {
      kd.tick()
    })
    */

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
          socket.emit('request-move', { x: xmove, y: ymove })
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

    

    /*
    kd.LEFT.down(() => {
      socket.emit('request-move', { x: -1, y: 0 })
    })

    kd.RIGHT.down(() => {
      socket.emit('request-move', { x: 1, y: 0 })
    })

    kd.UP.down(() => {
      socket.emit('request-move', { x: 0, y: -1 })
    })

    kd.DOWN.down(() => {
      socket.emit('request-move', { x: 0, y: 1 })
    })
    */
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
</style>
