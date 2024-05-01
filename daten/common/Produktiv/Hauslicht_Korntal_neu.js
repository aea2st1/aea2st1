// Funktion Hauslicht bei Auslösen der Bewegungsmelder einschalten
// Aue 25.3.2021
//----------------------------------------------------------------------
const Debug = true;
var id1 = 'alias.0.Motion_Detector.EG_Hausflur_Motion';
var id2 = 'alias.0.Motion_Detector.OG_Hausflur_Motion';
var id3 = 'alias.0.Motion_Detector.DG_Hausflur_Motion';
var id4 = 'alias.0.Motion_Detector.UG_Hausflur_Motion';

function onChange()
{

if (Debug){
    console.log('___Trigger Motion_EG : ' + getState('alias.0.Motion_Detector.EG_Hausflur_Motion').val
    + '\n' + '___Trigger Motion_OG : '    + getState('alias.0.Motion_Detector.OG_Hausflur_Motion').val
    + '\n' + '___Trigger Motion_DG : '    + getState('alias.0.Motion_Detector.DG_Hausflur_Motion').val
    + '\n' + '___Trigger Motion_UG : '    + getState('alias.0.Motion_Detector.UG_Hausflur_Motion').val
    )
}
    console.log('___event_Hauslicht ' + getState('javascript.0.variables.isDayTime').val);
    if(getState('javascript.0.variables.isDayTime').val)
    {
     console.log('___Tag - Licht bleibt aus ' + getState("javascript.0.variables.isDayTime").val);
    }else{
    console.log('___Nacht - Licht ein' + getState('javascript.0.variables.isDayTime').val);
    setState('alias.0.Light.Hausflur_Light'/*Hauslicht*/,true);
    wait(1000);
    setState('alias.0.Light.Hausflur_Light'/*Hauslicht*/,false);
    } 
};

on(id1, onChange); 
on(id2, onChange); 
on(id3, onChange); 
//on(id4, onChange); 
