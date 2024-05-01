/*
 * @copyright 2020 Stephan Kreyenborg <stephan@kreyenborg.koeln>
 *
 * @author 2020 Stephan Kreyenborg <stephan@kreyenborg.koeln>
 *
 * Dieses Skript dient zur freien Verwendung in ioBroker zur Erfassung der Astro-Zeiten.
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
 * Skript Name:     Astro-Zeiten
 * Skript Version:  1.41
 * Erstell-Datum:   01. April 2021 | Update: 23. Dezember 2022
 * 
 */

// Datenpunkte neu erstellen
var ueberschreiben = false;

// Hauptdatenpunkt unterhalb javascript
var datenpunkt = "Astro.";

// Lesbare Zeiten
var lesbare_zeiten = ["Früher Morgen", "Frühe Dämmerung", "Morgendämmerung", "Sonnenaufgang", "Vormittag", "später Vormittag", "Mittag",
    "früher Abend", "Abend", "Sonnenuntergang", "Abenddämmerung", "später Abend", "Nacht", "Mitternacht"];

// Objekte der Astro Zeiten
var objekt = ["nauticalDawn", "nauticalDawn", "dawn", "sunrise", "sunriseEnd", "goldenHourEnd", "solarNoon", "goldenHour",
    "sunsetStart", "sunset", "dusk", "nauticalDusk", "nauticalDusk", "nadir", "tageszeitAstro", "naechsteTageszeitAstro",
    "tageszeitLesbar", "naechsteTageszeitLesbar", "aktuelleAstroZeit", "Tag", "sunriseUnix", "sunsetUnix", "sommerzeit",
    "tageslaenge", "tageslaenge_minuten", "mondphase"];

// Zustände der Astro-Zeiten
var beschreibung = ["00 - Ende der Nacht", "01 - nautische Morgendämmerung", "02 - Morgendämmerung", "03 - Sonnenaufgang",
    "04 - Ende des Sonnenaufgangs", "05 - Ende der goldenen Stunde VM", "06 - Mittag", "07 - goldene Abendstunde",
    "08 - Start des Sonnenuntergangs", "09 - Sonnenuntergang", "10 - Dämmerung Abends", "11 - nautische Dämmerung abends",
    "12 - Start der Nacht", "13 - Mitternacht", "Aktuelle Tageszeit (Astro)", "Nächste Tageszeit (Astro)",
    "Aktuelle Tageszeit (lesbar)", "Nächste Tageszeit (lesbar)", "aktuelle Astrozeit",
    "Solange die Sonne scheint, ist Tag", "Sunrise Unix Zeitstempel", "Sunset Unix Zeitstempel", "Sommerzeit/Winterzeit",
    "Länge des Tages in HH:MM", "Länge des Tages in Minuten", "Aktuelle Mondphase"];

// Suncalc
const suncalc = require('suncalc');

// Erstelle die benötigten Datenpunkte
function datenpunkte_erstellen() {
    var numstatuss = objekt.length;
    let datum = new Date();
    for (var i = 0; i < objekt.length; i++) {
        let initial = "";
        if (i < 14) {
            let astro_zeit = zeit_formatieren(getAstroDate(objekt[i], datum));
            if (astro_zeit == "Invalid Date") {
                astro_zeit = "00:00";
            }
            initial = astro_zeit
        } else {
            initial = "";
        }
        createState(datenpunkt + objekt[i], initial, ueberschreiben, {
            read: true,
            write: true,
            name: beschreibung[i],
            desc: beschreibung[i],
            type: "string",
            role: "value",
            unit: "",
            def: ""
        });
        numstatuss--;
        if (numstatuss === 0) {
            update_astro_zeiten();
        }
    }
    log("Astro: Datenpunkte erstellt!");
}

