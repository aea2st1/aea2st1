/*
 * @copyright 2020 Stephan Kreyenborg <stephan@kreyenborg.koeln>
 *
 * @author 2020 Stephan Kreyenborg <stephan@kreyenborg.koeln>
 *
 * Dieses Skript dient zur freien Verwendung in ioBroker zur Verbrauchserfassung der Shelly Geräte.
 * Jegliche Verantwortung liegt beim Benutzer. Das Skript wurde unter Berücksichtigung der bestmöglichen Nutzung
 * und Performance entwickelt.
 * Der Entwickler versichert, das keine böswilligen Systemeingriffe im originalen Skript vorhanden sind.
 *
 * Sollte das Skript wider Erwarten nicht korrekt funktionieren, so hast Du jederzeit die Möglichkeit, Dich auf
 * https://www.kreyenborg.koeln
 * für Unterstützung zu melden. Jedes Skript besitzt seine eigene Kommentarseite, auf der,
 * nach zeitlicher Möglichkeit des Autors, Hilfe angeboten wird. Ein Anrecht hierauf besteht nicht!
 *
 * Ansprüche gegenüber Dritten bestehen nicht.
 *
 * Skript Name:     Shelly-Verbrauch
 * Skript Version:  1.40
 * Erstell-Datum:   05. Mai 2021
 *
 */
 
// Datenpunkte neu erstellen
var ueberschreiben = false;
 
// Hauptdatenpunkt unterhalb javascript
var datenpunkt = "ShellyVerbrauch.";
 
// Verbrauchs Objekte der einzelnen Shelly
const objekt = ["gesamt", "dieses_jahr", "letztes_jahr", "letzter_monat", "dieser_monat", "letzte_woche",
    "diese_woche", "gestern", "heute", "alter_wert", "aktueller_wert"];
 
// Beschreibung der Objekte
const beschreibung = ["Gesamter Vebrauch des Shelly", "Verbrauch aktuelles Jahr", "Verbrauch letztes Jahr",
    "Verbrauch letzten Monat", "Verbrauch aktueller Monat", "Verbrauch letzte Woche", "Verbrauch diese Woche",
    "Verbrauch gestern", "Verbrauch heute", "Messwert alt", "Messwert neu"];
 
// Datenpunkt der Shelly (Standard: shelly.0)
var shelly_dp = "shelly.0";
 
// Datenpunkte der Shelly (!!! Bitte nicht ändern !!!)
const shellyDps = $('state[id=' + shelly_dp + '.*.*.Energy]');
 
// Datenpunkte der Shelly 3EM DP
const shelly3EMDps = $('state[id=' + shelly_dp + '.*.*.Total]');
 
// Datenpunkte der Shelly Namen (!!! Bitte nicht ändern !!!)
const shellyDpsName = $('state[id=' + shelly_dp + '.*.name]');
 
// Shelly Verbrauch aktualisieren - nachts um 00:00 Uhr
function shelly_vebrauch_tag() {
    // Nochmals das Tagesupdate durchlaufen, damit die restlichen Werte gelesen werden
    shelly_verbrauch_update();
 
    // Datumsvariable
    var heute = new Date();
 
    // Heute zu Gestern verschieben. Täglich um 00:00 Uhr
    verschiebe_verbrauch_objekt("heute", "gestern");
    log("Shelly Verbrauch: Werte für gestern und heute aktualisiert!");
 
    // aktuelle Woche in letzte Woche verschieben. Am Montag um 00:00 Uhr
    if (heute.getDay() === 1) {
        verschiebe_verbrauch_objekt("diese_woche", "letzte_woche");
        log("Shelly Verbrauch: Werte für diese und letzte Woche aktualisiert!");
    }
 
    // aktueller Monat in letzten Monat verschieben. Am 1. des Monats um 00:00 Uhr
    if (heute.getDate() === 1) {
        verschiebe_verbrauch_objekt("dieser_monat", "letzter_monat");
        log("Shelly Verbrauch: Werte für diesen und letzten Monat aktualisiert!");
    }
 
    // aktuelles Jahr in letztes Jahr verschieben. Am 1. des Monats am 1. Monat um 00:00 Uhr
    if (heute.getDate() === 1 && heute.getMonth() === 0) {
        verschiebe_verbrauch_objekt("dieses_jahr", "letztes_jahr");
        log("Shelly Verbrauch: Werte für dieses und letztes Jahr aktualisiert!");
    }
}
 
