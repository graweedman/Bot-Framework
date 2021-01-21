const mongoose = require('mongoose');
  const moment = require("moment")
  const { Schema } = mongoose;

  module.exports.UserSchema = new Schema({
    id:  String, // String is shorthand for {type: String}
    username: String,
    currency:   Number,
    daily: { type: String, default: moment().format() },
    dailyM: {type: Number, default: 1},
    cards: [{id:{type:Number}, count: {type:Number}}],
    matchMaker: { 
        match: {type:String},
        anonymous:{type:Boolean},
        previous:[{type:String}],
        token:{type:Number}, 
        maxTokens:{type:Number},
        reward:{ type: Date, default: Date.now } 
    }
  });