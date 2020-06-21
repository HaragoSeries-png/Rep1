const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');

let BoardSchema = new mongoose.Schema({
    name:String,
    card:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Card"
    }],
})
BoardSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Board', BoardSchema);