// Haupt-Skript
function update_astro_zeiten() {
    var datum = new Date();
    var uhrzeit = zeit_formatieren(datum);

    // Zustand der Daten
    var aktuell = 0;
    var aktualisiert = 0;
    var keine_aktualisierung = 0;
    var astro_index = 0;

    // Aktuellen Tagesabschnitt bestimmen
    var ergebnis = -1;
    var naechste_element = false;

    // Aktuelle & kommende Tageszeit
    var aktuelle_tageszeit = 0;
    var kommende_tageszeit = 0;

    // Tag
    var astroTag = "Nacht";

    for (var i = 0; i < 14; i++) {
        // Temporäre Zahl
        var tmp_ergebnis = 0;

        // Hole Uhrzeit aus aktuellem Datenpunkt
        var dp_zeit = getState(datenpunkt + objekt[i]).val;

        // Hole Index aktuelle Tageszeit
        var tmp_time_uhr = Date.parse('1970-01-01 ' + uhrzeit + ':00');
        var tmp_time_dp = Date.parse('1970-01-01 ' + dp_zeit + ':00');

        // Aktuelle Zeit ist kleiner als DP
        if (tmp_time_uhr < tmp_time_dp) {
            tmp_ergebnis = tmp_time_dp - tmp_time_uhr;
            if (tmp_ergebnis <= ergebnis || ergebnis == -1) {
                ergebnis = tmp_ergebnis;
                astro_index = i;
                naechste_element = true;
            }
            // Aktuelle Zeit ist größer als DP
        } else {
            tmp_ergebnis = tmp_time_uhr - tmp_time_dp;
            if (tmp_ergebnis <= ergebnis || ergebnis == -1) {
                ergebnis = tmp_ergebnis;
                astro_index = i;
                naechste_element = false;
            }
        }
        // Datenpunkt ist kleiner als aktuelle Uhrzeit. Update!
        if (dp_zeit < uhrzeit) {
            // Neue Astro-Zeit für den nächsten Tag generieren
            let morgen = new Date();
            morgen.setDate(morgen.getDate() + 1);
            var astro_zeit = zeit_formatieren(getAstroDate(objekt[i], morgen));

            // Datenpunkt und Astro Zeit sind gleich. Kein Update!
            if (dp_zeit == astro_zeit) {
                keine_aktualisierung++;
            } else {
                if (astro_zeit == "Invalid Date") {
                    astro_zeit = "00:00";
                }
                setState(datenpunkt + objekt[i], astro_zeit, true);
                aktualisiert++;
            }
        } else {
            // Zeit kommt noch! Kein Update!
            aktuell++;
        }
    }
    // Wenn wahr, ist der Abstand zum nächsten Zeitpunkt kleiner. Also -1 um aktuellen Index zu erhalten.
    if (naechste_element) {
        astro_index--;
    }

    // Navigiere zum richtigen Index
    if (astro_index > 12) {
        aktuelle_tageszeit = 13;
        kommende_tageszeit = 0;
    } else if (astro_index < 0) {
        aktuelle_tageszeit = 0;
        kommende_tageszeit = 1;
    } else {
        aktuelle_tageszeit = astro_index;
        kommende_tageszeit = astro_index + 1;
    }

    // Prüfe, ob aktuelle Uhrzeit zwischen Sonnenauf- und untergang liegt
    if (astro_index > 2 && astro_index < 10) {
        astroTag = "Tag";
    }

    // Update aktuelle Tageszeit Astro (Text)
    setState(datenpunkt + objekt[14], text_formatieren(beschreibung[aktuelle_tageszeit]), true);

    // Update kommende Tageszeit Astro (Text)
    setState(datenpunkt + objekt[15], text_formatieren(beschreibung[kommende_tageszeit]), true);

    // Update aktuelle Tageszeit lesbar (Text)
    setState(datenpunkt + objekt[16], lesbare_zeiten[aktuelle_tageszeit], true);

    // Update kommende Tageszeit lesbar (Text)
    setState(datenpunkt + objekt[17], lesbare_zeiten[kommende_tageszeit], true);

    // Update aktuelle AstroZeit
    setState(datenpunkt + objekt[18], objekt[aktuelle_tageszeit], true);

    // Setze die Variable "Tag" auf "Tag", wenn Uhrzeit zwischen Sonnenauf- und untergang
    setState(datenpunkt + objekt[19], astroTag, true);

    // Setze Sommerzeit auf Sommerzeit, wenn in Sommerzeit
    setState(datenpunkt + objekt[22], pruefe_sommerzeit(datum), true);

    // Tageslänge berechnen - in Stunden und Minuten
    let laenge = tageslaenge(getAstroDate(objekt[9]), getAstroDate(objekt[3]));
    setState(datenpunkt + objekt[23], laenge.hh_mm, true);
    setState(datenpunkt + objekt[24], laenge.minuten.toString(), true);

    // Mondphase
    let phase = mondphase(datum);
    setState(datenpunkt + objekt[25], phase, true);

    // Setze die Variable Sunrise Unix
    let tmp_morgen = new Date();
    tmp_morgen.setDate(tmp_morgen.getDate() + 1);
    let unix_sunrise = getAstroDate("sunrise", tmp_morgen).getTime() * 1000;
    setState(datenpunkt + objekt[20], unix_sunrise.toString(), true);

    // Setze die Variable Sunset Unix
    let unix_sunset = getAstroDate("sunset", tmp_morgen).getTime() * 1000;
    setState(datenpunkt + objekt[21], unix_sunset.toString(), true);

    var ausgabe = "Astro: Gültige Zeiten: [aktueller Tag: " + aktuell + "] | [nächster Tag: " + keine_aktualisierung + "] | [Aktualisiert: " + aktualisiert +
        "] | Aktuelle Tageszeit: " + lesbare_zeiten[aktuelle_tageszeit] + " | Kommende Tageszeit: " + lesbare_zeiten[kommende_tageszeit];
    log(ausgabe);
}

