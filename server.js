 //jwt.io

var express=require("express");
var bodyParser=require("body-parser");
var app=express();
var moragan=require("morgan");
var session=require("express-session");
var mongoose=require("mongoose");

mongoose.connect("mongodb://localhost/yadinetDB");
var db=mongoose.connection;

db.on('error',function(){
    console.log("***** database *****");
    console.log("mongoDB NOT Connected");
});
db.once("connected",function(){
    console.log("***** database *****");
    console.log("mogoDB Connected!");
})

var userSchema=new mongoose.Schema({
    email: String ,
    username : String,
    password : String,
    mobileNumber : String
});
var userModel=mongoose.model("User",userSchema)
// var amir=new humanModel({
//     name:"amir1", 
//     age:20,
//     username:"amirreza"
// });
// console.log(amir);
// console.log(amir.username);
// amir.save(function(err,data){
//     if(err) console.log(err);
//     else console.log(amir);
//     //findOne---> for first search result
//     humanModel.find({username:"amirreza"},function(err,data){
//         if(err) throw err;
//         else console.log("find:",data);
//     })
// });







const morgan = require("morgan");
  
app.use(session({
    secret:"secrete",
    resave:false,
    saveUninitialized:true
}))
app.use(morgan("common"));
app.use(express.static(__dirname+"/static"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
var users={
    admin:"admin123" ,
    amir:"amirreza90060",
    user:"reallyUser"
};
var comments={
    "amir":["slam","khobi"],
    "user":["hi"]
}


app.get("/",function(req,resp,next){
    console.log(req.session);
    resp.sendFile(__dirname+"/static/home.html");
});
app.get("/login",function(req,resp,next){
    resp.sendFile(__dirname+"/static/login.html")
});
app.post("/",function(req,resp,next){
    console.log("post");
})
app.post("/getInfo",function(req,resp,next){
    resp.json(req.session);
})
app.post("/login",function(req,resp,next){
    for(user in users){
        if(req.body['username']==user){
            if(req.body['password']==users[user]){
                req.session.auth={username:req.body["username"]};
                resp.json({status:"true",msg:"login shodi!"});
                console.log(req.session);
                return;
            }else{
                resp.json({status:"false",msg:"password qualat"});
                return;
            }
        }
    }
    resp.json({status:"false",msg:"user yaft nasho"});

});
app.post("/logout",function(req,resp,next){
    // req.session.auth={};
    delete req.session.auth;
    resp.json({status: true, msg:"logout shodi"});
})
app.use(function(req,resp,next){
    resp.header("Access-Control-Allow-Origin","*");
    resp.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
});
app.post("/signup",function(req,resp,next){
    var formData=req.body;
    resp.setHeader('Content-Type', 'application/json');
    if(formData.username.length&&formData.password.length>4){
        userModel.find({username:formData.username},function(err,user){
            if(err) console.log(err);
            else if(user.length){
                resp.json({status:false,msg:"کاربری با این نام کاربری وجود دارد!"})
            }
            else{
                var newUser= new userModel({
                    email:formData.email||" ",
                    password:formData.password,
                    username:formData.username,
                    mobileNumber:formData.mobileNumber||" "
                })
                newUser.save();
                console.log(newUser);
                resp.json({ status:true , msg:"کاربر با موفقیت ساخته شد!" });
            }
        })
    }
    else{
        resp.json({status : false , msg : "نام کاربری یا پسورد ندارد!"});
    }

    // email: String ,
    // username : String,
    // password : String,
    // mobileNumber : String






    // if(req.body.username.length&&req.body.password.length>=4){
    //     users[req.body.username]=req.body.password;
    //     resp.json({status:true,msg:"sabtnam shodi ba passworde"+users[req.body.username]});
    //     console.log(users);
    // }else{
    //     resp.json({status:false,msg:"amaliate sabtnam anjam nashod!"});
    // }
})

app.post("/submitComment",function(req,resp,next){
    if(req.session.auth.username!=undefined){
        if(comments[req.session.auth.username]!=undefined){
            comments[req.session.auth.username].push(req.body.msg);
        }
        else{
            comments[req.session.auth.username]=[req.body.msg];
        }
        console.log(comments);
        resp.json({status:true,msg:"comment zakhire shod"});
    }
    else{
        resp.json({status:false,msg:"to ke login nabodi!"});
    }
})

app.post("/getComments",function(req,resp,next){
    resp.json(comments);
})



app.listen(80);
console.log("app running on port 8000");


