function set(id, value) {
    document.getElementById(id).innerHTML = value;
}
function dayOfWeek(dow) {
    return "日月火水木金土".charAt(dow);
}
function update() {
    // 月表示の更新
    var month = date.getMonth() + 1;
    var yearMonth = [date.getFullYear(), month].join("/"); 
    document.getElementById("gotoMonth").innerHTML = '<a href="month.html#' + yearMonth + '">&lt; '+ month +'月</a>';
    
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
    markItems([newEto.charAt(0), newEto.charAt(1), // 十干、十二支
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

var date;
function today() {
    date = new Date();
    update();
}
function gotoDaysAfter(n) {
    var ms = date.getTime();
    ms += n * 24 * 60 * 60 * 1000;
    date.setTime(ms);
    update();
}
function gotoDate(s) {
    date = new Date(s);
    update();
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
window.addEventListener("load", function (e) {
    var hash = parseHash(document.location.href);
    if (hash) {
        gotoDate(hash);
    } else {
        today();
    }
    
    document.getElementById("today").addEventListener("click", today);
    document.getElementById("tomorrow").addEventListener("click", function () {
        gotoDaysAfter(1);
    });
    document.getElementById("yesterday").addEventListener("click", function () {
        gotoDaysAfter(-1);
    });
    
    // runTests();
}, false);
window.addEventListener("hashchange", function (e) {
    var oldHash = parseHash(e.oldURL);
    if (oldHash) {
        var oldBox = document.getElementById(oldHash);
        if (oldBox) {
            removeClass(oldBox, "marked");
        }
    }
    var newHash = parseHash(e.newURL);
    if (newHash) {
        if (newHash.indexOf("/") > -1) {
            // 日付指定
            gotoDate(newHash);
        } else {
            // マーク
            var newBox = document.getElementById(newHash);
            if (newBox) {
                addClass(newBox, "marked");
            }
        }
    }
}, false);

