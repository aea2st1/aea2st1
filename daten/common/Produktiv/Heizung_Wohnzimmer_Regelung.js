// Wohnzimmer - Änderung der Temperatur am Wandregler
on({id: 'hm-rpc.1.00265D899A9F8C.1.SET_POINT_TEMPERATURE', change: "any"}, function (obj) {

    console.log("___start_set_temperature_Wohnzimmer");
    console.log(getState('hm-rpc.1.00265D899A9F8C.1.SET_POINT_TEMPERATURE').val);
    var temperature_set =    getState('hm-rpc.1.00265D899A9F8C.1.SET_POINT_TEMPERATURE').val;
    setState('hm-rpc.0.MEQ1885344.4.SET_TEMPERATURE'/*Temperatur*/,temperature_set);

});


schedule('* * * * *', Jede_Minute);
// Wohnzimmer Regelung - Heizkörper
//schedule({second: [00]}, Jede_Minute );

 function Jede_Minute() {
   var temperature_set = getState('hm-rpc.1.00265D899A9F8C.1.SET_POINT_TEMPERATURE').val;
   var temperature_actual = getState('hm-rpc.1.00265D899A9F8C.1.ACTUAL_TEMPERATURE').val;
   var temp; /* Zwischenvariable */

   if (temperature_set > temperature_actual)
   {temp = temperature_set + 3}
   else
   {temp = temperature_set - 3}
   console.log('___Temperaturen: ' + 'Set: ' + temperature_set + ' Actual: ' + temperature_actual + 'Korrekturen: ' + temp);
   
    setState('hm-rpc.0.MEQ1885344.4.SET_TEMPERATURE'/*Temperatur*/,temp);
 }





