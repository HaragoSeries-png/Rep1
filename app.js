const express = require("express");
let app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const User = require('./models/user'),
        Tada = require("./models/tada"),
        flash = require('connect-flash'),
        passport = require('passport'),
        passportLocal = require('passport-local'),
        passportLocalMongoose = require('passport-local-mongoose'),
        middleware = require("./middleware/mid"),
        todoRoutes = require("./routes/todoo"),
        indexRoutes = require("./routes/userr")

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://chanon:132231@cluster0-broqy.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser:true});
app.use(require('express-session')({
    secret: 'CSS227',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
   
    next();
});

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



    
// Tada.create({
//         name :"min",
//         sex:"male"
//     },function(error,tada){
//         if(error){
//             console.log('error');
//         }
//         else{
//             console.log("added");
//             console.log(tada);
//         }
// });
app.use("/",indexRoutes);
app.use("/todo",todoRoutes);
 

app.get("/",function(req,res){
    res.render("home",{sub:Tada.sub});
})






app.listen(3000, function(req,res){
    console.log("welcome to the Laboratory")
}) 