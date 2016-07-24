var Hammer = require("./hammer.min.js");
var React = require("react");
var ReactDOM = require("react-dom");
var Button = require("./Button.jsx");
var OldDateMonth = require("./OldDateMonth.jsx");
var oc = require("./harima-koyomi/old_calendar.js");
var common = require("./common.js");

function DefaultTagger() {
}
DefaultTagger.prototype = {
    tagForDate: function (aDate, aMoon) {
        var topTag = "";
        var tags = oc.tagsForDate(aDate, aMoon);
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
        var jd  = oc.juliusDate(aDate);
        switch (this.mode) {
            case "六輝":
                return oc.rokki(oc.oldCalendar(jd));
            case "干支":
                return oc.eto(jd);
            case "九星":
                return oc.kyusei(jd);
            case "直":
                return oc.choku(jd);
            case "宿":
                return oc.shuku(oc.oldCalendar(jd));
            case "納音":
                return oc.nattin(jd);
        }
    },
    hueForString: function (aString) {
        var all = null;
        switch (this.mode) {
            case "六輝": all = oc.allRokkis(); break;
            case "干支": all = oc.allEtos(); break;
            case "九星": all = oc.allKyuseis(); break;
            case "直": all = oc.allChokus(); break;
            case "宿": all = oc.allShukus(); break;
            case "納音": all = oc.allNattins(); break;
        }
        return 360 * all.indexOf(aString) / all.length;
    },
    tagForDate: function (aDate, aMoon) {
        var s = this.stringForDate(aDate, aMoon);
        var hue = this.hueForString(s);
        return '<span class="tag" style="background-color: hsl(' + hue + ', 100%, 93%);">' + s + '</span>';
    },
};

function MonthlyCalendar(year, month) {
    this.year = year;
    this.month = month;
    this.moon = new oc.Moon(year, month);

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
                    if (oc.isSameDay(day, today)) {
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

function renderOldDateMonth(props) {
    if (!props.date) {
        props.date = new Date();
    }
    if (!props.subtitle) {
        props.subtitle = "";
    }
    ReactDOM.render(
        <OldDateMonth type="month"
                      date={props.date}
                      subtitle={props.subtitle}
                      onPrevClick={prev}
                      onNextClick={next} />,
        document.getElementById("old-date-month")
    );
}
renderOldDateMonth({});

function update() {
    renderOldDateMonth({
        date: new Date(month.year, month.month),
        subtitle: oc.heiseiYear(month.year) + " " + oc.jaMonth(month.month)
    });
    
    var newMode = document.getElementById("mode").value;
    var tagger = (newMode == "") ? new DefaultTagger() : new ModeTagger(newMode);
    document.getElementById("monthlyCalendar").innerHTML = month.render(tagger);
}

var month;
function gotoMonthOfHash() {
    var date = new Date();
    var hash = common.parseHash(document.location.href);
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
    common.addClass(document.getElementById("koyomi"), "month");
    gotoMonthOfHash();

    Array.prototype.forEach.call(document.querySelectorAll(".gotoCurrent"), function (aElt) {
        aElt.addEventListener("click", function () {
            month = MonthlyCalendar.forDate(new Date());
            update();
        }, false);
    });
    
    document.getElementById("mode").addEventListener("change", update, false);
}, false);
window.addEventListener("hashchange", function (e) {
    var hash = common.parseHash(e.newURL);
    if (hash) {
        gotoMonthOfHash();
    }
});

var hammer = new Hammer(window);     
hammer.on("swipe", function (ev) {
    if (ev.distance < 75) {
        return;
    }
    switch (ev.direction) {
    case Hammer.DIRECTION_LEFT:
        next(ev);
        break;
    case Hammer.DIRECTION_RIGHT:
        prev(ev);
        break;
    }
});