// Tagesverbrauch alle 15 Min von der Original Variable des Shelly in eigene Variable kopieren
function shelly_verbrauch_update() {
    var anzahl_updates = 0;
    var anzahl_reboots = 0;
    var anzahl_gleich = 0;
    shellyDps.each(function (id, i) {
        var shelly_verbrauch = getState(id).val;
        // Einige Shelly haben keine Verbrauchswerte (noch nicht)
        if (shelly_verbrauch != null) {
            // Hole aktuellen Wert, um zu kontrollieren, ob ein Reboot stattgefunden hat
            var aktueller_wert = getState(shelly_DP(id) + "aktueller_wert").val;
            var alter_wert = 0;
            // Prüfe alten und neuen Wert
            if (shelly_verbrauch > aktueller_wert) {
                // Verbrauchswert ist größer als alter Wert -> es wurde kein Reboot durchgeführt
                setState(shelly_DP(id) + "alter_wert", aktueller_wert, true);
                alter_wert = aktueller_wert;
                anzahl_updates++;
            }
            if (aktueller_wert > shelly_verbrauch) {
                // Verbrauchswert ist kleiner als alter Wert -> es wurde ein Reboot durchgeführt
                setState(shelly_DP(id) + "alter_wert", 0, true);
                alter_wert = 0;
                anzahl_reboots++;
            }
            if (shelly_verbrauch == aktueller_wert) {
                // Verbrauchswert ist gleich wie alter Wert -> kein Update notwendig
                alter_wert = aktueller_wert;
                anzahl_gleich++;
            }
 
            setState(shelly_DP(id) + "aktueller_wert", shelly_verbrauch, true);
            // Alter und neuer Wert -> aktuelle Differenz
 
            var verbrauch = parseFloat(shelly_verbrauch) - alter_wert;
            // Tagesverbrauch aktualisieren
            aktualisiere_vebrauch_objekt(id, "heute", verbrauch);
 
            // Wochenverbrauch aktualisieren
            aktualisiere_vebrauch_objekt(id, "diese_woche", verbrauch);
 
            // Monatsverbrauch aktualisieren
            aktualisiere_vebrauch_objekt(id, "dieser_monat", verbrauch);
 
            // Jahresverbrauch aktualisieren
            aktualisiere_vebrauch_objekt(id, "dieses_jahr", verbrauch);
 
            // Gesamten Vebrauch aktualisieren
            aktualisiere_vebrauch_objekt(id, "gesamt", verbrauch);
        }
    });
    shelly3EMDps.each(function (id, i) {
        var shelly_verbrauch = getState(id).val;
        // Einige Shelly haben keine Verbrauchswerte (noch nicht)
        if (shelly_verbrauch != null) {
            // Hole aktuellen Wert, um zu kontrollieren, ob ein Reboot stattgefunden hat
            var aktueller_wert = getState(shelly_DP(id) + "aktueller_wert").val;
            var alter_wert = 0;
            // Prüfe alten und neuen Wert
            if (shelly_verbrauch > aktueller_wert) {
                // Verbrauchswert ist größer als alter Wert -> es wurde kein Reboot durchgeführt
                setState(shelly_DP(id) + "alter_wert", aktueller_wert, true);
                alter_wert = aktueller_wert;
                anzahl_updates++;
            }
            if (aktueller_wert > shelly_verbrauch) {
                // Verbrauchswert ist kleiner als alter Wert -> es wurde ein Reboot durchgeführt
                setState(shelly_DP(id) + "alter_wert", 0, true);
                alter_wert = 0;
                anzahl_reboots++;
            }
            if (shelly_verbrauch == aktueller_wert) {
                // Verbrauchswert ist gleich wie alter Wert -> kein Update notwendig
                alter_wert = aktueller_wert;
                anzahl_gleich++;
            }
 
            setState(shelly_DP(id) + "aktueller_wert", shelly_verbrauch, true);
            // Alter und neuer Wert -> aktuelle Differenz
 
            var verbrauch = parseFloat(shelly_verbrauch) - alter_wert;
            // Tagesverbrauch aktualisieren
            aktualisiere_vebrauch_objekt(id, "heute", verbrauch);
 
            // Wochenverbrauch aktualisieren
            aktualisiere_vebrauch_objekt(id, "diese_woche", verbrauch);
 
            // Monatsverbrauch aktualisieren
            aktualisiere_vebrauch_objekt(id, "dieser_monat", verbrauch);
 
            // Jahresverbrauch aktualisieren
            aktualisiere_vebrauch_objekt(id, "dieses_jahr", verbrauch);
 
            // Gesamten Vebrauch aktualisieren
            aktualisiere_vebrauch_objekt(id, "gesamt", verbrauch);
        }
    });
    aktualisiere_namen();
    log("Shelly Verbrauch: Verbrauchswerte aktualisiert: " + anzahl_updates + " | Reboots korrigiert: " + anzahl_reboots + " | Unveränderte Werte: " + anzahl_gleich);
}
 
// aktualisiert das jeweilige Verbrauchs-Objekt und addiert den Verbrauch dazu
function aktualisiere_vebrauch_objekt(dp, objekt, wert) {
    var verbrauch = parseFloat(getState(shelly_DP(dp) + objekt).val) + parseFloat(wert);
    verbrauch = parseFloat(verbrauch.toFixed(2));
    setState(shelly_DP(dp) + objekt, verbrauch, true);
}
 
