function MonthlyCalendar(year, month) {
    this.year = year;
    this.month = month;

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
    render: function () {
        // TODO: もうちょっとモダンな実現方法にしたいな…
        var s = '<tr>';
        var dow = "日月火水木金土";
        for (var i = 0; i < dow.length; ++i) {
            s += '<th>' + dow.charAt(i) + '</th>';
        }
        s += '</tr>';
        this.weeks.forEach(function (week) {
            s += '<tr>';
            week.forEach(function (day) {
                s += '<td><span class="date">';
                if (day) {
                    s += day.getDate();
                } else {
                    s += "";
                }
                s += '</span></td></a>';
            });
            s += '</tr>'
        });
        return s;
    },
}

function prev() {
    var y = month.year;
    var m = month.month - 1;
    if (m < 0) {
        --y;
        m += 12;
    }
    month = new MonthlyCalendar(y, m);
    update();
}

function next() {
    var y = month.year;
    var m = month.month + 1;
    if (m > 11) {
        ++y;
        m -= 12;
    }
    month = new MonthlyCalendar(y, m);
    update();
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
function main2() {
    month = MonthlyCalendar.forDate(new Date());
    update();

    document.getElementById("tomorrow").addEventListener("click", function () {
        next();
    });
    document.getElementById("yesterday").addEventListener("click", function () {
        prev();

    });
}
window.addEventListener('load', main2, false);
