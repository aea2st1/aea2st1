
// Müllkalender auslesen und verbleibende Tage auf Variablen schreiben

function Muellkalender()
{

const today = new Date(); 	
var varJSON = 'ical.0.data.table';
var obj = [];
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

for (var i = 0; i < Anzahl; ++ i)
{              // Tabelleneinträge auslesen
  obj[i] = JSON.parse(JSON.stringify(rawJSON[i]));
//  console.log('___Loop: ' + obj[i].event + '___ date: ' + obj[i].date.slice(0,5));
 // console.log(obj[i].date.slice(0,5) + " - " + obj[i].event + i);

  // suchen nach erstem Abholtermin für jeweilige MÜllart
  wait(1000); // ohne die wait werden manche Pfade nicht ausgeführt obwohl Eingangsdaten korrekt sind
  if (obj[i].event == "Biotonne " && !(Date_gefunden.Biotonne)) {
    Date_gefunden.Biotonne = true;
    setState('0_userdata.0.Müllabfuhr.Biotonne', obj[i].date.slice(0,5));
    console.log("___Biotonne : " + obj[i].date.slice(0,5) + " - " + obj[i].event + " - " + Date_gefunden.Biotonne);
  };
 
  wait(1000);
  //console.log('____ vor Restmuell' + ' obj.event:' + obj[i].event + ' Date_gefunden: ' + Date_gefunden.Restmuelltonne);
  if (obj[i].event == "Restmuelltonne " && !(Date_gefunden.Restmuelltonne)) {
    Date_gefunden.Restmuelltonne = true;
    console.log('____ in Restmuell');
    setState('0_userdata.0.Müllabfuhr.Restmuelltonne', obj[i].date.slice(0,5));
    console.log("___Restmülltonne : " + obj[i].date.slice(0,5) + " - " + obj[i].event + " - " + Date_gefunden.Restmuelltonne);
  };

  wait(1000);
  if (obj[i].event == "Papiertonne " && !(Date_gefunden.Papiertonne)) {
    Date_gefunden.Papiertonne = true;
    setState('0_userdata.0.Müllabfuhr.Papiertonne', obj[i].date.slice(0,5));
    console.log("___Papiertonne : " + obj[i].date.slice(0,5) + " - " + obj[i].event + " - " + Date_gefunden.Papiertonne);
  };

    wait(1000);
  if (obj[i].event == "Glas " && !(Date_gefunden.Glas)) {
    Date_gefunden.Glas = true;
    setState('0_userdata.0.Müllabfuhr.Glas', obj[i].date.slice(0,5));
    console.log("___Glas : " + obj[i].date.slice(0,5) + " - " + obj[i].event + " - " + Date_gefunden.Glas);
  };

   wait(1000);
   if (obj[i].event == "Gelbe Tonne " && !(Date_gefunden.Gelbe_Tonne)) {
    Date_gefunden.Gelbe_Tonne = true;
    setState('0_userdata.0.Müllabfuhr.Gelbe_Tonne', obj[i].date.slice(0,5));
    console.log("___Gelbe_Tonne : " + obj[i].date.slice(0,5) + " - " + obj[i].event + " - " + Date_gefunden.Gelbe_Tonne);
  };

};

}


//schedule('{"time":{"exactTime":true,"start":"03:00"},"period":{"days":1}}',Muellkalender)
schedule('*/10 * * * *', Muellkalender)


