const express = require("express");
let app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const User = require('./models/user'),
        card = require("./models/card"),
        flash = require('connect-flash'),
        passport = require('passport'),
        passportLocal = require('passport-local'),
        passportLocalMongoose = require('passport-local-mongoose'),
        middleware = require("./middleware/mid"),
        todoRoutes = require("./routes/todoo"),
        chatRoutes = require("./routes/chatt"),
        boardRoutes = require("./routes/board"),
        indexRoutes = require("./routes/userr"),
        methodOverride = require("method-override")
const port = process.env.PORT||3000;
const URI = "mongodb+srv://chanon:132231@cluster0-broqy.mongodb.net/test?retryWrites=true&w=majority"
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
// mongoose.set('useCreateIndex',true);
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;  
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});
app.use(methodOverride("_method"));
mongoose.set('useFindAndModify', false);
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



    
// card.create({
//         name :"min",
//         sex:"male"
//     },function(error,card){
//         if(error){
//             console.log('error');
//         }
//         else{
//             console.log("added");
//             console.log(card);
//         }
// });
app.use("/",indexRoutes);
app.use("/board",boardRoutes);
app.use("/todo",todoRoutes);
app.use("/chat",chatRoutes);
 

app.get("/",function(req,res){
    res.render("home",{sub:card.sub});
})






app.listen(port, function(req,res){
    console.log("welcome to the Laboratory")
}) 