(function () {
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
        document.getElementById("gotoMonth").innerHTML = '<a href="month.html#' + yearMonth + '">&lt; <span class="keyNumber">'+ month +'</span>月</a>';
        
        var month = date.getMonth() + 1; // 月は 0 始まり
        var dateString = "";
        dateString += '<span class="keyNumber">' + month + '</span>月';
        dateString += '<span class="keyNumber">' + date.getDate() + '</span>日';
        dateString += '<span class="dayOfWeek' + date.getDay() + '">(' + dayOfWeek(date.getDay()) + ')</span>';
        set("date", dateString);
        var jd  = juliusDate(date);
        var old = oldCalendar(jd);
        set('oldDate', '旧暦 ' + old);
        var newRokki = rokki(old);
        set('rokki', newRokki);
        var newEto = eto(jd);
        set('eto', newEto);
        var newKyusei = kyusei(jd);
        set('kyusei', newKyusei);
        var newChoku = choku(jd);
        set('choku', newChoku);
        var newShuku = shuku(old);
        set('shuku', newShuku);
        set('nattin', nattin(jd));
        var tags = [];
        tagsForDate(date).forEach(function (tag) {
            var tagText = tag[1];
            var isFullmoon = tag[0] === "fullmoon";
            var isNewmoon  = tag[0] === "newmoon";
            if (isFullmoon || isNewmoon) {
                var time = tag[2];
                var mark = isFullmoon ? "○" : "●";
                var h = time.getHours();
                // XXX どうも正確な計算と2分だけずれているようなので、ここで2分足しています。
                // FIXME ずれている原因が分かったらこのごまかしを消す。
                //
                // dynamicalTime にする/戻す時に閏秒が考慮されていないことが原因のよう
                // ただ、旧暦計算の参考にしたアルゴリズム全体がそれを無視する前提に
                // 立っていたため、そこだけ調整すると期待値が総崩れになる。
                // 後ほど、より高精度な天体計算ライブラリを連れてくるつもりがあり、
                // その際にきちんと修正することにする。
                var workaround = time.getMinutes() - 2;
                if (workaround < 0) {
                    workaround += 60;
                    h += 24 - 1;
                    h %= 24;
                }
                var m = ("0" + workaround).substr(-2);
                tagText += mark + h + ":" + m;
            } else if (tag[0] == "sekku" &&
                     !(tag[1] == "雛祭" || tag[1] == "七夕"))
            {
                tagText += "の節句";
            }
            tags.push('<span class="tag ' + tag[0] + '">' + tagText + '</span>'); 
        });
        set('tags', tags.join(" ･ "));
        
        // 今解説に表がある項目について、マーカー表示します。
        markItems([newRokki, // 六輝
            newEto.charAt(0), newEto.charAt(1), // 十干、十二支
            newKyusei, // 九星
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
    function next(e) {
        gotoDaysAfter(1);
        e.preventDefault();
    }
    function prev(e) {
        gotoDaysAfter(-1);
        e.preventDefault();
    }
    function gotoDaysAfter(n) {
        var ms = date.getTime();
        ms += n * 24 * 60 * 60 * 1000;
        date.setTime(ms);
        update();
    }
    function gotoDate(s) {
        date = new Date(s);
        if (s.indexOf("/") < 0) {
            // 有効な Date String でない場合ハングするので
            // ここで today に差し替えています。
            date = new Date();
        }
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
        document.getElementById("next").addEventListener("click", next);
        document.getElementById("prev").addEventListener("click", prev);
        
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
})();