// Funktion, um die Zeit in HH:MM zu formatieren
function zeit_formatieren(zeit) {
    return zeit.toLocaleTimeString('de-DE', { hour12: false, hour: '2-digit', minute: '2-digit' });
}

// Funktion, um den Text zu formatieren. "Mittag" statt "6 - Mittag"
function text_formatieren(text) {
    text = text.split("-")[1];
    text = text.substr(1, text.length);
    return text;
}

function pruefe_sommerzeit(date = new Date()) {
    const januar = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
    const juli = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    let sommerzeit = "";

    if (Math.max(januar, juli) !== date.getTimezoneOffset()) {
        sommerzeit = "Sommerzeit";
    } else {
        sommerzeit = "Winterzeit";
    }
    return sommerzeit;
}

function tageslaenge(endzeit, startzeit) {
    // Basis - Sonnenauf- und Untergang
    var stundeDiff = Math.abs(endzeit.getTime() - startzeit.getTime()) / 1000; //in s
    var hDiff = Math.floor(stundeDiff / 3600) % 24; //in Stunden
    var minDiff = Math.floor(stundeDiff / 60) % 60; //in Minuten
    var lesbar = {};
    lesbar.hh_mm = hDiff + ":" + minDiff;
    lesbar.minuten = (hDiff * 60) + minDiff;
    return lesbar;
}

function mondphase(datum) {
    var mondphase = suncalc.getMoonIllumination(datum);
    var mond = mondphase.phase;

    var status = 'Neumond';

    if (mond > 0.05) status = 'Viertelmond zunehmend';

    if (mond > 0.2) status = 'Halbmond zunehmend';

    if (mond > 0.3) status = 'Dreiviertelmond zunehmend';

    if (mond > 0.45) status = 'Vollmond';

    if (mond > 0.55) status = 'Dreiviertelmond abnehmend';

    if (mond > 0.7) status = 'Halbmond abnehmend';

    if (mond > 0.8) status = 'Viertelmond abnehmend';

    if (mond > 0.95) status = 'Neumond';

    return status;
}

// Erster Start des Skripts und anlegen der Datenpunkte
function update_astro_zeiten_erster_start() {
    log("Astro: Erster Start des Skriptes!")
    // Datenpunkte werden erstellt
    datenpunkte_erstellen();
}

// Erster Start und Initialisierung
update_astro_zeiten_erster_start();

// Alle 60 Minunten das Hauptskript ausführen
schedule('*/30 * * * *', update_astro_zeiten);