
module.exports.aa=function(){
    var date=new Date();
    return date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+" "+date.getHours()+":"+doublenum(date.getMinutes())+":"+doublenum(date.getSeconds())
}
function doublenum(a){
    return ("0"+a).substr(("0"+a).length-2,2)
}