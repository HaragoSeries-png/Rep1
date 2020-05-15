const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    card:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Tada"
    }],
})
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);