// Verschiebt das jeweilige Verbrauchs-Objekt und nullt den Ursprung (Tag, Woche, Monat, Jahr)
function verschiebe_verbrauch_objekt(von, nach) {
    $('state[id=*.' + datenpunkt + '*.*.' + von + ']').each(function (id, i) {
        // Temporärer Gruppen-Datenpunkt
        var tmp_dp = id.slice(0, -(von.length));
        var verbrauch = getState(id).val;
        if (verbrauch != null) {
            setState(tmp_dp + nach, verbrauch, true);
        }
        // Setze heute zurück
        setState(id, 0, true);
    });
}
 
// Funktion um die aktuellen Namen des Shelly abzuholen
function aktualisiere_namen() {
    shellyDpsName.each(function (id, i) {
        setState(shelly_DP_Name(id), String(getState(id).val), true);
        extendObject("javascript.0." + shelly_DP_Name_Main(id), {
            common: {
                name: String(getState(id).val),
                desc: String(getState(id).val)
            }, type: "channel"
        });
    });
    shelly3EMDps.each(function (id, i) {
        setState(shelly_DP_Name(id), String(getState(id).val), true);
        extendObject("javascript.0." + shelly_DP_Name_Main(id), {
            common: {
                name: String(getState(id).val),
                desc: String(getState(id).val)
            }, type: "channel"
        });
    });
}
 
// Erstelle die benötigten Datenpunkte
function datenpunkte_erstellen() {
    // Anzahl der gefundenen Shelly
    var anzahl = shellyDps.length;
 
    shellyDps.each(function (id, j) {
        var initial_wert = 0;
        for (var i = 0; i < objekt.length; i++) {
            // Startwerte werden nur bei alter_wert und aktueller_wert eingetragen
            if (i > 8) {
                initial_wert = getState(id).val;
            }
            createState(shelly_DP(id) + objekt[i], initial_wert, ueberschreiben, {
                name: beschreibung[i],
                desc: beschreibung[i],
                type: "number",
                role: "value.power",
                unit: "Wh"
            });
        }
    });
 
    // Anzahl der gefundenen Shelly 3EM
    var anzahl_3em = shelly3EMDps.length;
 
    shelly3EMDps.each(function (id, j) {
        var initial_wert = 0;
        for (var i = 0; i < objekt.length; i++) {
            // Startwerte werden nur bei alter_wert und aktueller_wert eingetragen
            if (i > 8) {
                initial_wert = getState(id).val;
            }
            createState(shelly_DP(id) + objekt[i], initial_wert, ueberschreiben, {
                name: beschreibung[i],
                desc: beschreibung[i],
                type: "number",
                role: "value.power",
                unit: "Wh"
            });
        }
    });
 
    // Alle Datenpunkte erstellt. Frage ersten Verbrauch ab!
    log("Shelly Verbrauch: Datenpunkte erstellt! Erster Verbrauch steht nach 30 Sekunden zur Verfügung! Anzahl gefundener Shelly Datenpunkte: " + (anzahl_3em + anzahl));
    setTimeout(shelly_verbrauch_update, 30000);
 
    // Datenpunkte für die Namen der Shelly erstellen
    shellyDpsName.each(function (id, j) {
        createState(shelly_DP_Name(id), "", ueberschreiben, {
            name: "Name des Shelly",
            desc: "Name des Shelly",
            type: "string",
            role: "value",
            unit: ""
        });
    });
    // Datenpunkte für die Namen der Shelly 3EM erstellen
    shelly3EMDps.each(function (id, j) {
        createState(shelly_DP_Name(id), "", ueberschreiben, {
            name: "Name des Shelly",
            desc: "Name des Shelly",
            type: "string",
            role: "value",
            unit: ""
        });
    });
}
 
function shelly_DP(dp) {
    dp = dp.split(".");
    dp = datenpunkt + dp[2] + "." + dp[3] + ".";
    return dp;
}
 
function shelly_DP_Name(dp) {
    dp = dp.split(".");
    dp = datenpunkt + dp[2] + "." + dp[3];
    return dp;
}
 
function shelly_DP_Name_Main(dp) {
    dp = dp.split(".");
    dp = datenpunkt + dp[2];
    return dp;
}
 
function shelly_verbrauch_erster_start() {
    log("Shelly Verbrauch: Erster Start des Skriptes! Datenpunkte werden erstellt!");
    // Datenpunkte werden erstellt
    datenpunkte_erstellen();
}
 
// Erster Start und Initialisierung
shelly_verbrauch_erster_start();
 
// Alle 15 Minuten das Skript für den Tagesverbrauch ausführen
schedule('*/15 * * * *', shelly_verbrauch_update);
 
// Nachts um 24 Uhr werden die Werte in andere Variablen gespeichert, um den Verlauf zu erstellen
schedule('0 0 * * *', shelly_vebrauch_tag);