var cronMin           = "* * * * *";
var cronH           = "0 * * * *";
var cronD           = "59 23 * * *";
var cronW           = "0 0 * * 1";
var cronM           = "0 0 1 * *";
var idHAGTotMin       = "0_userdata.0.Gaszähler.tmp.Total-min";
var idHAGTotH       = "0_userdata.0.Gaszähler.tmp.Total-h";
var idHAGTotD       = "0_userdata.0.Gaszähler.tmp.Total-d";
var idHAGTotW       = "0_userdata.0.Gaszähler.tmp.Total-w";
var idHAGTotM       = "0_userdata.0.Gaszähler.tmp.Total-m";
var idHAGTotal      = "sonoff.0.Tasmota_Gas.SENSOR.COUNTER.C1";               /*Stromverbrauch insgesammt*/
var idHAGZielMin      = "0_userdata.0.Gaszähler.Minute";
var idHAGZielH      = "0_userdata.0.Gaszähler.Stunde";
var idHAGZielD      = "0_userdata.0.Gaszähler.Tag";
var idHAGZielW      = "0_userdata.0.Gaszähler.Woche";
var idHAGZielM      = "0_userdata.0.Gaszähler.Monat";
var debug           = true;
var DPArray         = [idHAGTotMin, idHAGTotH, idHAGTotD , idHAGTotW, idHAGTotM, idHAGZielMin, idHAGZielH, idHAGZielD, idHAGZielW, idHAGZielM];
var DPUnit          = "m3";
DPArray.forEach(function(wert, index, array) {
    var DPType = wert.split(".");
    var DPDescr = "Gas Verbrauch " + (DPType[DPType.length - 1]);
 
    if(index > 3) DPUnit = "m3";
    createState(wert, 0, {
        name: DPDescr,
        desc: DPDescr,
        type: 'number',
        unit: DPUnit,
        role: 'value'
    });
});
function haupt (VorId, ZielId) {
    var nVorwert = getState(VorId).val;
    var nAktuell = getState(idHAGTotal).val / 100;
    var nDiff = nAktuell - nVorwert ;
    setState(ZielId, nDiff, true);
    if(debug) log("Gas - Aus: " + nAktuell +" - "+ nVorwert + " = " + nDiff);
    var shandler = on ({id: ZielId, change: 'any'}, function(data) {
        setState(VorId, (nAktuell), true);
        unsubscribe(shandler); 
    });
}
// regelmässige Wiederholungen
// -----------------------------------------------------------------------------
schedule(cronMin, function () {
    haupt(idHAGTotMin, idHAGZielMin);
});
schedule(cronH, function () {
    haupt(idHAGTotH, idHAGZielH);
});
schedule(cronD, function () {
    haupt(idHAGTotD, idHAGZielD);
});
schedule(cronW, function () {
    haupt(idHAGTotW, idHAGZielW);
});
schedule(cronM, function () {
    haupt(idHAGTotM, idHAGZielM);
});