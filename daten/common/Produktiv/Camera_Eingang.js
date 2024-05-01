
//console.log(getState('mqtt.0.instar.instar-cam.status.alarm.triggered').val);

//console.log("___start");

on({id: 'mqtt.0.instar.instar-cam.status.alarm.triggered', change: "any"}, function (obj) {


    console.log(getState('mqtt.0.instar.instar-cam.status.alarm.triggered').val);
    if (getState('mqtt.0.instar.instar-cam.status.alarm.triggered').val == '{"val":"7"}')
        console.log("___getriggert");
        //sendTo('telegram.0', 'Camera_Eingang: 👵 ' );

        console.log('___event_Hauslicht_Camera_Eingang ' + getState('javascript.0.variables.isDayTime').val);
        if(getState('javascript.0.variables.isDayTime').val)
        {
        console.log('___Tag - Licht bleibt aus ' + getState("javascript.0.variables.isDayTime").val);
        }else{
        console.log('___Nacht - Licht ein' + getState('javascript.0.variables.isDayTime').val);
        setState('shelly.0.SHEM-3#C45BBE6AF905#1.Relay0.Switch'/*Hauslicht*/,true);
        wait(1000);
        setState('shelly.0.SHEM-3#C45BBE6AF905#1.Relay0.Switch'/*Hauslicht*/,false);
    }


    // prüfen wie lange die letzte Bewegung her ist - nicht weniger als 2 min ... evt. wait nach senden wäre aber unsauber
    // telegram senden



});