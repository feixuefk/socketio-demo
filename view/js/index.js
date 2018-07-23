var cand=document.getElementById("dda").getContext("2d");
var dda=document.getElementById("dda");
// 初始化画布大小
var candwidth=420;
var candheigth=280;
if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    console.log("移动端")
} else {
    console.log("PC端")
}
dda.width=420
dda.height=280


var mycand=new function(cand,width,height){
    this.cand=cand;
    this.width=width;
    this.height=height;
}(cand,candwidth,candheigth)
//io组件赋值
var socketio
var others=[];
var myself={};
var flash;
 var thisobj= new function(){
     this.open=false;
 }
//画布点击事件
// dda.ontouchstart= function(e){
//     console.log(e.targetTouches[0])
//     if(thisobj.open){
//         socketio.emit("go",{x:e.targetTouches[0].pageX ,y:e.targetTouches[0].pageY});
//     }
// }
dda.onclick=function(e){
    if(thisobj.open){
        socketio.emit("go",{x:e.offsetX,y:e.offsetY});
    }
}
function createone(x,y,color){
    this.width=5;
    this.height=10;
    this.longx=this.width/2;
    this.longy=this.height;
    this.x=x;
    this.y=y;
    this.lastx=0;
    this.lasty=0;
    this.color=color;
    this.cache=function(){
        this.lastx=this.x;
        this.lasty=this.y;
    }
    this.change=function(x,y){
        this.x=x;
        this.y=y;
        // draw_one(mycand,this)
    }
    
};
 function toconnect(){
    //  console.log(others[1234585])
    if (thisobj.open==false){
        socketio=io.connect();
        socketio.connect();
       
        socketio.on("message",(dd)=>{
            var h1=document.getElementById("time");
            h1.innerHTML=dd;
            drawtime(mycand,dd)
        })
        socketio.on("myselfmove",(req)=>{
            if(req){myself.change(req.x,req.y)};
            // console.log("服务器返回坐标",req)
        })
        socketio.on("firstlogin",(req)=>{
            
            if(req){
                myself=new createone(req.x,req.y,"red");
                myself.change(req.x,req.y)
                if(req.others.length>0){
                    var theothers=req.others;
                    for(var ii in theothers){
                        
                        if(others[theothers[ii].id]!=undefined){
                            others[theothers[ii].id].change(theothers[ii].x,theothers[ii].y)
                        }else{
                            others[theothers[ii].id]=new createone(theothers[ii].x,theothers[ii].y,"green"); //创建一个
                            // others[theothers[ii].id].change(theothers[ii].x,theothers[ii].y)
                        }
                    }
                }
            };
            // console.log("服务器返回坐标",req)
        })    
        socketio.on("othersremove",function(req){
            clear_one(mycand,others[req.id])
            delete others[req.id]
        })          
        socketio.on("othersmove",(req)=>{
            if(req){
                // console.log(req,);
                if(others[req.id]!=undefined){
                    others[req.id].change(req.x,req.y)
                }else{
                    others[req.id]=new createone(req.x,req.y,"green"); //创建一个
                    others[req.id].change(req.x,req.y)
                }
            }
            // console.log("服务器返回坐标",req)
        })
        socketio.on("nihao",function(req){
            var message=document.getElementById("message");
            message.innerHTML=req;
        })
        thisobj.open=true
        online()
        console.log("重新连接")
    }else{
        console.log("已经连接上，请勿重复操作")
    }
 }
 function todisconnect(){
    //  console.log(others)
     if (thisobj.open){
        thisobj.open=false
        clearInterval(flash);
     socketio.disconnect();
     console.log("断开连接")
     draw_clearall();
     }

 }
//画布逻辑

function online(){
flash=setInterval(function(){
    // mycand.cand.drawImage(img, 0, 0, 100, 200);
    for(var i in others){
        draw_one(mycand,others[i])
    }
    draw_one(mycand,myself)
},17)
}
function draw_one(cand,zd){
var can=cand.cand;
can.clearRect(zd.lastx-zd.longx-1,zd.lasty-zd.longy-1, zd.width+2,zd.height+2);
can.fillStyle=zd.color;
can.fillRect(zd.x-zd.longx,zd.y-zd.longy,zd.width,zd.height);
zd.cache();
}
function clear_one(cand,zd){
var can=cand.cand;
can.clearRect(zd.lastx-zd.longx-1,zd.lasty-zd.longy-1, zd.width+2,zd.height+2);
zd.cache();
}

function draw_clearall(){
mycand.cand.clearRect(0,0, mycand.width,mycand.height);
}
function drawtime(cand,zd){
cand.cand.clearRect(cand.width-150,0,150,14)
// cand.beginPath();
//设置字体样式
cand.cand.font = "14px Courier New";
cand.cand.fillStyle='#D04A11';	
cand.cand.fillText(zd,cand.width-150,14);
// console.log(cand)
// cand.closePath();
// cand.stroke();
}