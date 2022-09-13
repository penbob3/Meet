<template>
    <div id="mainbox">
        <div id="messagecontainer">
            <div class="message" v-for="msg in messages" :key="msg.id">{{ msg.name }}: {{ msg.message }}</div>
        </div>
        <div id="messagesender">
            <input type="text" id="msginput" v-model="msginputval" placeholder="Enter message..." maxlength="32" @keyup.enter="sendMessage"/>
            <button id="msgbutton" @click="sendMessage" :disabled="!(msginputval.length > 0)">Send</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChatBox',
    props: {
        messages: Array
    },
    data() {
        return {
            msginputval: ''
        }
    },
    mounted() {
        const node = document.getElementsByClassName("input1")[0];
        node.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        // Do work
    }
});
    },
    methods: {
        sendMessage() {
            this.$emit('send-message', this.msginputval)
            this.msginputval = ''
        }
    }
}
</script>

<style scoped>
#mainbox {
    height: 200px;
    width: 350px;
    background-color: rgb(182, 179, 179);
    position: relative;
    margin-left: 720px;
    margin-top: calc(720px - 200px);
    margin-top: 0px;
    z-index: 1;
}

#messagecontainer {
    height: 177px;
    width: 100%;
    background-color: rgb(108, 107, 106);
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column-reverse;
    overflow-y: scroll;
    overflow-x: hidden;
}

.message {
    height: 20px;
    width: 350px;
    flex: 0 0 auto;
    text-align: left;
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    padding-left: 2px;
    padding-right: 2px;
}

#msginput {
    width: 85%;
}
</style>