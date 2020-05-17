const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');

let tadatable = new mongoose.Schema({
    name:String,
    task:[
        {
        tname:String,
        tdate:String,
        tdes:String
        }

    ]
})  
module.exports = mongoose.model("Tada",tadatable);