(function () {
    function DefaultTagger() {
    }
    DefaultTagger.prototype = {
        tagForDate: function (aDate, aMoon) {
            var topTag = "";
            var tags = tagsForDate(aDate, aMoon);
            if (tags.length > 0) {
                topTag = tags[0];
                topTag = '<span class="tag ' + topTag[0] + '">' + topTag[1] + '</span>'; 
            }
            return topTag;
        },
    };
    
    function ModeTagger(aMode) {
        this.mode = aMode;
    }
    ModeTagger.prototype = {
        stringForDate: function (aDate, aMoon) {
            // 月表示の更新
            var jd  = juliusDate(aDate);
            switch (this.mode) {
                case "六輝":
                    return rokki(oldCalendar(jd));
                case "干支":
                    return eto(jd);
                case "九星":
                    return kyusei(jd);
                case "直":
                    return choku(jd);
                case "宿":
                    return shuku(oldCalendar(jd));
                case "納音":
                    return nattin(jd);
            }
        },
        tagForDate: function (aDate, aMoon) {
            return '<span class="tag">' + this.stringForDate(aDate, aMoon) + '</span>';
        },
    };
    
    function MonthlyCalendar(year, month) {
        this.year = year;
        this.month = month;
        this.moon = new Moon(year, month);

        var date = new Date(year, month);
        var weeks = [];
        var week = [];
        var dow = date.getDay();
        for (var i = 0; i < dow; ++i) {
            week.push(null); // 空欄
        }
        var month = date.getMonth();
        do {
            week.push(date);
            var kMSPerOneDay = 24 * 60 * 60 * 1000;
            var newDate = new Date();
            newDate.setTime(date.getTime() + kMSPerOneDay);
            date = newDate;
            if (date.getDay() == 0) {
                weeks.push(week);
                week = [];
            }
        } while (date.getMonth() == month);
        weeks.push(week);

        this.weeks = weeks;
    }

    MonthlyCalendar.forDate = function (date) {
        return new MonthlyCalendar(date.getFullYear(), date.getMonth());
    };
    MonthlyCalendar.prototype = {
        render: function (aTagger) {
            // TODO: もうちょっとモダンな実現方法にしたいな…
            var s = '<div class="week">';
            var dow = "日月火水木金土";
            for (var i = 0; i < dow.length; ++i) {
                s += '<div class="dayOfWeek">' + dow.charAt(i) + '</div>';
            }
            s += '</div>';
            var that = this;
            var today = new Date();
            this.weeks.forEach(function (week) {
                s += '<div class="week">';
                week.forEach(function (day) {
                    var clz = "dateContainer";
                    var date = "";
                    var link = "";
                    var topTag = "";
                    if (day) {
                        if (isSameDay(day, today)) {
                            clz += " today";
                        }
                        if (that.moon.fullmoonOf(day)) {
                            clz += " fullmoon";
                        }
                        if (that.moon.newmoonOf(day)) {
                            clz += " newmoon";
                        }
                        date = day.getDate();
                        var dateString = [that.year, that.month + 1, date].join('/');
                        link = 'href="index.html#' + dateString + '"';
                        topTag = aTagger.tagForDate(day, that.moon);
                    }
                    s += '<a class="' + clz + '" ' + link + '><div class="date">';
                    s += date;
                    s += '</div>';
                    s += topTag;
                    s += '</a>';
                });
                s += '</div>'
            });
            return s;
        },
    }

    function prev(e) {
        var y = month.year;
        var m = month.month - 1;
        if (m < 0) {
            --y;
            m += 12;
        }
        month = new MonthlyCalendar(y, m);
        update();
        e.preventDefault();
    }

    function next(e) {
        var y = month.year;
        var m = month.month + 1;
        if (m > 11) {
            ++y;
            m -= 12;
        }
        month = new MonthlyCalendar(y, m);
        update();
        e.preventDefault();
    }

    function heiseiYear(y) {
        return "平成" + (y - 1988) + "年";
    }
    function jaMonth(m) {
        var kJaNames = [
            "睦月",
            "如月",
            "弥生",
            "卯月",
            "皐月",
            "水無月",
            "文月",
            "葉月",
            "長月",
            "神無月",
            "霜月",
            "師走",
        ];
        return kJaNames[m];
    }

    function update() {
        document.getElementById("current").innerHTML = '<span class="keyNumber">' + month.year + '</span>年<span class="keyNumber">' + (month.month+1) + '</span>月';
        document.getElementById("jaYearMonth").innerHTML = heiseiYear(month.year) + " " + jaMonth(month.month);
        document.getElementById("monthlyCalendar").innerHTML = month.render(tagger);
    }

    var month;
    var tagger;
    function gotoMonthOfHash() {
        var date = new Date();
        var hash = parseHash(document.location.href);
        if (hash) {
            var comps = hash.split("/");
            while (comps.length < 3) {
                comps.push("1");
            }
            date = new Date(comps.join("/"));
        }
        month = MonthlyCalendar.forDate(date);
        update();
    }
    window.addEventListener('load', function () {
        tagger = new DefaultTagger();
        gotoMonthOfHash();

        document.getElementById("next").addEventListener("click", next, false);
        document.getElementById("prev").addEventListener("click", prev, false);
        
        document.getElementById("mode").addEventListener("change", function (e) {
            var newMode = e.target.value;
            tagger = (newMode == '') ? new DefaultTagger() : new ModeTagger(newMode);
            update();
        }, false);
    }, false);
    window.addEventListener("hashchange", function (e) {
        var hash = parseHash(e.newURL);
        if (hash) {
            gotoMonthOfHash();
        }
    });
})();
