// starten von web - jede Nacht um 3.05 Uhr


async function Restart_web () {

setState ("system.adapter.web.0.alive", false);
await sleep(20000);
setState ("system.adapter.web.0.alive", true);
await sleep(20000);

}


schedule("5 3 * * *", function() {
Restart_web();
console.log("____ restart adapter - web0");


}
);