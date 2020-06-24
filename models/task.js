const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');

let tasktable = new mongoose.Schema({
       
        tname:String,
        tdate:String,
        tdes:String,
        tprio:String,
        tiscom:String,
        
        
})  
module.exports = mongoose.model("Task",tasktable);