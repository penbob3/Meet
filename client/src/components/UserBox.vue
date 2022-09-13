<template>
    <div id="user" :style="fullStyle">
        <div id="namebadge">
            <div id="innername">{{ name }}</div>
        </div>
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
    margin-top: -25px;
    margin-left: -40px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: center;
}

#innername {
    background-color: rgba(0, 0, 0, 0.273);
    height: 100%;
    max-width: 100px;
    width: fit-content;
    display: inline-block;
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 1px;
}
</style>