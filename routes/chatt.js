const express = require('express'),
    dateFormat = require('dateformat'),
        router = express.Router();
const   Card = require("../models/card"),
        middleware = require("../middleware/mid"),
        Task = require("../models/task"),
        Chat = require("../models/chat"),
        Board = require("../models/board");


router.post("/",function(req,res){
    console.log("--------------------"+req.body.text);
    var now = new Date();
    var g = dateFormat(now, "hh:MM  ddmmm ");
    console.log("t "+g);
     
    
    
   
    Chat.create({postby_id:req.body.uid,content:req.body.text,ddate:g,date:g},function(err,c){

        Board.findById(req.body.bid,function(err,b){
          
            b.chat.push(c)
            b.save()
        })
        res.redirect("back")
    })
})

module.exports = router;