const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');

let ChatSchema = new mongoose.Schema({
        
       
            postby_id:{ 
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },            
            content:String,
            date:{
                type:Date
            },
            ddate:String
         
})
ChatSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Chat', ChatSchema);