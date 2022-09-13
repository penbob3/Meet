<template>
  <div id="stage">
    <UserBox v-for="user in userlist" :key="user.id" :posx="user.locx" :posy="user.locy" :colour="colourChart[user.colour].value"/>
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
    //var url = "http://localhost:3000"
    var url = "/"
    const socket = io(url, { pingInterval: 1000, pingTimeout: 5000 })
    socket.on('user-list', (data) => {
      console.log(data)
      this.userlist = data
    })



    kd.run(function () {
      kd.tick()
    })

    setTimeout(kd.tick(), 100)

    kd.LEFT.down(() => {
      socket.emit('request-move', { x: -10, y: 0 })
    })

    kd.RIGHT.down(() => {
      socket.emit('request-move', { x: 10, y: 0 })
    })

    kd.UP.down(() => {
      socket.emit('request-move', { x: 0, y: -10 })
    })

    kd.DOWN.down(() => {
      socket.emit('request-move', { x: 0, y: 10 })
    })
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
