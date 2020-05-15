const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');

let tadatable = new mongoose.Schema({
    name:String,
    sub:[
        {subn:String,subs:String}

    ]
})  
module.exports = mongoose.model("Tada",tadatable);