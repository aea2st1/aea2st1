var idTaste = 'alias.0.EG_Wohnzimmer_Motion';
//var idTaste = 'hm-rpc.1.0014DA499ED545.3.MOTION';
var tastendruck;

//on({id: 'mqtt.0.tablet_Heizungskeller.SENSOR.$onMotion', change: 'any'}, 
on({id:idTaste}, function (obj) {
    console.log("___Trigger");
    if (!tastendruck) {
        console.log("___Start");
        tastendruck = true;
        setTimeout(function () {
            tastendruck = undefined;
            console.log("___ in der setTimeout Schleife");
            // hier die Funktion rein die entprellt werden soll
        }, 5000);
        // Aktion
        console.log("___Zeitverzögerung");
    }
});
 
