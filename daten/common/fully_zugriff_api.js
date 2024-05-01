// Script: TelegramBild
// Script: Bild und Text per Telegram verschicken, wenn ein Sensor auslöst
// Script: 15.05.2016
// Autor: thomassch
// Grundidee: http://forum.iobroker.net/viewtopic.php?f=21&t=2609&p=24557&hilit=telegram#p24557
 
// IPCams: Instar 5907HD / 6012HD
 
var logging = true;
var Download = require('download');  // Modul Download muss in Javascript-Einstellungen vorhanden sein
var dest = '/tmp/';
var foto_url_Flur_EG   = 'http://10.0.11.52:2323/?cmd=getCamshot&password=kathleen'; // IP Webcam Snapshot Innen Flur
//var foto_urlGarage = "http://192.168.2.2/tmpfs/snap.jpg?usr=admin&pwd=instar"; // IP Webcam Snapshot Garage
//var foto_urlGarten = "http://192.168.2.3/tmpfs/snap.jpg?usr=admin&pwd=instar"; // IP Webcam Snapshot Kellertür
//var foto_urlWohn   = "http://192.168.2.4/tmpfs/snap.jpg?usr=admin&pwd=instar"; // IP Webcam Snapshot Wohnzimmer
var txtaction = "..."; // Telegram Text
 
if (logging) log("TelegramBild - Script start", "info");
 
// Funktion zum Versenden einer Meldung und Bild über Telegramm
// myObj   : Auslöseobjekt
// myText  : wird im Telegramm als Objekttext (Klartext) angezeigt
// txtTrue : wird bei auslösen = 1 im Telegram angezeigt
// txtFalse: wird bei auslösen = 0 im Telegram angezeigt (hier nicht verwendet)
// txtOrt  : Übergabe der WebCam Adresse
// txtBild : lokaler Name für das Bild dass dann versendet wird
 
// EInzelbild verschicken
function xaktionCam(myObj, myText, txtTrue, txtFalse, txtOrt, txtBild)
{
    if (logging) log("TelegramBild.xaktionCam - start", "info");
//    if (myObj.newState.val === true) {
        txtaction = txtTrue;
 
        // erst mal Text
        var myTel = myText + " " + txtaction;
        if (logging) log("TelegramBild.xaktionCam - state = 1: " + myTel, "info");
        setState("telegram.0.communicate.response", myTel);
 
        // dann Bild verschicken
console.log("__download  - url: " + txtOrt + "  Ablage: " + dest);
        new Download.get(txtOrt).dest(dest)
//        new Download({mode: '777'}).get(txtOrt).dest(dest).rename(txtBild+".jpg").run()
console.log("__");
        setTimeout(function(){
            sendTo('telegram.0', dest+txtBild+'.jpg');
            if (logging)  log("TelegramBild.xaktionCam - Bild versendet" + dest+txtBild+'.jpg', "info");
        }, 6000); // 6 sek warten bevor man das JPG verschickt
//    }
 
}
 
// Alle Cams aufnehmen und verschicken
function xaktionCamAlle(myObj, myText)
{
  if (logging) log("xaktionCamAlle - start", "info");
  //if (myObj.newState.val === true) {
 
      // erst mal Text
      var myTel = myText;
      if (logging) log("TelegramBild.xaktionCamAlle - state = 1: " + myTel, "info");
      setState("telegram.0.communicate.response", myTel);
 
      // dann Bild verschicken
      new Download({mode: '777'}).get(foto_url_Flur_EG).dest(dest).rename("BildAlarmFlur"+".jpg").run()
//      new Download({mode: '777'}).get(foto_urlGarage).dest(dest).rename("BildAlarmGarage"+".jpg").run()
//      new Download({mode: '777'}).get(foto_urlGarten).dest(dest).rename("BildAlarmGarten"+".jpg").run()
//      new Download({mode: '777'}).get(foto_urlWohn).dest(dest).rename("BildAlarmWohnzimmer"+".jpg").run()
 
      setTimeout(
        function()
        {
          sendTo('telegram.0', dest+"BildAlarmFlur_EG"+'.jpg');
//          sendTo('telegram.0', dest+"BildAlarmGarage"+'.jpg');
//          sendTo('telegram.0', dest+"BildAlarmGarten"+'.jpg');
//          sendTo('telegram.0', dest+"BildAlarmWohnzimmer"+'.jpg');
        }, 20000); // 20 sek warten bevor man das JPG verschickt
//  }
}
 
// Auslöser
on({id: "mqtt.0.fire_fully.SENSOR.$onMotion", change:"any"}, function(obj) { xaktionCam(obj, "Die Innentür wurde "       ,"geöffnet",""      , foto_url_Flur_EG  , "BildFlur_EG"); }); // Innentür
//on({id: "hm-rpc.0.MEQ0100446.1.MOTION",         val: true}, function(obj) { xaktionCam(obj, "Garten Bewegungsmelder "   ,"ausgelöst",""     , foto_urlGarten, "BildGarten"); }); // Garten
//on({id: "hm-rpc.0.MEQ0656769.1.PRESS_SHORT",    val: true}, function(obj) { xaktionCam(obj, "Klingelsensor "            ,"es klingelt",""   , foto_urlGarage, "BildKlingel"); }); // Klingelsensor
//on({id: "hm-rpc.0.MEQ0812040.1.STATE",          val: true}, function(obj) { xaktionCam(obj, "Garagentor "               ,"wird geöffnet","" , foto_urlGarage, "BildGaragentor"); }); // Garagentor
//on({id: "hm-rpc.0.MEQ1408344.1.STATE",          val: true}, function(obj) { xaktionCam(obj, "Waschraum Tür "            ,"wird geöffnet","" , foto_urlGarage, "BildWaschRaumTuer"); }); // Waschraumtüre
 
// AlarmEreignis
on({id: "hm-rega.0.3047",  change:"ne"},                    function(obj) { xaktionCamAlle(obj, "!!! xxxx Alarm","ausgelöst xxxx !!!"); });
on({id: "hm-rega.0.1790",  change:"ne"},                    function(obj) { xaktionCamAlle(obj, "!!! Voralarm","ausgelöst!!!"); });





// http://10.0.11.52:2323/?cmd=setStringSetting&key=screenBrightness&value=1&type=json&password=kathleen
// device_info  http://10.0.11.52:2323/?cmd=deviceInfo&type=json&password=kathleen
// remote admin page http://10.0.11.52:2323/?cmd=deviceInfo&password=kathleen&type=json:30000:JSONPATH($.batteryLevel)]
// cam shot - Fire HD 8 Zoll - http://10.0.11.52:2323/?cmd=getCamshot&password=kathleen
// cam shot - Fire HD 10 Zoll - Keller - http://10.0.11.50:2323/?cmd=getCamshot&password=kathleen




/*
var logging = true;
var Download  = require('download');
// var Download = require('download');
var dest = '/tmp/';
var foto_url0 = "http://10.0.11.52:2323/?cmd=getCamshot&password=kathleen";
new Download({mode: '777'}).get(foto_url0).dest(dest).rename("cam0.jpg").run();
//Download.get(foto_url0).dest(dest).rename("cam0.jpg").run();
/*
if (logging) log("TelegramBild - Script start", "info");

setTimeout(function(){ 
            sendTo('telegram.0', '/tmp/cam0.jpg'); 
}, 12000);

*/