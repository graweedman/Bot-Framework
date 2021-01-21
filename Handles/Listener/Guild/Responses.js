const { callBack } = require("./MessageReward")

module.exports = {
    listener: ({content, channel}) => {
        const response = (check, response) =>{
            if(content.toLowerCase() === check.toLowerCase()) channel.send(response)
        }
        response("OwO", "https://cdn.discordapp.com/emojis/795600660166344745.png?v=1")
    }
}

