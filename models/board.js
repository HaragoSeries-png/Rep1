const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');

let BoardSchema = new mongoose.Schema({
    name:String,
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    team:[
        {        
            id:{ 
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            name:String
        }
    ],
    chat:[
        {        
            type:mongoose.Schema.Types.ObjectId,
            ref:"Chat"      
        }
    ],
    
    card:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Card"
    }],
})
BoardSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Board', BoardSchema);