const express = require("express");
let app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

app.set("view engine","ejs");
app.use(express.static(__dirname + "/public", {
    index: false, 
    immutable: true, 
    cacheControl: true,
    maxAge: "30d"
}));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/test", {useNewUrlParser:true});

let tadatable = new mongoose.Schema({
    name:String,
    sub:[
        {
        subn:String,
        subs:String
        }
    ]

})  
let Tada = mongoose.model("Tada",tadatable);

let usertable = new mongoose.Schema({
    username:String,
    password:String,
    card:[String]
})
let User = mongoose.model("User",usertable);
    
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

 

app.get("/",function(req,res){
    res.render("home",{sub:Tada.sub});
})


app.get("/signup",function(req,res){

    res.render("signUp")
})
app.post("/signup",function(req,res){
    let ut = req.body.username;
    let pt = req.body.password;
    User.find({username:ut},function(err,result){
        if(result.username==null){
            res.redirect("/signup")
        }
        else{
            let data = {username:ut,password:pt}
            User.create(data,function(err,d){
                console.log(d)
                res.redirect("/login")
            })
        }
    })
    
})


app.get("/login",function(req,res){
    res.render("login")
})
app.post("/login",function(req,res){
    let tu = req.body.username
    console.log(tu)
    let tp = req.body.password
    console.log(tp)
    console.log(User.password)
    User.find({username:tu},function(err,u){
        console.log(u[0].password+"tp "+tp)
        if(tp==u[0].password){
            console.log("RRRR")
            res.redirect("/todo")
        }
        else{
            res.redirect("/login")
        }
    }).limit(1)
    
})


app.get("/todo",function(req,res){
    Tada.find({},function(error,ta){
        let tn = ta
        let ts = ta.sub
        res.render("zone1",{tada:ta,sub:ts})
    })
    
})
app.post("/todo",function(req,res){
    
    let id = req.body.id
    let ts1 = req.body.s1
    let ts2 = req.body.s2
    let su = {t1:ts1,t2:ts2}
    console.log(id)
    
    Tada.findById(id,function(error,tad){
        console.log(tad)
        tad.sub.push({subn:ts1,subs:ts2})
        console.log(tad)        
        tad.save()
    })    
    res.redirect("/todo");
})


app.get("/new/:ido",function(req,res){
    console.log(req.params.ido)
    let idd = req.params.ido;
    console.log("id is :" +idd);
    res.render("addnew",{id:idd});   
})

app.post("/new",function(req,res){
    console.log("welpost")
    let nn = req.body.n;
    let idd = req.body.id;
    console.log(idd);
    res.redirect("/new/"+idd)
})

app.listen(3000, function(req,res){
    console.log("welcome to the Laboratory")
}) 