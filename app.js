var app=require("http").createServer(handler);
var socketio=require("socket.io").listen(app);
var fs=require("fs");
var html=fs.readFileSync("view/index.html","utf8");

function handler(req,res){
    // res.setHeader("Content-Type","text/html");
    // res.setHeader("Content-Length",Buffer.byteLength(html,"utf8"));
    res.end(html);
}

function tick(){
    var now =new Date().toUTCString();
    socketio.sockets.send(now);
    console.log(now)
}

setInterval(tick,1000);
app.listen(2333,function(){
    console.log("listen to port 8080")
})