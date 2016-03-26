function set(id, value) {
    document.getElementById(id).innerHTML = value;
}
function dayOfWeek(dow) {
    return "日月火水木金土".charAt(dow);
}
function update() {
    var month = date.getMonth() + 1; // 月は 0 始まり
    var dateString = "";
    dateString += '<span class="month">' + month + '</span>月';
    dateString += '<span class="day">' + date.getDate() + '</span>日';
    dateString += '<span class="dayOfWeek' + date.getDay() + '">(' + dayOfWeek(date.getDay()) + ')</span>';
    set("date", dateString);
    var jd  = juliusDate(date);
    var old = oldCalendar(jd);
    set('oldDate', '旧暦 ' + old);
    set('rokki', rokki(old));
    set('eto', eto(jd));
    set('kyusei', kyusei(jd));
    set('choku', choku(jd));
    set('shuku', shuku(old));
    set('nattin', nattin(jd));
    set('nijuShisekki', nijuShisekki(jd) + "　");
}
function today() {
    date = new Date();
    update();
}
function tomorrow() {
    var ms = date.getTime();
    ms += 24 * 60 * 60 * 1000;
    date.setTime(ms);
    update();
}
function yesterday() {
    var ms = date.getTime();
    ms -= 24 * 60 * 60 * 1000;
    date.setTime(ms);
    update();
}
var date;
function main() {
    today();
    
    // runTests();
}

function parseHash(url) {
    return decodeURIComponent(url.split('#')[1]);
}
function addClass(e, cls) {
    var a = e.getAttribute("class");
    var classes = a ? a.split(' ') : [];
    classes.push(cls);
    e.setAttribute("class", classes.join(' '));
}
function removeClass(e, cls) {
    var newClasses = [];
    var a = e.getAttribute("class");
    var classes = a ? a.split(' ') : [];
    classes.forEach(function (c) {
        if (c != cls) {
            newClasses.push(c);
        }
    });
    e.setAttribute("class", newClasses.join(' '));
}
window.addEventListener("hashchange", function (e) {
    var oldBox = document.getElementById(parseHash(e.oldURL));
    removeClass(oldBox, "marked");
    var newBox = document.getElementById(parseHash(e.newURL));
    addClass(newBox, "marked");
}, true);
