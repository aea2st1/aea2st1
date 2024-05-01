// Funktion Hauslicht bei Auslösen der Bewegungsmelder einschalten
// Aue 25.3.2021
//----------------------------------------------------------------------
const Debug = true;

on({id:
//'fhem.0.Motion_EG_Flur.state' || 'fhem.0.Motion_OG_Flur.state' ||
//'fhem.0.Motion_UG_Flur.state' || 'fhem.1.Motion_DG_Flur.state'   ||
//'hm-rpc.2.00319D89993DA5.3.MOTION'||
'alias.0.Motion_Detector.EG_Hausflur_Motion' || 'alias.0.Motion_Detector.OG_Hausflur_Motion' || 
'alias.0.Motion_Detector.DG_Hausflur_Motion' || 'alias.0.Motion_Detector.UG_Hausflur_Motion'
, change: 'gt'
}, function()
{

if (Debug){
    console.log('___Trigger Motion_EG : ' + getState('alias.0.Motion_Detector.EG_Hausflur_Motion').val
    + '\n' + '___Trigger Motion_OG : '    + getState('alias.0.Motion_Detector.OG_Hausflur_Motion').val
    + '\n' + '___Trigger Motion_DG : '    + getState('alias.0.Motion_Detector.DG_Hausflur_Motion').val
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
});