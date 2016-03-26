function set(id, value) {
    document.getElementById(id).innerText = value;
}
function dayOfWeek(dow) {
    return "日月火水木金土".charAt(dow);
}
function main() {    
    var today = new Date(); //new Date(2014,3,16);
    var month = today.getMonth() + 1; // 月は 0 始まり
    set("date", month + '/' + today.getDate());
    set('dayOfWeek', dayOfWeek(today.getDay()));
    var jd  = juliusDate(today);
    var old = oldCalendar(jd);
    set('oldCalendar', old);
    set('rokki', rokki(old));
    set('animalSymbols', eto(jd));
    set('kyusei', kyusei(jd));
    set('choku', choku(jd));
    set('shuku', shuku(old));
    set('nattin', nattin(jd));
    
    testJuliusDate();
    testDynamicalTime();
    testSolarEclipticLongitude();
    testLunarEclipticLongitude();
    testFindNibunNishi();
    testFindChukis();
    testFindSaku();
    testOldCalendar();
    testRokki();
    testEto();
    testKyusei();
    testFindSetsugetsu();
    testChoku();
    testShuku();
    testNattin();
    testNijuShisekki();
}
