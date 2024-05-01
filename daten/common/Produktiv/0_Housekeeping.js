
//schedule('*/10 * * * * *', Test_start_linux_scripts );
schedule('*/1 * * * *', Variable_anzeigen );
schedule('*/2 * * * *', Hauslicht_aus );   /* alle 2 min */
// wöchentlich Sonntags Speicherplatz freigeben
schedule('{"time":{"exactTime":true,"start":"00:00"},"period":{"weeks":1,"dows":"[0]"}}', Speicherplatz_freigeben );   /* jeden Tag */
// wöchentlich Sonntags kopieren
schedule('{"time":{"exactTime":true,"start":"00:00"},"period":{"weeks":1,"dows":"[0]"}}', Kopieren );   /* jeden Tag */

function Test_start_linux_scripts(){
    console.log("___ Linux scripte gestartet ? : " + '____bl');
    exec('ps aux | grep vcontrold', function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stdout: ' + error);
    });
}


function Variable_anzeigen(){
    console.log("___ IoBroker Festplatte: " + getState("linux-control.0.iobroker.df"));
}

function Speicherplatz_freigeben(){
console.log("___ Speicherplatz_freigeben");
 
//exec('find /opt/iobroker/backups -mtime +5 -exec /usr/bin/rm {} \;', function (error, stdout, stderr) {
//    console.log('stdout: ' + stdout);
//    console.log('stdout: ' + error);   
//});
//exec('find /home/axel_ftp/camera_eingang -mtime +20 -exec /usr/bin/rm {} \;');
//exec('rm -rf /var/log/journal/*', function (error, stdout, stderr) {
//    console.log('stdout: ' + stdout);
//    console.log('stdout: ' + error);
//    });

exec('/opt/iobroker_scripte_axel/housekeeping_speicherplatz');

console.log("____ Speicherplatz freigegeben");

}

function Kopieren(){

//exec('cp /opt/iobroker/backups/* /mnt/seagate_10tb/Sicherung/Haus/iobroker/backup/*');

exec('cp /opt/iobroker/backups/* /mnt/seagate_10tb/Sicherung/Haus/iobroker/backup', function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stdout: ' + error);
    });


console.log("____ Dateien kopiert");

}


//schedule({second: [00]}, Hauslicht_aus );
  
 function Hauslicht_aus() {
     console.log('____Housekeeping_Hauslicht');
 //  setState("hm-rpc.2.00085A499BF6D2.4.STATE", true); 
 
 if(getState('alias.0.Light.Hausflur_Light').val)
    {
    console.log('_____Hauslicht an :  ' + getState("alias.0.Light.Hausflur_Light").val);
    setState('alias.0.Light.Hausflur_Light'/*Hauslicht*/,false);   // wenn an, dann ausschalten
    }else{
    console.log('_____Hauslicht aus : ' + getState('alias.0.Light.Hausflur_Light').val);
    } 
 
 };
 
/*
schedule({second: [20]}, Dummy );     /* jede Minute 20 Sekunden */
/*
 function Dummy() {
     console.log('____Housekeeping_Dummy');
 
 
 }
*/

