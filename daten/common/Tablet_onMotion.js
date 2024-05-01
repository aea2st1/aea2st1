var old_time, actual_time;

// On change
//on({id: "javascript.0.myState1", change: 'ne'}, function (data) {
on({id: 'mqtt.0.tablet_Heizungskeller.SENSOR.$onMotion', change: 'any'}, function () {

var request = require('request');
var fs      = require('fs');
var dest_path = '/tmp/';
var fname_tablet = 'bild_tablet.jpg';
var foto_url0 = 'http://10.0.11.50:2323/?cmd=getCamshot&password=kathleen';


actual_time = Date.now();
//console.log("____ trigger actual_time " + actual_time + " old_time: " + old_time +" ____ Differenz events: " + (actual_time-old_time));
//old_time = actual_time;
if ((actual_time-old_time) > 10000){
    request.get({url: foto_url0, encoding: 'binary'}, function (err, response, body) {
        fs.writeFile(dest_path + fname_tablet, body, 'binary', function(err) {
            if (err) {
                log('Fehler beim Bild speichern: ' + err, 'warn');
            } else {
                console.log('___ file gespeichert');
                // dem Filesystem 2 Sek Zeit zum Speichern lassen
                setTimeout(function() { sendTo('telegram.0', dest_path + fname_tablet);}, 2000); 
            }
            }); 
        });
console.log("___ actual-old:" + actual_time);

}

old_time = actual_time;

});


// .... weitere Optionen - funktioneiert nicht so richtig .... bild wird nicht gesendet
//exec('wget -O /var/www/upload/cam_shot_tablet/bild1.jpg http://10.0.11.52:2323/?cmd=getCamshot&password=kathleen',
//    function (error, stdout, stderr) {
//        console.log('stdout: ' + stdout);
//        console.log('stderr: ' + stderr);
//        if (error !== null) {
//             console.log('exec error: ' + error);
//        }
//    }
//);

//sendTo('telegram.0', {text: '/home/axel_ftp/camera_eingang/bild1.jpg', caption: 'Jemand klingelt an der Haustür !!!'});
//sendTo('telegram.0', '/tmp/bild1.jpg');
//setTimeout(function(){ 
//            sendTo('telegram.0', '/tmp/bild.jpg'); 
// }, 6000);
//console.log("____ done");

