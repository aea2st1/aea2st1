/* Speed-Test
 
SpeedTest mit Ausgabe von Down- / Uploadgeschwindigkeit und Ping
 
Erstellt 10.11.2016 by Cybertron
 
*/
 
/* Installation:
	npm install --global speed-test
*/
 
/* Aufruf:
	spped-test --json --verbose
*/
 
/* Beispiel: 
{"ping":118,"download":2.2,"upload":2.2,"data":{"speeds":{"download":2.179,"upload":2.209,"originalDownload":239941,"originalUpload":242389},
"client":{"ip":"xxx.xxx.xxx.xxx","lat":51.2993,"lon":9.491,"isp":"Deutsche Telekom","isprating":3,"rating":0,"ispdlavg":13.86,"ispulavg":3.108},
"server":{"host":"speedtest.hillcom.de","lat":50.7511,"lon":9.2711,"location":"Alsfeld","country":"Germany","cc":"DE","sponsor":"HillCom Solutions",
"distance":62.87,"distanceMi":39.06,"ping":117.8,"id":"6599"}}} */
 
var logging = false;
var instanz = 'javascript.0';  instanz = instanz + '.';
var pfad =     'Status.Speed-Test.';
var cronStr         = "* * * * * *";
var forceCreation   = false;
 
createState('Status.Speed-Test.json');
createState('Status.Speed-Test.ping',{name: 'Ping',desc: 'Ping',type: 'number'}); 																// 118
createState('Status.Speed-Test.download',{name: 'Download',desc: 'Downloadgeschwindigkeit (Mbit/s)',type: 'number',unit:'Mbit/s'});                   					//	2.2
createState('Status.Speed-Test.upload',{name: 'Upload',desc: 'Uploadgeschwindigkeit (Mbit/s)',type: 'number',unit:'Mbit/s'});                         					//	2.2
 
createState('Status.Speed-Test.data.speeds.download',{name: 'Download',desc: 'Downloadgeschwindigkeit (Mbit/s)',type: 'number',unit:'Mbit/s'}); 							//	2.179
createState('Status.Speed-Test.data.speeds.upload',{name: 'Upload',desc: 'Uploadgeschwindigkeit (Mbit/s)',type: 'number',unit:	'Mbit/s'});          					//	2.209
createState('Status.Speed-Test.data.speeds.orginalDownload',{name: 'OrginalDownload',desc: 'Downloadgeschwindigkeit (bit/s)',type: 'number',unit:'bit/s'});  			//	239941
createState('Status.Speed-Test.data.speeds.orginalUpload',{name: 'OrginalUpload',desc: 'Uploadgeschwindigkeit (bit/s)',type: 'number',unit:'bit/s'});        			//	242389
 
createState('Status.Speed-Test.data.client.ip',{name: 'IP',desc: 'Öffentliche IP-Adresse',type: 'string'});                  													//	xxx.xxx.xxx.xxx
createState('Status.Speed-Test.data.client.lat',{name: 'Latitude',desc: 'Latidude',type: 'string'});                   															//	51.2993
createState('Status.Speed-Test.data.client.lon',{name: 'Longitude',desc: 'Longitude',type: 'string'});                   															//	9.491
createState('Status.Speed-Test.data.client.isp',{name: 'ISP',desc: 'Internet-Service-provide',type: 'string'});                 												//	Deutsche Telekom
createState('Status.Speed-Test.data.client.isprating',{name: 'ISP-Rating',desc: 'ISP-Rating',type: 'number'});              														//	3
createState('Status.Speed-Test.data.client.rating',{name: 'Rating',desc: 'Rating',type: 'number'});                 																	//	0
createState('Status.Speed-Test.data.client.ispdlavg',{name: 'ISP-DL-AVG',desc: 'ISPDLAVG',type: 'number',unit:'Mbit/s'}); 															//	13.86
createState('Status.Speed-Test.data.client.ispulavg',{name: 'ISP-UL-AVG',desc: 'ISPULAVG',type: 'number',unit:'Mbit/s'}); 															//	3.108
 
createState('Status.Speed-Test.data.server.host',{name: 'Host',desc: 'Hostname des Servers',type: 'string'});                													//	speedtest.hillcom.de
createState('Status.Speed-Test.data.server.lat',{name: 'Server-Latitude',desc: 'Latitude des Serverstandortes',type: 'long'});                   						//	50.7511
createState('Status.Speed-Test.data.server.lon',{name: 'Server-Longitude',desc: 'Longitude des Serverstandortes',type: 'long'});                   		 			//	9.2711
createState('Status.Speed-Test.data.server.location',{name: 'Server-Location',desc: 'Server-Standort',type: 'string'});            											//	Alsfeld
createState('Status.Speed-Test.data.server.country',{name: 'Server-Country',desc: 'Land',type: 'string'});             															//	Germany
createState('Status.Speed-Test.data.server.cc',{name: 'Server-CC',desc: 'Länderkürzel',type: 'string'});                  														//	DE
createState('Status.Speed-Test.data.server.sponsor',{name: 'Server-Sponsor',desc: 'Sponsor des Servers',type: 'string'});             										//	HillCom Solutions
createState('Status.Speed-Test.data.server.distance',{name: 'DistanzToServer',desc: 'Distanz zum Server in km',type: 'number',unit:'km'});     								//	62.87
createState('Status.Speed-Test.data.server.distanceMi',{name: 'DistanzToServerMeilen',desc: 'Distanz des Servers im Meilen',type: 'number',unit:'Meilen'});				//	39.06
createState('Status.Speed-Test.data.server.ping',{name: 'Server-Ping',desc: 'Ping zum Server',type: 'number'});                         										//	117.8
createState('Status.Speed-Test.data.server.id',{name: 'Server-ID',desc: 'Server ID',type: 'number'});                                                                  	//	65599
 
