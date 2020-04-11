const express = require("express");
let app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/test", {useNewUrlParser:true});

let tadatable = new mongoose.Schema({
    name:String,
    sub:{
        subn:String,
        subs:String
    }

})  
let Tada = mongoose.model("Tada",tadatable);  
    
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
    res.render("home1",{sub:Tada.sub});
})

app.get("/ricefield",function(req,res){
    Tada.find({},function(error,ta){
        let tn = ta
        let ts = ta.sub
        res.render("zone1",{tada:ta,sub:ts})
    })
    
})
app.post("/ricefield",function(req,res){
    
    let tn = req.body.n
    let ts1 = req.body.s1
    let ts2 = req.body.s2
    console.log(tn)
    let temp = {name:tn ,sub:{subn:ts1,subs:ts2}};
    Tada.create(temp,function(error,ttt){
        if(error){
            console.log(error)
        }
        else{
            console.log(ttt)
        }
    })
    res.redirect("/ricefield");
})

app.get("/new",function(req,res){
     
    console.log("welnew");
    res.render("addnew");
})

app.post("/new",function(req,res){
    console.log("welpost")
    let nn = req.body.n;
    console.log(nn)
    res.redirect("/new")
})

app.listen(3000, function(req,res){
    console.log("welcome to the Laboratory")
}) 