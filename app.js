const express = require("express");
let app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://chanon:132231@cluster0-broqy.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser:true});

let tadatable = new mongoose.Schema({
    name:String,
    sub:[
        {subn:String,subs:String}

    ]
})  
let Tada = mongoose.model("Tada",tadatable);

let usertable = new mongoose.Schema({
    username:String,
    password:String,
    card:[],
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
        if(result.username!=null){
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

    let tp = req.body.password
 
    User.find({username:tu},function(err,u){
        
        if(tp==u[0].password){
           
            res.redirect("/todo/"+u[0]._id)
        }
        else{
            res.redirect("/login")
        }
    }).limit(1)
    
})


app.get("/todo/:id",function(req,res){
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
            
                    res.render("zone1",{tada:ta,id:req.params.id})
                }
                
        })
        }
        
    })
    
    
})
app.post("/todo/:uid",function(req,res){
    
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
    res.redirect("/todo/"+req.params.uid);
})


app.get("/new/:uid/:cid",function(req,res){
    console.log("dic "+req.params.cid);
    let tcid = req.params.cid;
    let tuid = req.params.uid;
    console.log("id is :" +tcid);
    res.render("addnew",{cid:tcid,uid:tuid});   
})

app.post("/new/:uid",function(req,res){
    console.log("welpost")
    let nn = req.body.n;
    let cid = req.body.id;
    console.log(cid);
    res.redirect("/new/"+req.params.uid+"/"+cid)
})
 app.post("/newcard",function(req,res){
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
 
 app.post("/del/:uid/:cid/:tid",function(req,res){
     let ttid = req.params.tid;
     let tcid = req.params.cid;
     let tuid = req.params.uid;
     
    Tada.findOneAndUpdate({"sub._id":ttid},{$pull:{"sub":{_id:ttid}}},{"sub.$":1},function(err,task){
            console.log(task.sub)       
    })    
    
   
     res.redirect("/todo/"+tuid)
 })


app.listen(3000, function(req,res){
    console.log("welcome to the Laboratory")
}) 