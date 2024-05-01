

on({id: '0_userdata.0.Camera_Eingang.triggered', change: "any"}, function (obj) {
   

    // telegram senden
    sendTo('telegram.0','/opt/iobroker_scripte_axel/send.mp4');
    console.log('____ Eingang Video gesendet');

});

/* .... bash file - inotify - wenn neue avi datei da ist und schreibt dies über curl zurück
#!/bin/bash
echo "___ Anfang"

folder=/var/www/axel_ftp/camera_eingang
datei="$(ls -t  $folder/*.avi | head -1)"

##datei="$(ls -t | head -1)"
date
echo $datei

inotifywait -m $folder -e create -e moved_to |
    while read path action file; 
    do
        echo "The file '$file' appeared in directory '$path' via '$action'"
        # do something with the file
        if [ "${file: -4}" == ".avi" ]
        then
                rm send.mp4
                echo "___$folder/$file\n"
                ffmpeg -i $folder/$file $PWD/send.mp4
                curl http://10.0.0.30:8087/toggle/0_userdata.0.Camera_Eingang.triggered
        fi
    done
    */