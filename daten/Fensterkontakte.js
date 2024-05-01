schedule('* * * * *', fenster_offen)

var string = 'open'

function fenster_offen(){
  log("Liste der Fenster und Status:");
  var windows = getObject("enum.functions.EG_Fenster").common.members;
  for(let i = 0; i < windows.length; i++) {
    var string = 'closed';
    var Status = getState(windows[i]).val;
    if (Status) string = 'open';
    log(windows[i] + " " + Status + '____ open/closed : ' + string);
//    var Data = JSON.parse(Status);
//    log('____ : ' + JSON.stringify(Data));
};
}
