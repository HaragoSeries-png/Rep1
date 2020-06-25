const express = require('express'),
        router = express.Router();
const   Card = require("../models/card"),
        middleware = require("../middleware/mid"),
        Task = require("../models/task"),
        User = require("../models/user"),
        Chat = require("../models/chat")
        Board = require("../models/board");
const task = require('../models/task');

router.get("/:id",middleware.isLoggedIn,function(req,res){
   
    User.findOne({_id:req.params.id},function(error,uid){ 
        if(error){
            throw error
        }  
        else{    
            console.log('boarddd '+uid.board)        
            Board.find({_id:uid.board}).populate('card','team').exec(function(error,bo){
                if(error){
                    throw error
                }
                else{   
                    
                                   
                    res.render("board",{board:bo,uid:req.params.id,user:uid})
                }               
            })
        }        
    })    
})




router.post("/new",middleware.isLoggedIn,function(req,res){
    console.log("newBoard")
    let bname = req.body.bname;
    let tuid = req.body.uid;
    console.log("-----------------------------------------------------------");
    
    // console.log("bname "+bname+" id "+tuid);
    
     
    Board.create({name:bname,owner:tuid},function(err,r){
        console.log('bo '+r);
        if(err){
            console.log(err)
        }
        else{
            User.findOne({_id:tuid},function(err,u){
                
                
                let bid = r._id;
     
                    
                u.board.push(bid)
                u.save()
                var j = JSON.stringify(bid)
                res.end(j)               
            })
        }
        
    })
     
 })
 
router.delete("/:bid",middleware.isLoggedIn,function(req,res){
    let tbid = req.params.bid;
    let tuid = req.body.uid;
    console.log("del bid = "+tbid+" uid = "+tuid)
    
     
    User.findOne({_id:tuid},function(err,u){
        
        u.board.pull({_id:tbid})
        u.save()
        Board.findById(tbid,function(err,bo){
            console.log("found = "+bo)
           
            if(bo.owner==tuid){
                Board.findOneAndDelete({_id:tbid},function(err,board){
                    
                    (board.card).forEach(tcid => {
                        Card.findOneAndDelete({_id:tcid},function(err,card){
                            (card.task).forEach(ttid => {
                                Task.findOneAndDelete({_id:ttid},function(err,task){
                                    console.log("t t "+task)
                                })
                                
                            })
                            
                        });   
                          
                    })
                    console.log("chat "+board.chat[0]);
                    
                    board.chat.forEach(cc => {
                        Chat.findOneAndDelete({_id:cc},function(err,chat){
                            res.end()
                        })
                        res.end()
                    })
                    res.end()
                })   
                res.end()
            }
            else{
                res.end()
            }
        })
    })

      
 })
router.put("/:bid",middleware.isLoggedIn,function(req,res){
    Board.findOneAndUpdate({_id:req.params.bid},
        {   
            $set:{
                name:req.body.name,
                                
            }
        },function(err,re){
                     
            res.end()
        }
        
    )    
})


module.exports = router;
