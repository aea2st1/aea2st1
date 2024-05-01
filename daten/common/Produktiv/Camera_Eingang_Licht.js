/* Hauslicht durch Camera Bewegungserkennung einschalten */

on({id: 'javascript.0.Camera_Eingang_Trigger.triggered_licht', change: "any"}, function (obj) {
    
        console.log('___event_Hauslicht_Camera_Eingang - Tag true/false : ' + getState('javascript.0.variables.isDayTime').val);
        if(getState('javascript.0.variables.isDayTime').val)
        {
        console.log('___Tag - Licht bleibt aus ' + getState("javascript.0.variables.isDayTime").val);
        }else{
        console.log('___Nacht - Licht ein' + getState('javascript.0.variables.isDayTime').val);
        setState('hm-rpc.2.00259D899A7091.11.STATE'/*Hauslicht*/,true);
        wait(1000);
        setState('hm-rpc.2.00259D899A7091.11.STATE'/*Hauslicht*/,false);
    }
});

