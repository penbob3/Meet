<template>
    <div id="user" :style="fullStyle"></div>
</template>

<script>
export default {
    name: "UserBox",
    props: {
        posx: Number,
        posy: Number,
        colour: String
    },
    computed: {
        fullStyle() {
            return 'background-color: ' + this.colour + '; margin-left: ' + (this.posx - 20) + 'px; margin-top: ' + (this.posy - 20) + 'px;'
        }
    }
}
</script>

<style scoped>
#user {
    height: 20px;
    width: 20px;
    position: absolute;
}
</style>