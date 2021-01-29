const mongoose = require('mongoose');
const moment = require('moment')
const { connect } = require("../../config.json")
const connection = mongoose.createConnection(connect, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

const { UserSchema } = require("./UserScema")

const UserModule = connection.model('Users', UserSchema, "Users")

module.exports.create = async (user,NewUser) =>
{
    UserModule.create(NewUser)
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

module.exports.SortedUsers = (sort, callBack)
{
    UserModule.find().sort(sort).exec(callBack)
}

module.exports.changeUser = async (user, callback) =>
{

}

checkDefaults = (User) =>
{

    User.save()
    
}