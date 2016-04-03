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
    var newRokki = rokki(old);
    set('rokki', newRokki);
    var newEto = eto(jd);
    set('eto', newEto);
    set('kyusei', kyusei(jd));
    var newChoku = choku(jd);
    set('choku', newChoku);
    var newShuku = shuku(old);
    set('shuku', newShuku);
    set('nattin', nattin(jd));
    set('nijuShisekki', nijuShisekki(jd) + "　");
    
    // 今解説に表がある項目について、マーカー表示します。
    markItems([newRokki, // 六輝
        newEto.charAt(0), newEto.charAt(1), // 十干、十二支
        newChoku, newShuku]); // 直、宿
}

var marked;
function markItems(toBeMarked) {
    if (marked) {
        marked.forEach(function (item) {
            removeClass(item, "marked");
        });
    }
    marked = [];
    toBeMarked.forEach(function (item) {
        var e = document.getElementById(item);
        addClass(e, "marked");
        marked.push(e);
    });
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
    var parts = url.split('#');
    if (parts.length < 2) {
        return null;
    }
    return decodeURIComponent(parts[1]);
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
    var oldHash = parseHash(e.oldURL);
    if (oldHash) {
        var oldBox = document.getElementById(oldHash);
        removeClass(oldBox, "marked");
    }
    var newHash = parseHash(e.newURL);
    if (newHash) {
        var newBox = document.getElementById(newHash);
        addClass(newBox, "marked");
    }
}, true);
