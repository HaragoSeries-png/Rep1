const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    card:[],
})
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);