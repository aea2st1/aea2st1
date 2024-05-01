schedule('*/15 * * * *',Old_data_delete)

// nur 2 Tage Journal aufheben ..... sonst einige GB groß ....journalctl --vacuum-time=2d
// /home/axel/axel_ftp .... alte Dateien löschen
// Punkte oben integrieren


function Old_data_delete(){
    // pwd
    // console.log('___ whoami');
    exec('/usr/bin/whoami' , function (error, stdout, stderr) {
    console.log('\n whoami: ' + stdout);
 //   console.log('sterr_rm: ' + stderr);
 //   console.log('error_rm: ' + error);
    });

    	
exec('/opt/iobroker_scripte_axel/exec_df', function (error, stdout, stderr) { 
    setState('0_userdata.0.System.disk_usage',stdout); 
    console.log('___Ausgabe : ' + getState('0_userdata.0.System.disk_usage').val);
    console.log(stderr);
    });


    // Videos Eingang löschen
    exec('sudo find /home/axel_ftp/camera_eingang/*.avi -mtime +3 -delete' , function (error, stdout, stderr) {
//    exec('sudo rm /home/axel_ftp/camera_eingang/*.avi' , function (error, stdout, stderr) {
    console.log('stdout_rm: ' + stdout);
    console.log('sterr_rm: ' + stderr);
    console.log('error_rm: ' + error);
    });
    // Bilder Camera Eingang löschen
    //exec('find /home/axel_ftp/camera_eingang/*.jpg -mtime +30 -delete' , function (error, stdout, stderr) {
    //console.log('stdout_rm: ' + stdout);
    //console.log('sterr_rm: ' + stderr);
    //console.log('error_rm: ' + error);
    //});
    //  backup iobroker löschen
    exec('find /opt/iobroker/backups/* -mtime +2 -delete' , function (error, stdout, stderr) {
    console.log('stdout_rm: ' + stdout);
//    console.log('sterr_rm: ' + stderr);
//    console.log('error_rm: ' + error);
    });
//    exec('ls /home/axel_ftp/camera_eingang/*' , function (error, stdout, stderr) {
//    console.log('stdout_ls: ' + stdout);
//    });

//    exec('pwd' , function (error, stdout, stderr) {
//    console.log('stdout_pwd: ' + stdout);
//    });
    
//    console.log("___ IoBroker Festplatte: " + getState("linux-control.0.iobroker.df"));
}
