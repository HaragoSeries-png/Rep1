const express = require('express'),
        router = express.Router();
const   Tada = require("../models/tada"),
        middleware = require("../middleware/mid"),
        Task = require("../models/task"),
        User = require("../models/user");

router.get("/:id",middleware.isLoggedIn,function(req,res){
   
    User.findOne({_id:req.params.id},function(error,uid){ 
        if(error){
            throw error
        }  
        else{
            
            Tada.find({_id:uid.card}).populate('task').exec(function(error,ta){
                if(error){
                    throw error
                }
                else{
                    
                    let tn = ta                    
                    res.render("zone1",{tada:ta,id:req.params.id,user:uid.username})
                }
                
            })
        }
        
    })
    
    
})



router.get("/new/:uid/:cid",middleware.isLoggedIn,function(req,res){

    let tcid = req.params.cid;
    let tuid = req.params.uid;

    res.render("addnew",{cid:tcid,uid:tuid});   
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
     let tuser = req.body.uid;
     
     Tada.create({name:tname},function(err,r){
       
         User.findOne({_id:tuser},function(err,tt){
             let cid = r._id;
        
             tt.card.push(cid)
             tt.save()
   
             res.redirect("/todo/"+tuser)
         })
     })
     
 })
 
router.post("/del/:uid/:cid/:tid",middleware.isLoggedIn,function(req,res){
     let ttid = req.params.tid;
     let tcid = req.params.cid;
     let tuid = req.params.uid;
     
    Tada.findOne({_id:tcid},function(err,t){
        
        t.task.pull({_id:ttid})
        t.save()
    })
    Task.findOneAndDelete({"_id":ttid},function(err,task){

     

    }) 
    
   
     res.redirect("/todo/"+tuid)
 })
router.post("/delc/:uid/:cid",middleware.isLoggedIn,function(req,res){
    let tuid = req.params.uid;
    let tcid = req.params.cid;
    
    
    Tada.findOneAndDelete({"_id":tcid},function(err,task){



    })    
    User.findOne({_id:tuid},function(err,user){
        
        user.card.pull({_id:tcid})
        user.save()

    })
    
    res.redirect("/todo/"+tuid)
})
router.post("/:uid",middleware.isLoggedIn,function(req,res){
    console.log("post new /:uid")
    let id = req.body.id
    let ttask = req.body.task
    let tdate = req.body.date
    let tdes = req.body.text
    let tprio = req.body.prio
    let su = {tname:ttask,tdate:tdate,tdes:tdes,tprio:tprio }
    console.log("is id"+id)
    Task.create(su,function(err,result){
        console.log("reee"+result)
        Tada.findById(id,function(error,tad){
            
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

router.post("/edit/:id/:cid/:tid",middleware.isLoggedIn,function(req,res){
    Task.findOneAndUpdate({_id:req.params.tid},
        {   
            $set:{
                tname:req.body.name,
                tdate:req.body.date,
                tdes:req.body.des    
            }
        },function(err){
            res.redirect("/todo/"+req.params.id)
        }
        
    )
})

module.exports = router;
