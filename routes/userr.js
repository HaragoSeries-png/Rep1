const board = require('../models/board');

const express = require('express'),
        router = express.Router(),
        passport = require("passport"),
        Board = require("../models/board"),
        User = require("../models/user"),
        middleware = require("../middleware/mid");

router.get("/signup",function(req,res){

    res.render("signUp")
})

router.post('/signup', function(req,res){
    User.register(new User({username: req.body.username,name:req.body.username,email:req.body.email}), req.body.password, function(err, user){
        console.log("aaaaaaaaaaaaaaaaaaaa "+user);        
        if(err){
            console.log("erree");
            console.log(err);
           
            return res.render('./signup');
        }
        console.log("bbbbbbbbbbbbbbbb");
        passport.authenticate('local')(req,res,function(){
            console.log("reg complete");
            
            console.log(user._id)
            res.redirect('/board/'+user._id);
        });
    });
});

router.get("/gg" ,function(req,res){

    res.render("gg")
})


router.get("/login",function(req,res){
    res.render("login")
})
router.post("/login",function(req,res,next){
    passport.authenticate('local',{failureFlash:"fail",failureRedirect:"/login"})(req,res,function(){
        
        console.log("autennnnnnnnnnn")
        next();
    
})},function(req, res){
    let tu = req.body.username
    console.log("uuusername "+tu)
   
    
 
    User.find({username:tu},function(err,u){
            console.log("uuu "+u[0]._id)
           
            res.redirect("/board/"+u[0]._id)        
    }).limit(1)
})

router.get("/logout",middleware.isLoggedIn,function(req,res){
    req.logout();
    
   
    res.redirect("/")
})
router.get("/profile/:uid",middleware.isLoggedIn,function(req,res){
    res.render("./profile")
})

router.put("/edit/:uid",middleware.isLoggedIn,function(req,res){
    
    User.findOneAndUpdate({_id:req.params.uid},
        {   
            $set:{
                name:req.body.name,
                email:req.body.email                 
            }
        },function(err,re){
                     
            res.end()
        }
        
    )
})
router.put("/invite",middleware.isLoggedIn,function(req,res){
    
    var uid= req.body.uid,
        bid =req.body.bid;
    console.log("uid "+uid+" bid "+bid)
    Board.findById(bid,function(err,bo){
        console.log("found = "+bo)
        if(!bo){
            console.log("wrong");
            
            return res.redirect("back")
        }
        else if(bo.owner==uid){
            console.log("arlldlasdas")
            return res.redirect("back")
        }
        else{
            User.findOne({_id:uid},function(err,u){                                    
                u.board.push(bid)
                u.save()
                console.log("addd boo");
               
                
                res.redirect("/board/"+uid)              
            })
        }
    })
    
})
router.get("/invite/",middleware.isLoggedIn,function(req,res){
    res.render("add-board")
})


module.exports = router;