function SpeedTest() {
exec("speed-test --json --verbose", function(err, stdout, stderr) {
    if (err) {
       log(stderr,'error');
       return;
    }
writeDP(stdout);
 
});
}
 
function writeDP(jsonstring){
 
	var objects = JSON.parse(jsonstring);
	
	var jsonStr = jsonstring;
	//log (jsonStr);
 
	var ping = objects.ping;
	var download = objects.download;
	var upload = objects.upload;
 
    //log ('Ping =' + ping);
    //log ('Download = ' + download);
    //log ('Upload = ' + upload);
 
	var Speed_Download = objects.data.speeds.download;
	var Speed_Upload = objects.data.speeds.upload;
	var Speed_OriginalDownload = objects.data.speeds.originalDownload;
	var Speed_OriginalUpload = objects.data.speeds.originalUpload;
 
    //log ('Speed_Download = ' + Speed_Download);
    //log ('Speed_Upload = ' + Speed_Upload);
    //log ('OriginalDownload = ' + Speed_OriginalDownload);
    //log ('OriginalUpload = ' + Speed_OriginalUpload);
 
	var Client_IP = objects.data.client.ip;
	var Client_lat = objects.data.client.lat;
	var Client_lon = objects.data.client.lon;
	var Client_isp = objects.data.client.isp;
	var Client_isprating = objects.data.client.isprating;
	var Client_rating = objects.data.client.rating;
	var Client_ispdlavg = objects.data.client.ispdlavg;
	var Client_ispulavg = objects.data.client.ispulavg.varvalue;
 
	var Server_host = objects.data.server.host;
	var Server_lat = objects.data.server.lat;
	var Server_lon = objects.data.server.lon;
	var Server_location = objects.data.server.location;
	var Server_country = objects.data.server.country;
	var Server_cc = objects.data.server.cc;
	var Server_sponsor = objects.data.server.sponsor;
	var Server_distance = objects.data.server.distance;
	var Server_distanceMi = objects.data.server.distanceMi;
	var Server_ping = objects.data.server.ping;
	var Server_id = objects.data.server.id;
 
   setState(instanz + pfad + "json",jsonStr);
 
   setState(instanz + pfad + "ping",ping);
   setState(instanz + pfad + "download",download);
   setState(instanz + pfad + "upload",upload);
 
   setState(instanz + pfad + "data.speeds.download",Speed_Download);
   setState(instanz + pfad + "data.speeds.upload",Speed_Upload);
   setState(instanz + pfad + "data.speeds.orginalDownload",Speed_OriginalDownload);
   setState(instanz + pfad + "data.speeds.orginalUpload",Speed_OriginalUpload);
 
   setState(instanz + pfad + "data.client.ip",Client_IP);
   setState(instanz + pfad + "data.client.lat",Client_lat);
   setState(instanz + pfad + "data.client.lon",Client_lon);
   setState(instanz + pfad + "data.client.isp",Client_isp);
   setState(instanz + pfad + "data.client.isprating",Client_isprating);
   setState(instanz + pfad + "data.client.rating",Client_rating);
   setState(instanz + pfad + "data.client.ispdlavg",Client_ispdlavg);
   setState(instanz + pfad + "data.client.ispulavg",Client_ispulavg);

   setState(instanz + pfad + "data.server.host",Server_host);
   setState(instanz + pfad + "data.server.lat",Server_lat);
   setState(instanz + pfad + "data.server.lon",Server_lon);
   setState(instanz + pfad + "data.server.location",Server_location);
   setState(instanz + pfad + "data.server.country",Server_country);
   setState(instanz + pfad + "data.server.cc",Server_cc);
   setState(instanz + pfad + "data.server.sponsor",Server_sponsor);
   setState(instanz + pfad + "data.server.distance",Server_distance);
   setState(instanz + pfad + "data.server.distanceMI",Server_distanceMi);
   setState(instanz + pfad + "data.server.ping",Server_ping);
   setState(instanz + pfad + "data.server.id",Server_id);
 
}
 
// regelmässige Wiederholungen
// -----------------------------------------------------------------------------
schedule(cronStr, SpeedTest);




