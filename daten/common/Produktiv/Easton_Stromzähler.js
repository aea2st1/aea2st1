var cronMin         = "0 * * * * *";
var cronH           = "0 * * * *";
var cronD           = "59 23 * * *";
var cronW           = "0 0 * * 1";
var cronM           = "0 0 1 * *";

var idHAGTotMin     = "0_userdata.0.Stromzähler.tmp.Total-min";
var idHAGTotH       = "0_userdata.0.Stromzähler.tmp.Total-h";
var idHAGTotD       = "0_userdata.0.Stromzähler.tmp.Total-d";
var idHAGTotW       = "0_userdata.0.Stromzähler.tmp.Total-w";
var idHAGTotM       = "0_userdata.0.Stromzähler.tmp.Total-m";
var idHAGTotal      = "modbus.0.inputRegisters.30073_Total_Import_Power";               /*Stromverbrauch insgesammt*/
var idHAGActual     = "modbus.0.inputRegisters.30053_Total_Power";               /*Leistung aktuell */
var idHAGZielMin    = "0_userdata.0.Stromzähler.Minute";
var idHAGZielH      = "0_userdata.0.Stromzähler.Hour";
var idHAGZielD      = "0_userdata.0.Stromzähler.Day";
var idHAGZielW      = "0_userdata.0.Stromzähler.Week";
var idHAGZielM      = "0_userdata.0.Stromzähler.Month";
var debug           = true;
var DPArray         = [idHAGTotMin, idHAGTotH, idHAGTotD , idHAGTotW, idHAGTotM, idHAGZielH, idHAGZielD, idHAGZielW, idHAGZielM];
var DPUnit          = "kWh";
DPArray.forEach(function(wert, index, array) {
    var DPType = wert.split(".");
    var DPDescr = "Power consumption of " + (DPType[DPType.length - 1]);
 
    if(index > 3) DPUnit = "Wh";
    createState(wert, 0, {
        name: DPDescr,
        desc: DPDescr,
        type: 'number',
        unit: DPUnit,
        role: 'value'
    });
});

function min () {

var value = getState(idHAGActual).val;
    if(debug) log("Min: " + value);
    setState(idHAGZielMin, value, true);

}


function haupt (VorId, ZielId) {
    var nVorwert = getState(VorId).val;
    var nAktuell = getState(idHAGTotal).val;
    var nDiff = ((nAktuell * 10) - (nVorwert * 10)) * 100;
    setState(ZielId, nDiff, true);
    if(debug) log("Aus: " + nAktuell +" - "+ nVorwert + " = " + nDiff);
    var shandler = on ({id: ZielId, change: 'any'}, function(data) {
        setState(VorId, (nAktuell*10)/10, true);
        unsubscribe(shandler); 
    });
}
// regelmässige Wiederholungen
// -----------------------------------------------------------------------------
schedule(cronMin, function (){
    min();
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