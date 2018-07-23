
var mime=require("mime")
var path=require("path")
var app=require("http").createServer(index)
var io=require("socket.io").listen(app);
var fs=require("fs");
var gettime=require("./model/time.js")
function index(req,res){
    var htmldata
    var url
        if (req.url=="/"){
            url="view/index.html";
            // htmldata=fs.readFileSync("view/index.html","utf8")//位置   编码格式
            // htmldata=fs.readFileSync(url,"utf8")//位置   编码格式
        }else{
            url="view"+req.url;
        }
        // htmldata=fs.readFile(url,"utf8")//位置   编码格式
        console.log(url)
        fs.readFile(url, function (err, data) {
            if (err) {
               res.writeHeader(404, {'content-type': 'text/html;charset="utf-8"'});
               res.write('<h1>404错误</h1><p>你要找的页面不存在</p>');
               res.end();
           } else {
               res.writeHeader(200, {'content-type': 'text/html;charset="utf-8"'});
               res.write(data);
               res.end();}
       });
        // fs.stat(url,function(err){
        //     if (err) {console.log(err)};
        //     fs.readFile(url,function(err,data){
        //         if (err) {console.log(err)};
        //         // res.setHeader("Content-Type","text/html");
        //         // res.setHeader("Content-Length",Buffer.byteLength(htmldata,"utf8"))
        //         // res.writeHead(200,{'Content-Type':mime.lookup(path.basename(data))});
        //         res.end(data)
        //     })
        // })
}
var numw=0;
var userinfo=[];
var screenx=400,screeny=280;//最大坐标值
function sendfile(zd){
    res.writeHead(
		200,{'Content-Type':mime.lookup(path.basename(filePath))}
	);
	res.end(fileContents);
}

io.sockets.on("connection",(socket)=>{
    
    var newuser=new createnewuser(socket.id);
    userinfo[socket.id]=newuser;
    console.log(userinfo[socket.id].name ,socket.id,)
    //首次登录时发送坐标逻辑
    var theothers=[];
    for(var index in userinfo){
        if (userinfo[index].id!=socket.id){
            var user_position= userinfo[index];//遍历userinfo
            theothers.push(user_position)
        }
    }
    socket.emit("firstlogin",{id:userinfo[socket.id].id,name:userinfo[socket.id].name,x:userinfo[socket.id].x,y:userinfo[socket.id].y,others:theothers});
    var sendtoother={id:userinfo[socket.id].id,name:userinfo[socket.id].name,x:userinfo[socket.id].x,y:userinfo[socket.id].y}
    socket.broadcast.emit("othersmove",sendtoother);//把本端的坐标发送给其他
    socket.join("我们一起玩")//加入房间
    socket.on("go",function(data){
            console.log(userinfo[socket.id].name +"移动到坐标",data.x)
            if (data.x>screenx||data.y>screeny){
                console.log('超出屏幕范围')
            }else{
                userinfo[socket.id].moving(socket,data.x,data.y);
            }
            
    })
    socket.on("disconnect",function(data){
        var sendtoother={id:userinfo[socket.id].id}
        socket.broadcast.emit("othersremove",sendtoother);//把本端的坐标发送给其他
        clearInterval(userinfo[socket.id].movingtime) 
        delete userinfo[socket.id]
        console.log("用户掉线："+userinfo.length)
        // console.log("用户掉线,在线用户："+userinfo.length)

    })

})

function getmove(socket){
    var zd=socket.id;
    if (userinfo[zd].nowgo===1){
        userinfo[zd].x+=userinfo[zd].sx
        userinfo[zd].y+=userinfo[zd].sy
            if (userinfo[zd].gotox==parseInt(userinfo[zd].x)){
                userinfo[zd].sx=0;
            }
            if(userinfo[zd].gotoy==parseInt(userinfo[zd].y)){
                userinfo[zd].sy=0;
            }
            if (userinfo[zd].gotox==parseInt(userinfo[zd].x)&&userinfo[zd].gotoy==parseInt(userinfo[zd].y)){
                userinfo[zd].nowgo==0;
                clearInterval(userinfo[zd].movingtime)
            }
    }
    var theothers=[];
    for(var index in userinfo){
        if (userinfo[index].id!=socket.id){
            var user_position= userinfo[index];//遍历userinfo
            theothers.push(user_position)
        }
    }
    var sendtoother={id:userinfo[zd].id,name:userinfo[zd].name,x:userinfo[zd].x,y:userinfo[zd].y}
    // console.log(theothers);
    socket.emit("myselfmove",{x:userinfo[zd].x,y:userinfo[zd].y});
    socket.broadcast.emit("othersmove",sendtoother);//把本端的坐标发送给其他
}
function createnewuser(id){
    var nowtime=new Date().getTime();
    this.id=id;
    this.name="guest"+ nowtime;
    this.x=210;
    this.y=140;
    this.fx=2;
    this.speed=0;
    this.nowgo=0;
    this.sx=0;
    this.sy=0;
    this.gotox=210;
    this.gotoy=140;
    this.flash=17;
    this.moving=function(socket,x,y){
        //走直线；
        // console.log(x)
        clearInterval(this.movingtime)
        this.gotox=x;
        this.gotoy=y;
        if (this.gotox!=parseInt(this.x)||this.gotoy!=parseInt(this.y)){
            // this.sx=(x-this.x)/this.flash;
            // this.sy=(y-this.y)/this.flash;
            var aa=Math.atan((y-this.y) /(x-this.x))
            var bb=Math.abs(Math.cos(aa))
            var cc=Math.abs(Math.sin(aa))
            this.nowgo=1;
            x>this.x?this.sx=1*bb:this.sx=-1*bb;
            y>this.y?this.sy=1*cc:this.sy=-1*cc;
            this.movingtime=setInterval(function(){
                getmove(socket);
            },this.flash)
           
        }else{
            this.nowgo=0;
            this.sx=0;
            this.sy=0;
        }
    };
}


function numadd(){
    numw ++;
    // console.log(numw)
    io.sockets.emit("nihao",numw);
}
setInterval(numadd,1000);
setInterval(function(){
var thistime =gettime.aa()//new Date()//.toUTCString();//toUTCString();
//  console.log(thistime)
 io.sockets.send(thistime)
},1000);
app.listen(1234)


