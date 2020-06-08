const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');

let tadatable = new mongoose.Schema({
    name:String,
    task:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Task"
        }

    ]
})  
module.exports = mongoose.model("Tada",tadatable);