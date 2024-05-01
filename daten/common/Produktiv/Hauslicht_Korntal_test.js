var id1 = 'alias.0.Motion_Detector.EG_Hausflur_Motion'
var id2 = 'alias.0.Motion_Detector.OG_Hausflur_Motion'
 
function onChange() {
   var val1 = getState(id1).val;
   var val2 = getState(id2).val;
   console.log(id1 +  ' = ' + val1 + '; ' + id2 + ' = ' + val2);
}
 
on(id1, onChange);
on(id2, onChange);
 
