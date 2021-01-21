const eventRoles = require("../../eventRoles")

module.exports = {
    commands: ["event"],
    expectedArgs: "<event name>",
    permissionError: "You do not have required permissions",
    description: "Shows info about a server event.",
    requiredRoles:[],
    minArgs: 1,
    maxArgs: 1,
    callBack: (message, arguments, text) => {
        let desiredRole = arguments[0].toLowerCase();
        if(eventRoles[desiredRole] === undefined) {
            message.channel.send(`Unknown event.`)
            return;
        }
        
        const roleID = eventRoles[desiredRole].id;
        const role = message.guild.roles.cache.get(roleID);
        if(role !== undefined) {
            message.channel.send(`The event started on ${role.createdAt}\nThis event gave the **${role.name}** role, and there are **${role.members.size}** remaining members with this role.`)
            console.log(role.members)
        }
    }
    
}