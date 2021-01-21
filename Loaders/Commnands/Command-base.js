const { prefix } = require("../../config.json")
const usedCommand = new Set();

module.exports = (client, commandOptions) =>
{
    let {
        commands,
        expectedArgs = '',
        permissionError = 'You do not have permissions to use this command',
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        requiredRoles = [],
        allowedChannels = [],
        callBack
    } = commandOptions


    if(typeof commands === "string"){
        commands = [commands]
    }

    console.log(`Registering command "${commands[0]}"`)

    client.on("message", message => {
        const { member, content , guild } = message
        let hasRoles = false
        for(const alias of commands)
        {
            if(content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`))
            {
                if(usedCommand.has(message.author.id))
                {
                    message.channel.send("Wait 5 seconds before using another command.")
                    return
                }
                
                if(requiredRoles.length)
                {
                    for(const requiredRole of requiredRoles)
                    {
                        const role = guild.roles.cache.find(role => role.id === requiredRole)
                        console.log(role.id)
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
                
                if(!hasRoles)
                {
                    message.channel.send("You dont have required Role")
                    return
                }
                const arguments = splitCommandLine(content)

                console.log(`Command ${alias} has been run`)
                arguments.shift()
    
                if(arguments.length < minArgs ||
                (maxArgs !== null && arguments.length > maxArgs))
                {
                    message.reply(`Invalid syntax! Use ${prefix}${alias} ${expectedArgs}`)
                    return
                }
                
                // Handle
                callBack(message, arguments, arguments.join(' '))
                if(message.author.id !== "779996172793544735" || message.author.id !== "272697254165348353")
                {
                    usedCommand.add(message.author.id);
                    setTimeout(() => {
                        // Removes the user from the set after a minute
                        usedCommand.delete(message.author.id);
                        }, 5000);
                }
                return
            }
            
            
        }

        
    })
}

function splitCommandLine( commandLine ) {

    //  Find a unique marker for the space character.
    //  Start with '<SP>' and repeatedly append '@' if necessary to make it unique.
    var spaceMarker = '<SP>' ;
    while( commandLine.indexOf( spaceMarker ) > -1 ) spaceMarker += '@' ;

    //  Protect double-quoted strings.
    //   o  Find strings of non-double-quotes, wrapped in double-quotes.
    //   o  The final double-quote is optional to allow for an unterminated string.
    //   o  Replace each double-quoted-string with what's inside the qouble-quotes,
    //      after each space character has been replaced with the space-marker above.
    //   o  The outer double-quotes will not be present.
    var noSpacesInQuotes = commandLine.replace( /"([^"]*)"?/g, ( fullMatch, capture ) => {
        return capture.replace( / /g, spaceMarker ) ;
    }) ;

    //  Now that it is safe to do so, split the command-line at one-or-more spaces.
    var mangledParamArray = noSpacesInQuotes.split( / +/ ) ;


    //  Create a new array by restoring spaces from any space-markers.
    var paramArray = mangledParamArray.map( ( mangledParam ) => {
        return mangledParam.replace( RegExp( spaceMarker, 'g' ), ' ' ) ;
    });


    return paramArray ;
}