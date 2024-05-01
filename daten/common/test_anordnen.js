
// Müllkalender auslesen und verbleibende Tage auf Variablen schreiben
// _____


var a;
var b;

a = 1;
b = 2*a;



function Muellkalender()
{

const today = new Date(); 	
var varJSON = 'ical.0.data.table';
var obj = [], result_string = [], found = 0, counter;
var Muelltonnen = new Array();
var Date_gefunden = {
    "Biotonne":false,
    "Glas":false,
    "Gelbe Tonne":false,
    "Restmuelltonne":false,
    "Papiertonne":false
};



var rawJSON = getState(varJSON).val;
var Anzahl = rawJSON.length;
console.log("___Anzahl Elemente : " + Anzahl);  // Anzahl der Tabelleneinträge bestimmen

var heute = new Date();
var morgen = new Date(heute.getTime()+(1000 * 60 * 60 * 24 * 1)).toString(); 
var uebermorgen = new Date(heute.getTime()+(1000 * 60 * 60 * 24 * 2)).toString(); 

console.log("___ heute: " + formatDate(heute, "TT.MM"), 'info');
console.log("___ morgen: " + formatDate(morgen, "TT.MM"), 'info');
console.log("___ übermorgen: " + formatDate(uebermorgen, "TT.MM"), 'info');
//var str = today.toLocaleDateString('de-DE').toString();
//var field = str.split('.');
//console.log("___Today : " + field[0] + " Tag: " + field[1]);

//console.log("___Today : " + today.toLocaleDateString('de-DE') + " Tag: " + today.getDay() + "   Monat: " + heute.getMonth() + "   Jahr: " + heute.getFullYear());

counter = 0
for (var i = 0; i < Anzahl; ++ i)
{              // Tabelleneinträge auslesen
  obj[i] = JSON.parse(JSON.stringify(rawJSON[i]));
  console.log(obj[i].date.slice(0,5) + " - " + obj[i].event + i);
  found = 0; // wenn Wert doppelt dann nicht weiter zählen
  

  // suchen nach erstem Abholtermin für jeweilige MÜllart
  if (obj[i].event == "Biotonne " && !(Date_gefunden.Biotonne)) {
    Date_gefunden.Biotonne = true;
    result_string[counter] = "Braun";
    found = 1;
    Muelltonnen[counter] = new Object();
    Muelltonnen[counter]["Date"] = obj[i].date.slice(0,5);
    Muelltonnen[counter]["Tonne"] = "Braun";
    console.log("_____ ausgabe müelltonnen : " + Muelltonnen[counter].Date + " ____ : " + Muelltonnen[counter].Tonne);
    setState('0_userdata.0.Müllabfuhr.Biomüll', obj[i].date.slice(0,5));
    console.log("___xxxx : " + obj[i].date.slice(0,5) + " - " + obj[i].event + " - " + Date_gefunden.Biotonne);
  };
  if (obj[i].event == "Restmülltonne " && !(Date_gefunden.Restmuelltonne)) {
    Date_gefunden.Restmuelltonne = true;
    result_string[counter] = "Schwarz";
    found = 1;
    setState('0_userdata.0.Müllabfuhr.Restmuelltonne', obj[i].date.slice(0,5));
    console.log("___xxxx : " + obj[i].date.slice(0,5) + " - " + obj[i].event + " - " + Date_gefunden.Restmuelltonne);
  };
  if (obj[i].event == "Papiertonne " && !(Date_gefunden.Papiertonne)) {
    Date_gefunden.Papiertonne = true;
    result_string[counter] = "Grün";
    found = 1;
    setState('0_userdata.0.Müllabfuhr.Papiertonne', obj[i].date.slice(0,5));
    console.log("___xxxx : " + obj[i].date.slice(0,5) + " - " + obj[i].event + " - " + Date_gefunden.Papiertonne);
  };
 if (obj[i].event == "Glas " && !(Date_gefunden.Glas)) {
    Date_gefunden.Glas = true;
    result_string[counter] = "Blau";
    found = 1;
    setState('0_userdata.0.Müllabfuhr.Glas', obj[i].date.slice(0,5));
    console.log("___xxxx : " + obj[i].date.slice(0,5) + " - " + obj[i].event + " - " + Date_gefunden.Glas);
  };
   if (obj[i].event == "Gelbe Tonne " && !(Date_gefunden.Gelbe_Tonne)) {
    Date_gefunden.Gelbe_Tonne = true;
    result_string[counter] = "Gelb";
    found = 1;
    setState('0_userdata.0.Müllabfuhr.Gelbe_Tonne', obj[i].date.slice(0,5));
    console.log("___xxxx : " + obj[i].date.slice(0,5) + " - " + obj[i].event + " - " + Date_gefunden.Gelbe_Tonne);
  };
if(found == 1)
{counter = counter + 1}; 
};


for (var i = 0; i < 8; ++ i)
{
console.log("___ : " + i + "___ : " + result_string[i]);
};

}


//schedule('{"time":{"exactTime":true,"start":"03:00"},"period":{"days":1}}',Muellkalender)
//schedule('*/10 * * * * *', Muellkalender)


