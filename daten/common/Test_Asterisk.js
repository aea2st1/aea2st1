var number   = "**610";
var callerid = '1111'; // optional, if not set anonymous call
var msg      = "Bitte um Rückruf Axel Aue"; 
 
// call telephone nummber 040 666-7766 and play text message as audio
sendTo('asterisk.0', "dial", { telnr: number, callerid: callerid, text:  msg},  (res) => {
      console.log('Result: ' + JSON.stringify(res));
});  