const path = require("path")
const fs = require('fs')

module.exports = (client) => {
    const guildFile = 'guildListen.js'
    const DMFile = 'dmListen.js'
    const loadFile = 'load-listeners.js'
    //const commandBase = require(`./${baseFile}`)
    const dmBase = require(`./${DMFile}`)
    const guildBase = require(`./${guildFile}`)

    
    const readCommands = (dir, callBack, baseFile) => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for(const file of files)
        {
            if(file !== baseFile && file !== loadFile)
            {
                const option = require(path.join(__dirname, dir, file))
                if(client){
                    //console.log(file,option)

                    callBack(client, option)
                }
            }
        }
    }
    //readCommands('./DM',dmBase, DMFile)
    readCommands('./Guild', guildBase, guildFile)
    //return commands
}