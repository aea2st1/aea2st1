schedule('*/30 * * * * *', debug_item)

var string = 'open';
var wert = '';
var Energie_heute_OG = '';

function debug_item(){
// hier die zu debuggende Funktion rein
console.log('_____Start Tages Info Telegram');
// Strom Wohnung Obergeschoss
sendTo('influxdb.0', 'query', 'SELECT * FROM "javascript.0.ShellyVerbrauch.SHEM-3#244CAB435D22#1.Emeter0.heute" group by * order by desc limit 1 ', function (result) {
    if (result.error) {
        console.error(result.error);
    } else {
        console.log('____hier noch o.k. :' + JSON.stringify(result.result[0]));
        wert = JSON.stringify(result.result[0]);
        console.log('____hier noch o.k. :' + wert);
        wert = wert.replace('[',"").replace(']',"");
        //console.log(wert);
        Energie_heute_OG = JSON.parse(wert);
        console.log('Energie_heute_OG ___ : ' + Energie_heute_OG.value);       
//sendTo('telegram.0', 'Solar Stunden: ' + obj.value); 
}});

};
