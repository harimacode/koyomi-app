(function () {
    // FIXME:
    // http://www.hottatakeshi.com/moon.html
    // のうち、以下の日付だけ正しく満月・新月が計算できていない
    // 2007/09/27
    // 2010/01/01

    function lastDay(y, m) {
        var nextDay = new Date(y, m + 1);
        var rv = new Date();
        rv.setTime(nextDay.getTime() - 24 * 60 * 60 * 1000);
        return rv;
    }

    function MonthlyCalendar(year, month) {
        this.year = year;
        this.month = month;

        var date = new Date(year, month);
        var jd = juliusDate(lastDay(year, month));
        var newmoons = [];
        findSakus(jd).forEach(function (saku) {
            newmoons.push(fromJuliusDate(saku));
        });
        this.newmoons = newmoons;
        var fullmoons = [];
        findBous(jd).forEach(function (bou) {
            fullmoons.push(fromJuliusDate(bou));
        });
        // alert(fullmoons.join("\n"));
        this.fullmoons = fullmoons;

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
        isSameDay: function (a, b) {
            // alert(a + ", " + b);
            if (a == null || b == null) {
                return false;
            }
            return a.getFullYear() == b.getFullYear() &&
                a.getMonth() == b.getMonth() &&
                a.getDate() == b.getDate();
        },
        render: function () {
            // TODO: もうちょっとモダンな実現方法にしたいな…
            var s = '<div class="week">';
            var dow = "日月火水木金土";
            for (var i = 0; i < dow.length; ++i) {
                s += '<div class="dayOfWeek">' + dow.charAt(i) + '</div>';
            }
            s += '</div>';
            var that = this;
            this.weeks.forEach(function (week) {
                s += '<div class="week">';
                week.forEach(function (day) {
                    var clz = "dateContainer";
                    var date = "";
                    var link = "";
                    if (day) {
                        that.fullmoons.forEach(function (fullmoon) {
                            if (that.isSameDay(day, fullmoon)) {
                                clz += " fullmoon";
                            }
                        });
                        that.newmoons.forEach(function (newmoon) {
                            if (that.isSameDay(day, newmoon)) {
                                clz += " newmoon";
                            }
                        });
                        date = day.getDate();
                        var dateString = [that.year, that.month + 1, date].join('/');
                        link = 'href="index.html#' + dateString + '"';
                    }
                    s += '<a class="' + clz + '" ' + link + '><div class="date">';
                    s += date;
                    s += '</div></a>';
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
        document.getElementById("current").innerHTML = '<span class="year">' + month.year + '</span>年<span class="month">' + (month.month+1) + '</span>月';
        document.getElementById("jaYearMonth").innerHTML = heiseiYear(month.year) + " " + jaMonth(month.month);
        document.getElementById("monthlyCalendar").innerHTML = month.render();
    }

    var month;
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
        gotoMonthOfHash();

        document.getElementById("next").addEventListener("click", next);
        document.getElementById("prev").addEventListener("click", prev);
    }, false);
    window.addEventListener("hashchange", function (e) {
        var hash = parseHash(e.newURL);
        if (hash) {
            gotoMonthOfHash();
        }
    });
})();
