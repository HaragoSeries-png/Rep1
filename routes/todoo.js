const express = require('express'),
        router = express.Router();
const   Tada = require("../models/tada"),
        middleware = require("../middleware/mid"),
        User = require("../models/user");

router.get("/:id",middleware.isLoggedIn,function(req,res){
    console.log(req.params.id)
    User.findOne({_id:req.params.id},function(error,uid){ 
        if(error){
            throw error
        }  
        else{
            console.log(uid);
            Tada.find({_id:uid.card},function(error,ta){
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
    console.log("dic "+req.params.cid);
    let tcid = req.params.cid;
    let tuid = req.params.uid;
    console.log("id is :" +tcid);
    res.render("addnew",{cid:tcid,uid:tuid});   
})

router.post("/new/:uid",middleware.isLoggedIn,function(req,res){
    console.log("welpost")
    let nn = req.body.n;
    let cid = req.body.id;
    console.log(cid);
    res.redirect("/todo/new/"+req.params.uid+"/"+cid)
})
router.post("/newcard",middleware.isLoggedIn,function(req,res){
    console.log("newcard")
     let tname = req.body.cname;
     let tuser = req.body.uid;
     
     Tada.create({name:tname},function(err,r){
       
         User.findOne({_id:tuser},function(err,tt){
             let cid = r._id;
             console.log(cid)
             tt.card.push(cid)
             tt.save()
             console.log("this shit")
             res.redirect("/todo/"+tuser)
         })
     })
     
 })
 
router.post("/del/:uid/:cid/:tid",middleware.isLoggedIn,function(req,res){
     let ttid = req.params.tid;
     let tcid = req.params.cid;
     let tuid = req.params.uid;
     
    Tada.findOneAndUpdate({"task._id":ttid},{$pull:{"task":{_id:ttid}}},{"task.$":1},function(err,task){
            console.log(task.task)       
    })    
    
   
     res.redirect("/todo/"+tuid)
 })
router.post("/delc/:uid/:cid",middleware.isLoggedIn,function(req,res){
    let tuid = req.params.uid;
    let tcid = req.params.cid;
    
    
    Tada.findOneAndDelete({"_id":tcid},function(err,task){

        console.log(task)

    })    
    User.findOne({_id:tuid},function(err,user){
        console.log("card"+user.card)
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
    let su = {tname:ttask,tdate:tdate,tdes:tdes}
    console.log("is id"+id)
    
    Tada.findById(id,function(error,tad){
        console.log(tad)
        console.log(su)
        tad.task.push(su)
        console.log(tad)        
        tad.save()
    })    
    res.redirect("/todo/"+req.params.uid);
})

router.get("/show/:id/:cid/:tid",middleware.isLoggedIn,function(req,res){
    let ttid = req.params.tid;
     let tcid = req.params.cid;
     let tuid = req.params.uid;
     console.log("fiiii"+ttid)
    Tada.findOne({"task":{$eleMatch:{_id:ttid}}},function(err,t){
        console.log("t"+t)
    })    
    
   
     
})

module.exports = router;
