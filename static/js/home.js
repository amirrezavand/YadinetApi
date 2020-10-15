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
    })
})