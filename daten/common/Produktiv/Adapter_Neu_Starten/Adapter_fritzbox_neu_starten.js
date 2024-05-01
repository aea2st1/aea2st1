// starten von tr-064 alle 5 min
// sonst werden die Call Listen nicht aktiviert

async function Restart_tr_064 () {

setState ("system.adapter.tr-064.0.alive", false);
await sleep(1000);
setState ("system.adapter.tr-064.0.alive", true);
await sleep(1000);
}


schedule("*/30 * * * *", function() {
Restart_tr_064();
console.log("____ restart adapter - tr-064");




// Axel neu



}
);