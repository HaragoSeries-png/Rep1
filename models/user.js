const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
    username:String,    
    password:String,
    email:String,
    name:String,
    board:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"board"
    }],
})
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);