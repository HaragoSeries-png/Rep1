const express = require('express'),
        router = express.Router();
const   Card = require("../models/card"),
        middleware = require("../middleware/mid"),
        Task = require("../models/task"),
        Board = require("../models/board");

router.get("/:id",middleware.isLoggedIn,function(req,res){
    console.log("get todo");
    
    Board.findOne({_id:req.params.id},function(error,uid){ 
        if(error){
            throw error
        }  
        else{            
            Card.find({_id:uid.card}).populate('task').exec(function(error,ta){
                if(error){
                    throw error
                }
                else{
                   
                    res.render("des",{tad:ta,bid:req.params.id,user:uid.username})
                    res.end()
                }               
            })
        }        
    })    
})



router.get("/new/:bid/:cid",middleware.isLoggedIn,function(req,res){
    console.log("new task")
    let tbid = req.params.bid;
    let tcid = req.params.cid;
    console.log("bid = "+tbid+"cid = "+tcid)

    res.render("addnew",{cid:tcid,bid:tbid});   
})

router.post("/new/:uid",middleware.isLoggedIn,function(req,res){
    console.log("welpost")
    let nn = req.body.n;
    let cid = req.body.id;

    res.redirect("/todo/new/"+req.params.uid+"/"+cid)
})
router.post("/newcard",middleware.isLoggedIn,function(req,res){
    console.log("newcard")
    let tname = req.body.cname;
    let tbid = req.body.bid;
     
    Card.create({name:tname},function(err,r){
       
        Board.findOne({_id:tbid},function(err,tt){
            let cid = r._id;
           
            tt.card.push(cid)
            tt.save()
            var j = JSON.stringify(cid)
            res.end(j)
        })
    })
     
 })
 
router.delete("/del/:uid/:cid/:tid",middleware.isLoggedIn,function(req,res){
     let ttid = req.params.tid;
     let tcid = req.params.cid;
     let tuid = req.params.uid;
     
    Card.findOne({_id:tcid},function(err,t){
        
        t.task.pull({_id:ttid})
        t.save()
    })
    Task.findOneAndDelete({"_id":ttid},function(err,task){

     

    }) 
    
   
     res.redirect("/todo/"+tuid)
 })
router.delete("/delc/:cid",middleware.isLoggedIn,function(req,res){
    let tbid = req.body.bid;
    let tcid = req.params.cid;
    console.log("cid = "+tcid +"bid = "+tbid);
    
    
    Card.findOneAndDelete({"_id":tcid},function(err,task){



    })    
    Board.findOne({_id:tbid},function(err,user){
        
        user.card.pull({_id:tcid})
        user.save()
        res.end()
    })
    
    // res.redirect("/todo/"+tuid)
})
router.post("/:uid",middleware.isLoggedIn,function(req,res){
    console.log("post new /:uid")
    let id = req.body.id
    let ttask = req.body.task
    let tdate = req.body.date
    let tdes = req.body.text
    let tprio = req.body.prio
    let su = {tname:ttask,tdate:tdate,tdes:tdes,tprio:tprio,tiscom:"notcom" }
    console.log("is id"+id)
    Task.create(su,function(err,result){
        console.log("reee"+result)
        Card.findById(id,function(error,tad){
            
            tad.task.push(result._id)
            console.log(tad)        
            tad.save()
        })    
        res.redirect("/todo/"+req.params.uid);
    })
    
    
})

router.get("/show/:uid/:cid/:tid",middleware.isLoggedIn,function(req,res){
    let ttid = req.params.tid;
    let tcid = req.params.cid;
    let tuid = req.params.uid;

    Task.findOne({_id:ttid},function(err,t){
        
        res.render("showtask",{task:t,uid:tuid,cid:tcid,tid:ttid})      
    })     
})

router.put("/edit/:id/:cid/:tid",middleware.isLoggedIn,function(req,res){
    Task.findOneAndUpdate({_id:req.params.tid},
        {   
            $set:{
                tname:req.body.name,
                tdate:req.body.date,
                tdes:req.body.des, 
                tprio:req.body.prio    
            }
        },function(err){
            res.redirect("/todo/"+req.params.id)
        }
        
    )
})
router.put("/comp/:tid",function(req,res){
    console.log("iscom"+req.body.iscom)
    Task.findOneAndUpdate({_id:req.params.tid},
        {   
            $set:{
                tiscom:req.body.iscom   
            }
        },function(err,tt){
            var co=JSON.stringify(req.body.iscom)
            res.end(co)
        }
        
    )
})

module.exports = router;
