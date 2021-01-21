const GainedReward = new Set();
const UserManager = require("../../Users/UserManager")

module.exports = {
    condition: (message) =>
    {
        const {member} = message
        if(message.author.bot)return false
        if(GainedReward.has(member.id))return false
        return true
    },
    callBack: (message) =>
    {
        const reward = async (User) => {
            User.currency++
            GainedReward.add(message.author.id);
            setTimeout(() => {
                GainedReward.delete(message.author.id);
                }, 30000);
            setTimeout(() => {
                User.save();
                }, 100);
            
        }
        UserManager.User(message.author, reward)
    },
    ignoredChannels: ["799001918151721021", "795403419552579675"]
}