module.exports = (client, ListenOptions) =>
{
    let {
        callBack = () => {},
        condition = () => {return true},
    } = ListenOptions
    client.on("message", message =>{
        const {
            channel,
            author
        } = message
        if(author.bot)return
        if(channel.type === "dm")return
        if(condition(message))
        {
            callBack(message)
        }

    })
}

