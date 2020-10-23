 //jwt.io

var express=require("express");
var bodyParser=require("body-parser");
var app=express();
var moragan=require("morgan");
var session=require("express-session");
var mongoose=require("mongoose");
var jwt = require("jsonwebtoken");

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
    mobileNumber : String,
    isAdmin : Boolean
});
var userModel=mongoose.model("User",userSchema);

var courseSchema=new mongoose.Schema({
    sequnce : String,
    title : String,
    description : String,
    courseImage : String,
    courseTime : String,
    teacher : String,
    keyword : String,
    price : String,
    salePercent : String,
    studentNumber : String,
    courseLevel : String,
    courseStatus : String,
    lastEdite : String,
    shortLink : String,
    seeNumber : String
})
var courseModel=mongoose.model("Course",courseSchema)
var lessonSchema=new mongoose.Schema({
    courseID : String,
    sequnce : String,
    title : String,
    lessonTime : String,
    price : String,
    downloadLink : String,
    description : String
})
var lessonModel=mongoose.model("Lesson",lessonSchema)





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

app.post("/logout",function(req,resp,next){
    // req.session.auth={};
    delete req.session.auth;
    resp.json({status: true, msg:"logout shodi"});
})
app.use(function(req,resp,next){
    resp.header("Access-Control-Allow-Origin","*");
    resp.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.post("/login",function(req,resp,next){
    console.log("login");
	// console.log(req.session);
    if(req.session.auth!=undefined){
        resp.json({status:false ,msg:"کاربر مورد نظر قبلا لاگین می‌باشد."});
    }
    else{
        userModel.find({email:req.body.email},function(err,user){
            if(err) console.log(err);
            else if(user.length>0){
                console.log(user[0].password);
                console.log(req.body.password);
                if(user[0].password==req.body.password){
                    // req.session.auth={username:user[0].username};
                    const token = jwt.sign(
                        {
                            user: {
                                email: user[0].email ,
                                username : user[0].username,
                                password : user[0].password,
                                mobileNumber : user[0].mobileNumber,
                                isAdmin : user[0].isAdmin
                            }
                        },
                        "secret",
                        {
                            expiresIn: "240h"
                        }
                    );
                    resp.json(token);
                    resp.json({status:"true",msg:"ورود موفقیت آمیز بود.",token:token});
                    console.log(req.session);
                }
                else{
                    resp.json({status:"false",msg:"پسورد وارد شده اشتباه می‌باشد"})
                }
            }
            else{
                resp.json({status:"false",msg:"نام کاربری مورد نظر وجود ندارد."})
            }
        });
    }
})
app.post("/signup",function(req,resp,next){
    var formData=req.body;
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
                    mobileNumber:formData.mobileNumber||" ",
                    isAdmin : false
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
})

// sequnce : String,
// title : String,
// description : String,
// courseImage : String,
// courseTime : String,
// teacher : String,
// keyword : String,
// price : String,
// salePercent : String,
// studentNumber : String,
// courseLevel : String,
// courseStatus : String,
// lastEdite : String,
// shortLink : String,
// seeNumber : String
app.post("/courseRegister",function(req,resp,next){
    var formData=req.body;
    if(formData.title.length){
        courseModel.find({title:formData.title},function(err,course){
            if(err) console.log(err);
            else if(course.length){
                resp.json({status:false,msg:"دوره‌ای با عنوان مشابه موجود می‌باشد."})
            }
            else{
                var newCourse= new courseModel({
                    sequnce : formData.sequnce||" ",
                    title : formData.title,
                    description : formData.description||" ",
                    courseImage : formData.courseImage||" ",
                    courseTime : formData.courseTime||" ",
                    teacher : formData.teacher||" ",
                    keyword : formData.keyword||" ",
                    price : formData.price||" ",
                    salePercent : formData.salePercent||" ",
                    studentNumber : formData.studentNumber||" ",
                    courseLevel : formData.courseLevel||" ",
                    courseStatus : formData.courseStatus||" ",
                    lastEdite : formData.lastEdite||" ",
                    shortLink : formData.shortLink||" ",
                    seeNumber : formData.seeNumber||" "
                })
                newCourse.save();
                console.log(newCourse);
                resp.json({ status:true , msg:"دوره با موفقیت ثبت یا ویرایش گردید" });
            }
        })
    }
    else{
        resp.json({status : false , msg : "عنوان دوره باید دارای مقدار باشد."});
    }
})
// courseID : String,
// sequnce : String,
// title : String,
// lessonTime : String,
// price : String,
// downloadLink : String,
// description : String
app.post("/lessonRegister",function(req,resp,next){
    var formData=req.body;
    if(formData.title.length){    
            var newLesson= new lessonModel({
                courseID : formData.courseID||" ",
                sequnce : formData.sequnce||" ",
                title : formData.title,
                lessonTime : formData.lessonTime||" ",
                price : formData.price||" ",
                downloadLink : formData.downloadLink||" ",
                description : formData.description||" "
            })
            newLesson.save();
            console.log(newLesson);
            resp.json({ status:true , msg:"درس با موفقیت ثبت یا ویرایش گردید" });
    }
    else{
        resp.json({status : false , msg : "عنوان درس باید دارای مقدار باشد."});
    }
})
app.post("/usersGet",function(req,resp,next){
    var formData=req.body;
    // if(formData.start>0&&formData.end>formData.first){

    // }
    var get=[{email:"ar.rezavand@gmail.com",username:"ar.rezavand",mobileNumber:"09189096128"},
            ]
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



app.listen(8000);
console.log("app running on port 8000");


