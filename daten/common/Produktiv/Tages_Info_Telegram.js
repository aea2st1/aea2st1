/* -- do not edit following lines - START --
{
  "expert": true,
  "debug": false,
  "verbose": false
}
-- do not edit previous lines - END --*/



//schedule('{"time":{"exactTime":true,"start":"11:56"},"period":{"days":1}}', async function()
schedule('*/30 * * * * *', async function()


{ 
var end = new Date().getTime();
var max = 0, wert, Energie_heute, Energie_heute_DG, Energie_heute_Haus, Energie_heute_OG;
var Solar_Stunden_gestern, Solar_Stunden_heute, SolarStunden;
var Brenner_Starts_gestern, Brenner_Starts_heute, Brenner_Stunden1_gestern, Brenner_Stunden1_heute;

console.log('_____Start Tages Info Telegram');
// Strom Wohnung Obergeschoss
sendTo('influxdb.0', 'query', 'SELECT * FROM "javascript.0.ShellyVerbrauch.SHEM-3#244CAB435D22#1.Emeter0.heute" group by * order by desc limit 1 ', function (result) {
    if (result.error) {
        console.error(result.error);
    } else {
        console.log(JSON.stringify(result.result[0]));
        wert = JSON.stringify(result.result[0]);
        wert = wert.replace('[',"").replace(']',"");
        //console.log(wert);
        Energie_heute_OG = JSON.parse(wert);
        console.log('Energie_heute_OG ___ : ' + Energie_heute_OG.value);       
//sendTo('telegram.0', 'Solar Stunden: ' + obj.value); 
}});

// Strom Wohnung Erdgeschoss - noch anzupassen - anderer Shelly
sendTo('influxdb.0', 'query', 'SELECT * FROM "javascript.0.ShellyVerbrauch.SHEM-3#244CAB435D22#1.Emeter1.heute" group by * order by desc limit 1 ', function (result) {
    if (result.error) {
        console.error(result.error);
    } else {
        console.log(JSON.stringify(result.result[0]));
        wert = JSON.stringify(result.result[0]);
        wert = wert.replace('[',"").replace(']',"");
        //console.log(wert);
        Energie_heute = JSON.parse(wert);
        console.log('Energie_heute ___ : ' + Energie_heute.value);       
//sendTo('telegram.0', 'Solar Stunden: ' + obj.value); 
}});
// Strom Wohnung Dachgeschoss
sendTo('influxdb.0', 'query', 'SELECT * FROM "javascript.0.ShellyVerbrauch.SHEM-3#244CAB435D22#1.Emeter2.heute" group by * order by desc limit 1 ', function (result) {
    if (result.error) {
        console.error(result.error);
    } else {
        console.log(JSON.stringify(result.result[0]));
        wert = JSON.stringify(result.result[0]);
        wert = wert.replace('[',"").replace(']',"");
        //console.log(wert);
        Energie_heute_DG = JSON.parse(wert);
        console.log('Energie_heute_DG ___ : ' + Energie_heute_DG.value);       
//sendTo('telegram.0', 'Solar Stunden: ' + obj.value); 
}});
// Strom Wohnung Haustechnik
sendTo('influxdb.0', 'query', 'SELECT * FROM "javascript.0.ShellyVerbrauch.SHEM-3#244CAB435D22#1.Emeter1.heute" group by * order by desc limit 1 ', function (result) {
    if (result.error) {
        console.error(result.error);
    } else {
        console.log(JSON.stringify(result.result[0]));
        wert = JSON.stringify(result.result[0]);
        wert = wert.replace('[',"").replace(']',"");
        //console.log(wert);
        Energie_heute_Haus = JSON.parse(wert);
        console.log('Energie_heute_Haus ___ : ' + Energie_heute_Haus.value);       
//sendTo('telegram.0', 'Solar Stunden: ' + obj.value); 
}});

// Heizung - Brenner Starts
sendTo('influxdb.0', 'query', 'select * from "viessmann.0.get.BrennerStarts" where time > now() - 1d LIMIT 1', function (result) {
    if (result.error) {
        console.log(result.error);
    } else {
        // console.log(JSON.stringify(result.result[0]));
        obj = JSON.stringify(result.result[0]);
        obj = obj.replace('[',"").replace(']',"");
        // console.log(obj);
        Brenner_Starts_gestern = JSON.parse(obj);
        console.log('Brenner Starts gestern : ' + Brenner_Starts_gestern.value);
    }
});
sendTo('influxdb.0', 'query', 'select * from "viessmann.0.get.BrennerStarts" group by * order by desc limit 1 ', function (result) {
    if (result.error) {
        console.log(result.error);
    } else {
        // console.log(JSON.stringify(result.result[0]));
        obj = JSON.stringify(result.result[0]);
        obj = obj.replace('[',"").replace(']',"");
        // console.log(obj);
        Brenner_Starts_heute = JSON.parse(obj);
        console.log('Brenner Starts heute : ' + Brenner_Starts_heute.value);
    }
});
// Heizung - Brenner Stunden 1
sendTo('influxdb.0', 'query', 'select * from "viessmann.0.get.BrennerStunden1" where time > now() - 1d LIMIT 1', function (result) {
    if (result.error) {
        console.log(result.error);
    } else {
        // console.log(JSON.stringify(result.result[0]));
        obj = JSON.stringify(result.result[0]);
        obj = obj.replace('[',"").replace(']',"");
        // console.log(obj);
        Brenner_Stunden1_gestern = JSON.parse(obj);
        console.log('Brenner Stunden1 gestern : ' + Brenner_Stunden1_gestern.value);
    }
});
sendTo('influxdb.0', 'query', 'select * from "viessmann.0.get.BrennerStunden1" group by * order by desc limit 1 ', function (result) {
    if (result.error) {
        console.log(result.error);
    } else {
        // console.log(JSON.stringify(result.result[0]));
        obj = JSON.stringify(result.result[0]);
        obj = obj.replace('[',"").replace(']',"");
        // console.log(obj);
        Brenner_Stunden1_heute = JSON.parse(obj);
        console.log('Brenner Stunden1 heute : ' + Brenner_Stunden1_heute.value);
    }
});

// Heizung - Brenner Stunden 2
sendTo('influxdb.0', 'query', 'select * from "viessmann.0.get.BrennerStunden2" where time > now() - 1d LIMIT 1', function (result) {
    if (result.error) {
        console.log(result.error);
    } else {
        // console.log(JSON.stringify(result.result[0]));
        obj = JSON.stringify(result.result[0]);
        obj = obj.replace('[',"").replace(']',"");
        // console.log(obj);
        Brenner_Stunden2_gestern = JSON.parse(obj);
        console.log('Brenner Stunden2 gestern : ' + Brenner_Stunden2_gestern.value);
    }
});
sendTo('influxdb.0', 'query', 'select * from "viessmann.0.get.BrennerStunden2" group by * order by desc limit 1 ', function (result) {
    if (result.error) {
        console.log(result.error);
    } else {
        // console.log(JSON.stringify(result.result[0]));
        obj = JSON.stringify(result.result[0]);
        obj = obj.replace('[',"").replace(']',"");
        // console.log(obj);
        Brenner_Stunden2_heute = JSON.parse(obj);
        console.log('Brenner Stunden2 heute : ' + Brenner_Stunden2_heute.value);
    }
});

/*
// Glasfaser - Download
sendTo('influxdb.0', 'query', 'select mean(*) from "0_userdata.0.Pi_Hole_Speedtest.Download" where time > now() - 1d LIMIT 1', function (result) {
    if (result.error) {
        console.log(result.error);
    } else {
        // console.log(JSON.stringify(result.result[0]));
        obj = JSON.stringify(result.result[0]);
        obj = obj.replace('[',"").replace(']',"");
        // console.log(obj);
        Download = JSON.parse(obj);
        console.log('Glasfaser Download : ' + Download.mean_value);
    }
});
// data.speeds.orginalDownload
sendTo('influxdb.0', 'query', 'select min(*) from "0_userdata.0.Pi_Hole_Speedtest.Download" where time > now() - 1d LIMIT 1', function (result) {
    if (result.error) {
        console.log(result.error);
    } else {
        // console.log(JSON.stringify(result.result[0]));
        obj = JSON.stringify(result.result[0]);
        obj = obj.replace('[',"").replace(']',"");
        //console.log(obj);
        Download_min = JSON.parse(obj);
        console.log('Glasfaser Download_min : ' + Download_min.min_value);
    }
});


// Glasfaser - Upload
sendTo('influxdb.0', 'query', 'select mean(*) from "0_userdata.0.Pi_Hole_Speedtest.Upload" where time > now() - 1d LIMIT 1', function (result) {
    if (result.error) {
        console.log(result.error);
    } else {
        // console.log(JSON.stringify(result.result[0]));
        obj = JSON.stringify(result.result[0]);
        obj = obj.replace('[',"").replace(']',"");
        // console.log(obj);
        Upload = JSON.parse(obj);
        console.log('Glasfaser Upload : ' + Upload.mean_value);
    }
});
// Glasfaser - Upload min
sendTo('influxdb.0', 'query', 'select min(*) from "0_userdata.0.Pi_Hole_Speedtest.Upload" where time > now() - 1d LIMIT 1', function (result) {
    if (result.error) {
        console.log(result.error);
    } else {
        // console.log(JSON.stringify(result.result[0]));
        obj = JSON.stringify(result.result[0]);
        obj = obj.replace('[',"").replace(']',"");
        console.log(obj);
        Upload_min = JSON.parse(obj);
        console.log('Glasfaser Upload_min : ' + Upload_min.min_value);
    }
});

// Glasfaser - Ping
sendTo('influxdb.0', 'query', 'select mean(*) from "0_userdata.0.Pi_Hole_Speedtest.Ping" where time > now() - 1d LIMIT 1', function (result) {
    if (result.error) {
        console.log(result.error);
    } else {
        // console.log(JSON.stringify(result.result[0]));
        obj = JSON.stringify(result.result[0]);
        obj = obj.replace('[',"").replace(']',"");
        // console.log(obj);
        Ping = JSON.parse(obj);
        // Beispiel - string extrhieren - start1 = source.Substring(0, source.IndexOf('-'));
        // ping_integer = Ping.mean_value.Substring(0,IndexOf('.'));
        // Ping.mean_value ... real Zahl ... Befehl rechts funktioniert .... wert = Ping.mean_value / 10;
        console.log('Glasfaser Ping : ' + Ping.mean_value + '               ' + Math.trunc(Ping.mean_value));
    }
});
// Glasfaser - Ping min
sendTo('influxdb.0', 'query', 'select min(*) from "0_userdata.0.Pi_Hole_Speedtest.Ping" where time > now() - 1d LIMIT 1', function (result) {
    if (result.error) {
        console.log(result.error);
    } else {
        // console.log(JSON.stringify(result.result[0]));
        obj = JSON.stringify(result.result[0]);
        obj = obj.replace('[',"").replace(']',"");
        // console.log(obj);
        Ping_min = JSON.parse(obj);
        console.log('Glasfaser Ping min: ' + Ping_min.min_value + '               ' + Math.trunc(Ping_min.min_value));
    }
});
*/
// zum synchronisieren falls notwendig .... await sleep(2000);


sendTo('influxdb.0', 'getHistory', {
    id: 'viessmann.0.get.TempSpu',
    options: {
        start:      end - 600000,
        end:        end,
        aggregate: 'none' // or 'none' to get raw values
    }
}, function (result) {
    for (var i = 0; i < result.result.length; i++) {
        console.log(result.result[i].val + ' ' + new Date(result.result[i].ts).toISOString());
        if (result.result[i].val > max) {
        max = result.result[i].val;
        }
    }
    console.log('____ ' + max);
    // sendTo('telegram.0', 'TempSpu: ' + max + ' °C');
});

sendTo('influxdb.0', 'query', 'SELECT * FROM "viessmann.0.get.SolarStunden" where time > now() -1d limit 1', function (result) {
    if (result.error) {
        console.error(result.error);
    } else {
        console.log(JSON.stringify(result.result[0]));
        wert = JSON.stringify(result.result[0]);
        wert = wert.replace('[',"").replace(']',"");
        //console.log(wert);
        Solar_Stunden_gestern = JSON.parse(wert);
        console.log('Solar_Stunden_gestern ___ : ' + Solar_Stunden_gestern.value);        
//sendTo('telegram.0', 'Solar Stunden gestern: ' + obj.value); 
}});

sendTo('influxdb.0', 'query', 'SELECT * FROM "viessmann.0.get.SolarStunden" group by * order by desc limit 1 ', function (result) {
    if (result.error) {
        console.error(result.error);
    } else {
        console.log(JSON.stringify(result.result[0]));
        wert = JSON.stringify(result.result[0]);
        wert = wert.replace('[',"").replace(']',"");
        //console.log(wert);
        Solar_Stunden_heute = JSON.parse(wert);
        console.log('Solar_Stunden_heute ___ : ' + Solar_Stunden_heute.value);  
        console.log('_____ hier vor sollten Solar Stunden ausgegeben werden');     
//sendTo('telegram.0', 'Solar Stunden: ' + obj.value); 
}});
//   
console.log('___vor Wartezeit Telegram senden');
await wait(3000);

//console.log('Solarstunden : ' + (Solar_Stunden_heute.value - Solar_Stunden_gestern.value));
console.log('___vor Telegram senden');

sendTo('telegram.0', '☀️:  Speicher: ' + max + ' °C ' 
 + '☀️ ' + (Solar_Stunden_heute.value - Solar_Stunden_gestern.value) + ' h'
 + '\n🔥:  E/A: ' 
 + (Math.trunc(Brenner_Starts_heute)-Math.trunc(Brenner_Starts_gestern)) + '  '
 + (Brenner_Stunden1_heute-Brenner_Stunden1_gestern).toFixed(2) + '/'
// + (Brenner_Stunden2_heute-Brenner_Stunden2_gestern).toFixed(2)
 + '\n"' 

// + Math.trunc(Download.mean_value) + '/' + Math.trunc(Download_min.min_value) + ' ' 
// + Math.trunc(Upload.mean_value) + '/' + Math.trunc(Upload_min.min_value) + ' '
// + Math.trunc(Ping.mean_value) + '/' + Math.trunc(Ping_min.min_value)
 + '\n🔌: EG: ' + Math.trunc(Energie_heute.value) + ' kWh ' 
 + '\n🔌: DG: ' + Math.trunc(Energie_heute_DG.value) + ' kWh '
 + '\n🔌: OG: ' + Math.trunc(Energie_heute_OG.value) + ' kWh '
 + '\n🔌: HT: ' + Math.trunc(Energie_heute_Haus.value) + ' kWh '
 ); 

console.log('____ an Telegram gesendet');

});

