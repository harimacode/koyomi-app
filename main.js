function set(id, value) {
    document.getElementById(id).innerHTML = value;
}
function dayOfWeek(dow) {
    return "日月火水木金土".charAt(dow);
}
function main() {    
    var today = new Date(); //new Date(2014,3,16);
    var month = today.getMonth() + 1; // 月は 0 始まり
    set("date", '<span class="month">' + month + '</span>月<span class="day">' + today.getDate() + '</span>日(' + dayOfWeek(today.getDay()) + ')');
    var jd  = juliusDate(today);
    var old = oldCalendar(jd);
    set('oldDate', '旧暦 ' + old);
    set('rokki', rokki(old));
    set('eto', eto(jd));
    set('kyusei', kyusei(jd));
    set('choku', choku(jd));
    set('shuku', shuku(old));
    set('nattin', nattin(jd));
    set('nijuShisekki', nijuShisekki(jd) + "　");
    
    // runTests();
}
