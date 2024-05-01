//test funktionen

test();




async function test(){

console.log("___start");

var today = new Date();
var h = today.getHours();
var m = today.getMinutes();
var s = today.getSeconds();
 
var t_old = "19:53:00"; 
var t = h + ":" + m + ":" + s;

var now = new Date();
await sleep(3000);
var now_plus = new Date();


console.log(now.getTime());
console.log(now_plus.getTime());

};
