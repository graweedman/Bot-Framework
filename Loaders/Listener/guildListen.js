module.exports = (client, ListenOptions) =>
{
    let {
        listener,
        callBack = () => {},
        condition = () => {return true},
        requiredRoles = [],
        listeningChannels = [],
        ignoredChannels = [],
        listeningMembers = []
    } = ListenOptions
    client.on("message", message =>
    {
        let hasRoles = false
        let {
            author,
            channel,
            member,
            guild
        } = message
        if(channel.type === "dm")return
        if(listener)
        {
            if(!author.bot)
            {
                listener(message)
            }
        }
        if(listeningChannels.length)
        {
            if(!listeningChannels.includes(channel.id)) return
        }
        if(ignoredChannels.length)
        {
            if(ignoredChannels.includes(channel.id)) return
        }
        if(listeningMembers.length)
        {
            if(!listeningMembers.includes(member.id)) return
        }
        if(requiredRoles.length)
        {
            for(const requiredRole of requiredRoles)
            {
                const role = guild.roles.cache.find(role => role.id === requiredRole)
                if(role && member.roles.cache.has(role.id)){
                    hasRoles = true
                    break
                }
            }
        }
        else
        {
            hasRoles = true
        }
        if(!hasRoles)return
        if(condition(message))
        {
            callBack(message)
        }

    })

}