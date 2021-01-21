const mongoose = require('mongoose');
const moment = require("moment")
const { connect } = require("../../config.json")
const connection = mongoose.createConnection(connect, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

const { UserSchema } = require("./UserScema")

const UserModule = connection.model('Users', UserSchema, "Users")

module.exports.create = async (user) =>
{
    UserModule.create({
                id:  user.id, // String is shorthand for {type: String}
                username: user.username,
                currency:   1000,
                daily: moment().format(),
                cards: [],
                matchMaker: { 
                    match: '',
                    anonymous: true,
                    previous:[],
                    token:3, 
                    maxTokens:3
                }
            }, )
    return await UserModule.findOne({id:user.id})

}

module.exports.User = (user, callBack) =>
{
    UserModule.findOne({id:user.id}, async (err, User) => {
        if(err)throw err
        //console.log(User)
        if(User)
        {
            checkDefaults(User)
            await callBack(User)
        }
        else 
        {
            this.create(user).then(User => callBack(User))
        }
    })
}

module.exports.changeUser = async (user, callback) =>
{

}

module.exports.Hana = (amount) =>
{
    UserModule.findOne({id:"779996172793544735"}, (err, User) => {
        if(err)throw err
        //console.log(User)
        User.currency += amount
        setTimeout(() => {
            User.save();
            }, 100);
    })
}

checkDefaults = (User) =>
{
    if(!User.daily)
    {
        User.daily = moment().format
    }
    if(!User.currency && User.currency !== 0)
    {
        User.currency = 1000
    }
    User.save()
    
}