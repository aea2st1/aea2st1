// starten von rpc0 - jede Nacht um 3 Uhr
// rega adapter auch zurücksetzen - sonst wird der alive Status für Batterieüberwachung
//     nicht neu eingelesen

async function Restart_hm () {

setState ("system.adapter.hm-rega.0.alive", false);
await sleep(20000);
setState ("system.adapter.hm-rega.0.alive", true);
await sleep(20000);

setState ("system.adapter.hm-rpc.0.alive", false);
await sleep(20000);
setState ("system.adapter.hm-rpc.0.alive", true);
}


schedule("* 3 * * *", function() {
Restart_hm();
console.log("____ restart adapter - hm-rega und hm-rpc0");


}
);