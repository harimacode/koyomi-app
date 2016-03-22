function set(id, value) {
    document.getElementById(id).innerText = value;
}
function dayOfWeek(dow) {
    return "日月火水木金土".charAt(dow);
}
function main() {    
    var today = new Date();
    var month = today.getMonth() + 1; // 月は 0 始まり
    set("date", month + '/' + today.getDate());
    set('dayOfWeek', dayOfWeek(today.getDay()));
    set('oldCalendar', oldCalendar(juliusDate(today)));
    
    testJuliusDate();
    testDynamicalTime();
    testSolarEclipticLongitude();
    testLunarEclipticLongitude();
    testFindNibunNishi();
    testFindChukis();
    testFindSaku();
    testOldCalendar();
}
