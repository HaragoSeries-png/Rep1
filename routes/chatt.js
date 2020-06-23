const express = require('express'),
        router = express.Router();
const   Card = require("../models/card"),
        middleware = require("../middleware/mid"),
        Task = require("../models/task"),
        Chat = require("../models/chat"),
        Board = require("../models/board");

router.post("/",function(req,res){
    console.log("--------------------"+req.body.text);
    
    

    
    Chat.create({postby_id:req.body.uid,content:req.body.text},function(err,c){
        console.log("will push "+c.content)
        Board.findById(req.body.bid,function(err,b){
            console.log("push "+b)
            b.chat.push(c)
            b.save()
        })
        res.redirect("back")
    })
})

module.exports = router;