const express = require('express'),
        router = express.Router(),
        passport = require("passport"),
        User = require("../models/user"),
        middleware = require("../middleware/mid");

router.get("/signup",function(req,res){

    res.render("signUp")
})

router.post('/signup', function(req,res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('signup');
        }
        passport.authenticate('local')(req,res,function(){
            console.log(user._id)
            res.redirect('/login');
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
    req.flash("login")
   
    
 
    User.find({username:tu},function(err,u){
        
       
           
            res.redirect("/todo/"+u[0]._id)
       
        
    }).limit(1)
})

router.get("/logout",middleware.isLoggedIn,function(req,res){
    req.logout();
    res.redirect("/")
})

module.exports = router;