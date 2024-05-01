const Kino_Sound =   ["KEY_POWERON", "KEY_MENU", "KEY_DOWN", "KEY_RIGHT", "KEY_ENTER", "KEY_UP", "KEY_UP", "KEY_UP", "KEY_DOWN", "KEY_ENTER", "KEY_RETURN", "KEY_RETURN", "KEY_RETURN"];
const Normal_Sound = ["KEY_POWERON", "KEY_MENU", "KEY_DOWN", "KEY_RIGHT", "KEY_ENTER", "KEY_UP", "KEY_UP",             "KEY_ENTER", "KEY_RETURN", "KEY_RETURN", "KEY_RETURN"];


console.log("___ :" + Kino_Sound.length);
//setState('samsung_tizen.0.control.KEY_MENU',false);

function Sleep(milliseconds) {
 return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function xaction(myId, mySequence)
{

console.log( myId + "  : " + mySequence[0]);
for(let i = 0; i < mySequence.length; i++)
{
    console.log("___const " + mySequence[i]);
    //var test = "samsung_tizen.0.control." + Kino_Sound[0];
    //console.log("____string " + test);
    //setTimeout(function() {setState('samsung_tizen.0.control.' + Kino_Sound[i],false);}, 3000);
    setState('samsung_tizen.0.control.' + Kino_Sound[i],false); 
    await Sleep(2000);
};
}

on({id:"alias.0.Alexa.Fernseher_Kino",change:"any"}, function(obj) { xaction('___Kino_Sound', Normal_Sound); }); 
