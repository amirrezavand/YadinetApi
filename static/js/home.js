$(document).ready(function(){
    var isAuth=false;
    $("#login").click(function(){
        // console.log({ username : $("#username").val() , password : $("#password").val() });
        $.post( "/login" , { username : $("#username").val() , password : $("#password").val() },function(data){
            console.log(data);
        })
    })
    $("#signUp").click(function(){
        // console.log({ username : $("#username").val() , password : $("#password").val() });
        $.post( "/signup" , { username : $("#signUpUser").val() , password : $("#signUpPass").val() },function(data){
            console.log(data);
        })
    })
    $.post("/getInfo",function(data){
        console.log(JSON.stringify(data));
        if(data.auth){
            console.log("شما وارد شدید!"+data.auth["username"]);
            isAuth=true;
        }
    })
    $("#submitComment").click(function(){
        if(isAuth){
            $.post("/submitComment",{msg:$("#msg").val()},function(data){
                console.log(data);
                getComment();
            });
        }
        else{
            alert("to ke sabt nam nakardi!!");
        }
    });
    var getComment=function(){
        $.post("/getComments",{},function(data){
            for(var attr in data){
                 $("# commentBox").append("<p>"+attr+"mige:"+data[attr].toString()+"</p>");
            }
        });
    }
    $("#logout").click(function(){
        $.post("/logout",function(data){
            console.log(data);
        })
    });
    $("#createCourse").click(function(){
        $.post("/courseRegister",{sequnce : "1" , title : "دوره تستی 1" , description : "این یک متن آزمایشی می‌باشد" , 
                                courseImage : "لینک عکس دوره"  , courseTime: "24:00" , teacher : "امیر حمیدی" ,
                                keyword: "دوره تستی،تست دوره،آموزش دوره" , price : "25000" , salePercent : "0" ,
                                studentNumber : "124" , courseLevel : "مقدماتی تا پیشرفته" , courseStatus : "در حال ضبط",
                                lastEdite : "1398/2/4" , shortLink : " " , seeNumber : "0"  },function(data){
            console.log(data);
        })
    })
// courseID : String,
// sequnce : String,
// title : String,
// lessonTime : String,
// price : String,
// downloadLink : String,
// description : String
    $("#createLesson").click(function(){
        $.post("/lessonRegister",{courseID : "5s45d5s4d5sdgf" , sequnce : "1" , title : "رقومی سازی GIS" , lessonTime : "5:25" ,
                                price : "1000" , downloadLink : "لینک دانلود در اینجا قرار داده شود" , description : "در این دوره رقومی سازی به صورت کامل شرح داده شده است."},function(data){
            console.log(data);
        })
    })
})