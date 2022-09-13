<template>
    <div id="user" :style="fullStyle">
        <div id="namebadge">{{ name }}</div>
    </div>
</template>

<script>
export default {
    name: "UserBox",
    props: {
        name: String,
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

#namebadge {
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    position: absolute;
    width: 100px;
    height: 20px;
    background-color: rgba(0, 0, 0, 0.273);
    margin-top: -25px;
    margin-left: -40px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: center;
}
</style>