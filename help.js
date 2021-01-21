const loadCommands = require('./load-commands')
const {prefix} = require('../../config.json')

module.exports = {
    commands: ["help","h"],
    description: "Lists all of the bot Commands",
    callBack: (message, arguments, text) => 
    {
        let reply = `Supported commands\n\n`
        
        const commands = loadCommands()

        for(const command of commands)
        {
            const { requiredRoles = [] }
            = command 
            let permissions = command.permission
            if(permissions){
                let hasPermission = true
                if(typeof permissions === "string")
                {
                    permissions = [permissions]
                }

                for(const permission of permissions) {
                    if(!message.member.hasPermission(permission))
                    {
                        hasPermission=false
                        break
                    }
                }
                if(!hasPermission)
                {
                    continue
                }

                
            }
            console.log(command)
            let hasRoles = true
            if(requiredRoles.length)
                {
                    hasRoles = false
                    for(const requiredRole of requiredRoles)
                    {
                        const role = message.guild.roles.cache.find(role => role.id === requiredRole)
                        if(role && message.member.roles.cache.has(role.id)){
                            hasRoles = true
                            break
                        }
                    }
                }
            if(!hasRoles)
            {
                continue
            }
            
            
            const mainCommand = typeof command.commands === "string" 
                    ? command.commands 
                    : command.commands[0]
            const args = command.expectedArgs ? ` ${command.expectedArgs}` : ''
            const {description} = command

            reply += `> **${prefix}${mainCommand}${args}** = ${description}\n`
           
        }
        message.channel.send(reply)
    },
}