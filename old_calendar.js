function HighPrecision(v1, v2) {
    if (typeof(v1) != "number") {
        this.value = [v1.value[0], v1.value[1]];
        return;
    }
    var i = Math.floor(v1);
    var f = v1 - i;
    if (typeof(v2) == "number") {
        var i2 = Math.floor(v2);
        var f2 = v2 - i2;
        i += i2;
        f += f2;
    }
    this.value = [i, f];
}
HighPrecision.prototype = {
    ensure: function (n) {
        if (typeof(n) == "number") {
            return new HighPrecision(n);
        }
        return n;
    },
    toNumber: function () {
        return this.value[0] + this.value[1];
    },
    plus: function (n) {
        n = this.ensure(n);
        return new HighPrecision(
            this.value[0] + n.value[0],
            this.value[1] + n.value[1]);
    },
    minus: function (n) {
        n = this.ensure(n);
        return new HighPrecision(
            this.value[0] - n.value[0],
            this.value[1] - n.value[1]);
    },
    multiply: function (f) {
        return new HighPrecision(
            this.value[0] * f,
            this.value[1] * f);
    },
    divide: function (f) {
        return new HighPrecision(
            this.value[0] / f,
            this.value[1] / f);
    },
};

/*!
 * Date オブジェクトからユリウス日を計算します。
 * ユリウス日は浮動小数点数として表現され、
 * 小数点以下の数字は時刻を表します。
 * 
 * この関数では、グレゴリオ暦による計数となるAD 1582年10月15日
 * 以降のみを対象とします。
 */
function juliusDate(date) {
    // TODO 上記値域判定
    var year  = date.getFullYear();
    var month = date.getMonth() + 1;
    var day   = date.getDate();
    var hours = date.getHours();
    if (month < 3) {
        month += 12;
        --year;
    }
    // alert(year + "/" + month + "/" + day);
    return Math.floor(365.25 * year)
         + Math.floor(year / 400)
         - Math.floor(year / 100)
         + Math.floor(30.59 * (month - 2))
         + day
         + 1721088
         + hours / 24;
}
function fromJuliusDate(jd) {
    // http://mysteryart.web.fc2.com/library/calsmpl/cldttojd.html
    jd+=1; // JST
    
    var z  = Math.floor(jd);
    var f  = jd-z;
    var aa = Math.floor((z-1867216.25)/36524.25);
    var a  = Math.floor(z+1+aa-Math.floor(aa/4));
    var b  = a+1524;
    var c  = Math.floor((b-122.1)/365.25);
    var k  = Math.floor(365.25*c);
    var e  = Math.floor((b-k)/30.6001);

    var day   = Math.floor(b-k-Math.floor(30.6001*e));
    var month = e - (e < 13.5 ? 1 : 13);
    var year  = c - (month > 2.5 ? 4716 : 4715);
    var hours   = Math.floor(f*24);
    var minutes = Math.floor((f*24-hours)*60); // おそらく分までの精度しかない…
    return new Date(year, month-1, day, hours, minutes);
}

/*!
 * JST のユリウス日から力学時を求めます。
 */
function dynamicalTime(juliusDateJST) {
    // 元とした文献と同様、協定世界時と力学時の誤差
    // ΔTについては無視しています。
    // 日本標準時からの時差-9時間を引いています。
    return new HighPrecision(juliusDateJST).minus(9/24);
}

/*!
 * @brief 与えられた力学時に対応する太陽黄経を計算します。
 * 
 * @param juliusDateDynamicalTime 力学時
 * @return 太陽黄経を表す浮動小数点数
 */
function solarEclipticLongitude(juliusDateDynamicalTime) {
    //    ｔ＝（JD+0.5-2451545.0）／36525
    var t = juliusDateDynamicalTime.plus(0.5).minus(2451545.0).divide(36525);
    //           18
    //    λsun＝Σ Ａ*ｃｏｓ（ｋ*ｔ+θ0）
    //           n=1
    var table = [
        [0.0004,    31557.0,    161.0],
        [0.0004,    29930.0,    48.0],
        [0.0005,    2281.0,     221.0],
        [0.0005,    155.0,      118.0],
        [0.0006,    33718.0,    316.0],
        [0.0007,    9038.0,     64.0],
        [0.0007,    3035.0,     110.0],
        [0.0007,    65929.0,    45.0],
        [0.0013,    22519.0,    352.0],
        [0.0015,    45038.0,    254.0],
        [0.0018,    445267.0,   208.0],
        [0.0018,    19.0,       159.0],
        [0.0020,    32964.0,    158.0],
        [0.0200,    71998.1,    265.1],
        [t.multiply(-0.0048), 35999.05,   267.52],
        [1.9147,    35999.05,   267.52],
        [t.multiply(36000.7695),  0,  0],
        [280.4659,      0,  0],
    ];
    return eclipticLongitude(table, t);
}

/*!
 * @brief 与えられた力学時に対応する月の黄経を計算します。
 * 
 * @param juliusDateDynamicalTime 力学時
 * @return 月の黄経を表す浮動小数点数
 */
function lunarEclipticLongitude(juliusDateDynamicalTime) {
    // TODO 共通化
    var t = juliusDateDynamicalTime.plus(0.5).minus(2451545.0).divide(36525);
    //           63
    //    λsun＝Σ Ａ*ｃｏｓ（ｋ*ｔ+θ0）
    //           n=1
    var table = [
        [0.0003,    2322131.0,  191.0],
        [0.0003,    4067.0,     70.0],
        [0.0003,    549197.0,   220.0],
        [0.0003,    1808933.0,  58.0],
        [0.0003,    349472.0,   337.0],
        [0.0003,    381404.0,   354.0],
        [0.0003,    958465.0,   340.0],
        [0.0004,    12006.0,    187.0],
        [0.0004,    39871.0,    223.0],
        [0.0005,    509131.0,   242.0],
        [0.0005,    1745069.0,  24.0],
        [0.0005,    1908795.0,  90.0],
        [0.0006,    2258267.0,  156.0],
        [0.0006,    111869.0,   38.0],
        [0.0007,    27864.0,    127.0],
        [0.0007,    485333.0,   186.0],
        [0.0007,    405201.0,   50.0],
        [0.0007,    790672.0,   114.0],
        [0.0008,    1403732.0,  98.0],
        [0.0009,    858602.0,   129.0],
        [0.0011,    1920802.0,  186.0],
        [0.0012,    1267871.0,  249.0],
        [0.0016,    1856938.0,  152.0],
        [0.0018,    401329.0,   274.0],
        [0.0021,    341337.0,   16.0],
        [0.0021,    71998.0,    85.0],
        [0.0021,    990397.0,   357.0],
        [0.0022,    818536.0,   151.0],
        [0.0023,    922466.0,   163.0],
        [0.0024,    99863.0,    122.0],
        [0.0026,    1379739.0,  17.0],
        [0.0027,    918399.0,   182.0],
        [0.0028,    1934.0,     145.0],
        [0.0037,    541062.0,   259.0],
        [0.0038,    1781068.0,  21.0],
        [0.0040,    133.0,      29.0],
        [0.0040,    1844932.0,  56.0],
        [0.0040,    1331734.0,  283.0],
        [0.0050,    481266.0,   205.0],
        [0.0052,    31932.0,    107.0],
        [0.0068,    926533.0,   323.0],
        [0.0079,    449334.0,   188.0],
        [0.0085,    826671.0,   111.0],
        [0.0100,    1431597.0,  315.0],
        [0.0107,    1303870.0,  246.0],
        [0.0110,    489205.0,   142.0],
        [0.0125,    1443603.0,  52.0],
        [0.0154,    75870.0,    41.0],
        [0.0304,    513197.9,   222.5],
        [0.0347,    445267.1,   27.9],
        [0.0409,    441199.8,   47.4],
        [0.0458,    854535.2,   148.2],
        [0.0533,    1367733.1,  280.7],
        [0.0571,    377336.3,   13.2],
        [0.0588,    63863.5,    124.2],
        [0.1144,    966404.0,   276.5],
        [0.1851,    35999.0,    87.53],
        [0.2136,    954397.7,   179.93],
        [0.6583,    890534.2,   145.7],
        [1.2740,    413335.3,   10.74],
        [6.2888,    477198.86,  44.963],
        [218.3162,          0,  0],
        [t.multiply(481267.8809),   0,  0],
    ];
    return eclipticLongitude(table, t);
}

/*!
 * @brief 与えられた天文時(もどき)に対応する黄経を計算します。
 * 
 * @param t 天文時(もどき)
 * @return 黄経を表す浮動小数点数
 */
function eclipticLongitude(table, t) {
    var rv = new HighPrecision(0);
    table.forEach(function (params) {
        var a = params[0];
        var k = params[1];
        var theta0 = params[2];
        var angle = normalizeAngle(t.multiply(k).plus(theta0));
        rv = rv.plus(new HighPrecision(a).multiply(Math.cos(angle.multiply(Math.PI).divide(180.0).toNumber()))); // 毎回計算するのが遅ければ Math.PI/180.0 は定数化する
    });
    return normalizeAngle(rv);
}
function normalizeAngle(angle) {
    while (angle.toNumber() < 0) {
        angle = angle.plus(360);
    }
    while (angle.toNumber() >= 360) {
        angle = angle.minus(360);
    }
    return angle;
}

/**
 * 指定した日付の直前の二分二至(世間的には二至二分と呼ぶ場合が多いようですが)を求めます。
 * 
 * @param date
 */
function findNibunNishi(t) {
    return findSekki(t, 90);
}

/**
 * 季節を求めます。春が0
 */
function findSeason(jd) {
    var sekki = findSekki(jd+1, 90, 45);
    angle = sekki[0];
    // alert(angle);
    angle += 45;
    while (angle >= 360) {
        angle -= 360;
    }
    var season = angle / 90;
    if (jd < Math.floor(sekki[1])) {
        --season;
    }
    return season;
}

/**
 * キャッシュクラス
 */
function Cache() {}
Cache.prototype = {
    get: function (key, missed) {
        if (typeof(this[key]) === 'undefined') {
            this[key] = missed(); 
        }
        return this[key];
    },
};

/**
 * @param t 直前の二分二至の時刻
 */
var chukisCache = new Cache();
function findChukis(t) {
    var key = Math.floor(t);
    return chukisCache.get(key, function () {
        var rv = [];
        for (var i = 0; i < 3; ++i) {
            var chuki = findSekki(t + 32, 30)[1];
            rv.push(chuki);
            t = chuki;
        }
        return rv; 
    });
}

/**
 * @return [angle, t] angle: 黄経, t: 節気
 */
function findSekki(t, byAngle, offset) {
    if (!offset) {
        offset = 0;
    }
    var dt = dynamicalTime(t);
    var sel = solarEclipticLongitude(dt).plus(offset);
    // alert(sel);
    var div = new HighPrecision(Math.floor(sel.divide(byAngle).toNumber()));
    var angle = div.multiply(byAngle);
    while (true) {
        var deltaAngle = sel.minus(angle);
        if (deltaAngle.toNumber() >= 180) {
            deltaAngle = deltaAngle.minus(360);
        }
        var deltaT = deltaAngle.multiply(365.2).divide(360);
        // alert("lambda sun: " + sel + ", deltaT: " + deltaT);
        dt = dt.minus(deltaT);
        if (Math.abs(deltaT.toNumber()) < 1 / (24 * 60 * 60)) {
            // 1s 未満
            break;
        }
        sel = solarEclipticLongitude(dt).plus(offset);
    }
    // t が期待する時刻
    var jst = dt.plus(9/24);
    return [normalizeAngle(angle.minus(offset)).toNumber(), jst.toNumber()];
}

/**
 * @param t 直前の二分二至の時刻
 */
function findSaku(t) {
    return findSakuBou(t, 0);
}
function findBou(t) {
    return [findSakuBou(t, -180), findSakuBou(t, 180)];
}
function findSakuBou(t, diff) {
    var dt = dynamicalTime(t);
    for (var i = 0; ; ++i) {
        var sel = solarEclipticLongitude(dt);
        var lel = lunarEclipticLongitude(dt);
        var deltaLambda = lel.minus(sel).plus(diff);
        if (i == 0 && deltaLambda.toNumber() < 0) {
            // alert([sel, lel, deltaLambda].join('\n'));
            deltaLambda = normalizeAngle(deltaLambda);
        }
        // ただし、春
        //        分の近くで朔がある場合（0°≦λsun≦ 20°）で、月の黄経λmoon≧300°
        //        の場合には以下のように補正を行ってΔλとする。

        //             Δλ＝ 360.0 － Δλ
        else if (0 <= sel.toNumber() && sel.toNumber() <= 20 && lel.toNumber() >= 300) {
            deltaLambda = new HighPrecision(360.0).minus(normalizeAngle(deltaLambda));
        }
        // TODO: 正規化の内容が不明だが必要
        //      また、Δλが引き込み範囲（±40°）を逸脱した場合には、正規化を行い
        //    Δλとする。
        else if (Math.abs(deltaLambda.toNumber()) > 40) {
            deltaLambda = normalizeAngle(deltaLambda);
        }
        // alert("moon: " + lel + "\n" +
        //         "sun:  " + sel + "\n" +
        //         "deltaLambda: " + deltaLambda);
        
        // TODO: 結果が振動して収束しないとき用の処理
        var deltaT = deltaLambda.multiply(29.530589).divide(360);
        dt = dt.minus(deltaT);
        // alert("dT: " + deltaT + ",\n t: " + t);
        if (Math.abs(deltaT.toNumber()) < 1 / (24 * 60 * 60)) {
            // 1s 未満
            break;
        }
    }
    // これはバグかと思ったが普通にあるよう
    // if (t < orig) {
    //     alert('bug');
    // }
    // t が期待する時刻
    var jst = dt.plus(9/24);
    return jst.toNumber();
}

/**
 * @param t 直前の二分二至の時刻
 */
var sakusCache = new Cache();
function findSakus(t) {
    var key = Math.floor(t);
    return sakusCache.get(key, function () {
        return findSakuBous(t, 0); 
    });
}
function findBous(t) {
    var rv = [];
    [-180, 180].forEach(function (diff) {
        findSakuBous(t, diff).forEach(function (bou) {
            rv.push(bou);
        });
    });
    return rv;
}
function findSakuBous(t, diff) {
    var nibunNishi = t;
    var rv = [];
    for (var i = 0; i < 5; ++i) {
        var saku = findSakuBou(t, diff);
        if (i != 0 && Math.abs(Math.floor(rv[rv.length - 1]) - Math.floor(saku)) <= 26) {
            t = rv[rv.length - 1] + 35;
            saku = findSakuBou(t, diff);
        }
        rv.push(saku);
        t = saku + 30;
    }
    
    if (diff) {
        return rv;
    }
    
    //   初期値の与え方によっては正規化を行っても目的にあった解を得る事ができず、
    //   朔日行列が正常に組み立てられない場合があります。 本スクリプトでは、以下の
    //   ２つのケースを想定して対策を施しておきました。
    if (Math.floor(rv[1]) <= Math.floor(nibunNishi)) {
        //      i   二分二至の前の朔の時刻を２組求めてしまう場合。以下の図ように、
        // alert("hit");
        rv.shift();
        rv.push(findSakuBou(rv[3] + 35, diff)); // 前の朔 + 35
    }
    // TODO: 文献の以下のケースへの対応
    else if (Math.floor(rv[0]) >= Math.floor(nibunNishi)) {
        //     ii   二分二至の後の朔の時刻を求めてしまう場合。以下の図ように、
        //    ［朔１の時刻］≧［直前の二分二至の時刻］
        rv.pop();
        rv.unshift(findSakuBou(rv[0] - 27, diff));
    }

    return rv;
}

function isSameDay(a, b) {
    // alert(a + ", " + b);
    if (a == null || b == null) {
        return false;
    }
    return a.getFullYear() == b.getFullYear() &&
        a.getMonth() == b.getMonth() &&
        a.getDate() == b.getDate();
}

// FIXME:
// http://www.hottatakeshi.com/moon.html
// のうち、以下の日付だけ正しく満月・新月が計算できていない
// 2007/09/27
// 2010/01/01

/**
 * Moon クラス
 */
function Moon(year, month) {
    var jd = juliusDate(this.lastDay(year, month));
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
}

Moon.prototype = {
    lastDay: function (y, m) {
        var nextDay = new Date(y, m + 1);
        var rv = new Date();
        rv.setTime(nextDay.getTime() - 24 * 60 * 60 * 1000);
        return rv;
    },
    fullmoonOf: function (date) {
        var rv = null;
        this.fullmoons.forEach(function (fullmoon) {
            if (isSameDay(date, fullmoon)) {
                rv = fullmoon;
            }
        });
        return rv;
    },
    newmoonOf: function (date) {
        var rv = null;
        this.newmoons.forEach(function (newmoon) {
            if (isSameDay(date, newmoon)) {
                rv = newmoon;
            }
        });
        return rv;
    },
};


function calcMoons(y, m) {
    
}

function oldMonth(el) {
    var months = [2, 5, 8, 11];
    return months[el / 90];
}

/**
 * OldDate クラス
 */
function OldDate(leap, month, day) {
    this.leap  = leap;
    this.month = month;
    this.day   = day;
}
OldDate.prototype = {
    toString: function () {
        var s = "";
        if (this.leap) {
            s += "閏";
        }
        s += this.month + "月";
        s += this.day   + "日";
        return s;
    },
};

/**
 * @param jd ユリウス日
 */
var bugAlerted = new Cache();
function oldCalendar(jd) {
    jd = Math.floor(jd);
    var gd = fromJuliusDate(jd);
    
    var nibunNishi = findNibunNishi(jd);
    // alert(nibunNishi); // OK
    var chukis = findChukis(nibunNishi[1]);
    // alert(chukis.join('\n')); // OK
    var sakus = findSakus(nibunNishi[1]);
    // alert(sakus.join('\n')); // OK
    var oMonth = oldMonth(nibunNishi[0]);
    // alert(oMonth);
    // MEMO: sakus[0] == oldMonth
    
    var matrix = [];
    sakus.forEach(function (saku) {
        var jd = Math.floor(saku);
        // 閏？, 旧暦の月, ユリウス日, グレゴリオ暦
        matrix.push([false, 0, jd, fromJuliusDate(jd)]);
    });
    var cond1 = sakus[4] <= chukis[2];
    chukis.push(nibunNishi[1]); // 二分二至も必ず中気なので中気判定に追加しています。
    for (var i = 0; i < matrix.length; ++i) {
        var start = matrix[i][2];
        var next  = 0;
        if (i + 1 < matrix.length) {
            next = matrix[i + 1][2];
        }
        var containsChuki = false;
        chukis.forEach(function (chuki) {
            var chukiDate = Math.floor(chuki);
            if (start <= chukiDate && (!next || chukiDate < next)) {
                containsChuki = true;
            }
        });
        var isLeapMonth = cond1 && !containsChuki;
        matrix[i][0] = isLeapMonth;
        if (isLeapMonth) {
            --oMonth;
        }
        matrix[i][1] = (oMonth - 1) % 12 + 1;
        ++oMonth;
    }
    
    var oldDate = new OldDate();
    for (var i = 0; i < matrix.length; ++i) {
        var nextDate = null;
        if (i + 1 < matrix.length) {
            nextDate = matrix[i + 1][3];
        }
        if (!nextDate || gd < nextDate) {
            oldDate.leap = matrix[i][0];
            oldDate.month = matrix[i][1];
            
            var oldDay = jd - matrix[i][2] + 1;
            oldDate.day = oldDay;
            break;
        }
    }
    if (typeof(oldDate.month) == "undefined") {
        // 2015/03/20,
        // 2017/09/20-22の旧暦が計算できていないよう
        bugAlerted.get(jd, function () {
            alert("旧暦計算に不具合があります:\n" + fromJuliusDate(jd).toLocaleDateString());
            return true;
        });
    }
    // alert(matrix.join('\n'));
    // alert(oldDate);
    return oldDate;
}

function rokki(oldDate) {
    var kRokki = [
        "先勝", "友引", "先負", "空亡", "大安", "赤口"
    ];
    return kRokki[(oldDate.month + oldDate.day - 2) % 6];
}

function eto(jd) {
    var kJikkan = "甲乙丙丁戊己庚辛壬癸";
    var kJunishi = "子丑寅卯辰巳午未申酉戌亥";
    // 1873年 1月12日 が甲子の基準日
    var days = Math.floor(jd) - Math.floor(juliusDate(new Date(1873, 0, 12)));
    return kJikkan[days % kJikkan.length] +
           kJunishi[days % kJunishi.length];
}

function kyusei(jd) {
    // 本実装では、主に以下を参照しました。
    // https://ja.wikipedia.org/wiki/%E4%B9%9D%E6%98%9F
    // http://koyomi.vis.ne.jp/doc/mlwa/200703270.htm
    var kKyuseis = [
        "一白", "二黒", "三碧", "四緑", "五黄", "六白", "七赤", "八白", "九紫",        
    ];
    jd = Math.floor(jd);
    // 対象の日を含む二至
    var nishi = findSekki(jd+1, 180, 90);
    // 次の二至
    var theOther = findSekki(nishi[1]+240, 180, 90);
    // alert(nishi);
    // alert(theOther);
    
    var days;
    var d1 = Math.floor(nishi[1]);
    while (eto(d1) != "甲子") {
        --d1;
    }
    days = Math.floor(nishi[1]) - d1;
    if (days > 29) {
        d1 += 60; // 基準日
    }
    
    var d2 = Math.floor(theOther[1]);
    while (eto(d2) != "甲子") {
        --d2;
    }
    days = Math.floor(theOther[1]) - d2;
    if (days > 29) {
        d2 += 60; // 基準日
    }
    
    var diff = d2 - d1;
    days = jd - d1;
    
    var isYouton = nishi[0] == 270;
    var i = isYouton ? 0 : 8;
    var dir = isYouton ? +1 : -1;
    if (diff == 180) {
    } else if (diff == 240) {
        // alert("特殊ケース:" + fromJuliusDate(d1+180+30));
        // 今回の陽遁・陰遁の長さが 240 日になる場合、
        // 最後の 60 日は閏となり
        // 特に最後の 30 日は次の陰遁・陽遁の一部になります。
        // 特別扱いが必要なのはこの最後の 30 日だけです。
        if (180 + 30 <= days) {
            days -= 240 + 1; // days はマイナスになる
            i = isYouton ? 6 : 2;
        }
    } else {
        alert("想定外のエラー:" + fromJuliusDate(jd));
    }
    
    i += days * dir;
    while (i < 0) {
        i += kKyuseis.length;
    }
    // alert(i);
    return kKyuseis[i % kKyuseis.length];
}

function findSetsugetsu(jd) {
    // findSekki() は「前」の日付を探しに行くため、当日も含めるには +1 する
    // 必要があります。
    // FIXME: 元にしたスクリプトの仕様に引きずられている部分…
    jd = Math.floor(jd) + 1;
    var sekki = findSekki(jd, 30, 15);
    return [(normalizeAngle(new HighPrecision(sekki[0] + 15)).toNumber() / 30 + 1) % 12 + 1, sekki[1]]
}

function choku(jd) {
    // 正月 寅 	二月 卯 	三月 辰 	四月 巳
    // 五月 午 	六月 未 	七月 申 	八月 酉
    // 九月 戌 	十月 亥 	十一月 子 	十二月 丑
    var kEto = "寅卯辰巳午未申酉戌亥子丑";
    var kChokus = "建除満平定執破危成納開閉";
    var s = findSetsugetsu(jd);
    var etoToFind = kEto[s[0]-1];
    // alert(fromJuliusDate(s[1]));
    // alert(s[0] + "=>" + etoToFind);
    var first = Math.floor(s[1]);
    for (var i = 0; i < kEto.length; ++i) {
        if (etoToFind == eto(first + i).charAt(1)) {
            // ここで first + i が建となる日
            var ken = first + i;
            // alert(fromJuliusDate(ken));
            var days = Math.floor(jd) - ken;
            while (days < 0) {
                days += kChokus.length;
            }
            // alert(days);
            return kChokus[days % kChokus.length];
        }
    }
    // alert("NG");
}

function shuku(oldDate) {
    var kShukus = "角亢氐房心尾箕斗女虚危室壁奎婁胃昴畢觜参井鬼柳星張翼軫";
    var kStarts = "室奎胃畢参鬼張角氐心斗虚";
    var start = kStarts.charAt(oldDate.month - 1);
    var i = kShukus.indexOf(start);
    i += oldDate.day - 1;
    return kShukus[i % kShukus.length];
}

function nattin(jd) {
    var kNattins = [
        "海中金", "爐中火", "大林木", "路傍土", "釼鋒金",
        "山頭火", "澗下水", "城頭土", "白鑞金", "楊柳木",
        "井泉水", "屋上土", "霹靂火", "松柏木", "長流水",
        "沙中金", "山下火", "平地木", "壁上土", "金箔金",
        "覆燈火", "天河水", "大駅土", "釵釧金", "桑柘木",
        "大溪水", "沙中土", "天上火", "柘榴木", "大海水",        
    ];
    // FIXME: 甲子の日を求めるのが非効率なロジック…
    var kousi = jd;
    while (eto(kousi) != "甲子") {
        --kousi;
    }
    return kNattins[Math.floor((jd - kousi) / 2)];
}

/**
 * 本日が二十四節気の切り替わり日ならその節気を返す。
 */
function nijuShisekki(jd) {
    jd = Math.floor(jd);
    var kSekkis = [
        "春分", "清明", "穀雨", "立夏", "小満", "芒種",
        "夏至", "小暑", "大暑", "立秋", "処暑", "白露",
        "秋分", "寒露", "霜降", "立冬", "小雪", "大雪",
        "冬至", "小寒", "大寒", "立春", "雨水", "啓蟄",
    ];
    var sekki = findSekki(jd+1, 15);
    // alert(sekki);
    if (Math.floor(sekki[1]) == jd) {
        return kSekkis[sekki[0] / 15];
    }
    return "";
}

function isIchiryuManbai(jd) {
    var kEtosForSetsugetsu = [
        "丑午", "酉寅", "子卯", "卯辰", "巳午", "酉午",
        "子未", "卯申", "酉午", "酉戌", "亥子", "卯子",
    ];
    var s = findSetsugetsu(jd);
    var etos = kEtosForSetsugetsu[s[0]-1];
    var todayJunishi = eto(jd)[1];
    return etos.indexOf(todayJunishi) > -1;
}
function isTensya(jd) {
    var kEtoForSeason = [
        "戊寅", "甲午", "戊申", "甲子"
    ];
    var etoToFind = kEtoForSeason[findSeason(jd)];
    return eto(jd) == etoToFind;
}
function isFujoju(oldDate) {
    var kFujojus = [
        [3, 11, 19, 27],
        [2, 10, 18, 26],
        [1,  9, 17, 25],
        [4, 12, 20, 28],
        [5, 13, 21, 29],
        [6, 14, 22, 30],
    ];
    var days = kFujojus[(oldDate.month - 1) % 6];
    if (typeof(days) === "undefined") {
        // FIXME: 月表示が更新されないよりはマシな動作に調整中。
        return false;
    }
    return days.indexOf(oldDate.day) > -1;
}
function isSanrinbou(jd) {
    var kEtoForSetsugetsu = "亥寅午亥寅午亥寅午亥寅午";
    var s = findSetsugetsu(jd);
    var etoToFind = kEtoForSetsugetsu[s[0]-1];
    var todayJunishi = eto(jd)[1];
    return etoToFind === todayJunishi;
}

function sekku(date) {
    var kSekkus = [
        [[1, 7], "七草"],
        [[3, 3], "雛祭"],
        [[5, 5], "端午"],
        [[7, 7], "七夕"],
        [[9, 9], "重陽"],
    ];
    var rv = "";
    kSekkus.forEach(function (aSekku) {
        var sekkuDate = aSekku[0];
        if (date.getMonth() + 1 == sekkuDate[0] &&
            date.getDate()      == sekkuDate[1])
        {
            rv = aSekku[1];
        }
    });
    return rv;
}

// precisely に比較する
function checkP(a, b) {
    return checkFloat(a, b, 0.00000000001);
}
// roughly に比較する
function checkR(a, b) {
    return checkFloat(a, b, 0.0001);
}
function checkFloat(a, b, tolerance) {
    var result = Math.abs(a - b) < tolerance;
    check(result, a, b);
}
function checkBool(a, b) {
    check(a == b, a, b);
}
function checkDate(a, b) {
    // 分までだけ比較する。
    var result = a.getFullYear() == b.getFullYear()
        && a.getMonth() == b.getMonth()
        && a.getDate() == b.getDate()
        && a.getHours() == b.getHours()
        && a.getMinutes() == b.getMinutes();
    check(result, a, b);
}
function checkStr(a, b) {
    check(a === b, a, b);
}
function check(result, a, b) {
    if (!result) {
        alert("FAILED: " + a + " !≒ " + b);
    }
}
function testDynamicalTime() {
    // 1994年5月1日0時 = 2449472.625
    checkP(2449472.625, dynamicalTime(juliusDate(new Date(1994,4,1))).toNumber());
    // 1994年11月 8日 16:00(JST)
    checkP(2449664.2916666665, dynamicalTime(juliusDate(new Date(1994,10,8,16,00))).toNumber());
}
function testSolarEclipticLongitude() {
    // 1994年11月8日 16:00(JST)
    checkP(225.6456900296, solarEclipticLongitude(dynamicalTime(juliusDate(new Date(1994,10,8,16,00)))).toNumber());
    
    // 文献中の例から。
    checkP(359.9999999299906, solarEclipticLongitude(new HighPrecision(2449431.85263434904943)).toNumber());
    checkP(21.16941167248130, solarEclipticLongitude(new HighPrecision(2449453.295651030494)).toNumber());
    checkP(50.09737887498562, solarEclipticLongitude(new HighPrecision(2449483.01263787953888)).toNumber());
    checkP(78.63143984057999, solarEclipticLongitude(new HighPrecision(2449512.7137218565143)).toNumber());
    checkP(106.9141295248953, solarEclipticLongitude(new HighPrecision(2449542.3526236737596)).toNumber());
    checkP(40.0342792282334200, solarEclipticLongitude(new HighPrecision(2449472.625)).toNumber());
}
function testLunarEclipticLongitude() {
    // FIXME: 精度が 0.0001 程度しかなく、低すぎる気がするので
    // 計算部分に見直しが必要かも。
    
    // 文献中の例から。
    checkR(93.93361186916204, lunarEclipticLongitude(new HighPrecision(2449431.85263434904943)).toNumber());
    checkR(24.23809602459182, lunarEclipticLongitude(new HighPrecision(2449453.295651030494)).toNumber());
    checkR(53.34937446649215, lunarEclipticLongitude(new HighPrecision(2449483.01263787953888)).toNumber());
    checkR(82.69589256228039, lunarEclipticLongitude(new HighPrecision(2449512.7137218565143)).toNumber());
    checkR(112.2766488159473, lunarEclipticLongitude(new HighPrecision(2449542.3526236737596)).toNumber());
}
function testJuliusDate() {
    // 1994年5月1日 ＝ 2449473
    checkP(2449473, juliusDate(new Date(1994,4,1))); // Date#month は 0 origin
    checkDate(new Date(1994,4,1), fromJuliusDate(2449473));
    checkP(2446056, juliusDate(new Date(1984,11,22))); // Date#month は 0 origin
}
function testFindNibunNishi() {
    checkR(2449432.2276343490000000, findNibunNishi(2449472.625)[1]);
    checkDate(new Date(1994,2,21,5,27,48), fromJuliusDate(findNibunNishi(2449472.625)[1]))
    checkR(2446056.0489, findNibunNishi(juliusDate(new Date(1984,11,23)))[1]);
}
function testFindSeason() {
    checkP(3, findSeason(juliusDate(new Date(2016, 1, 3))));
    checkP(0, findSeason(juliusDate(new Date(2016, 1, 4))));  // 2016年2月4日 は春
    checkP(0, findSeason(juliusDate(new Date(2016, 4, 4))));
    checkP(1, findSeason(juliusDate(new Date(2016, 4, 5))));  // 2016年5月5日 は夏
    checkP(1, findSeason(juliusDate(new Date(2016, 7, 6))));
    checkP(2, findSeason(juliusDate(new Date(2016, 7, 7))));  // 2016年8月7日 は秋
    checkP(2, findSeason(juliusDate(new Date(2016, 10, 6))));
    checkP(3, findSeason(juliusDate(new Date(2016, 10, 7)))); // 2016年11月7日 は冬
}
function testFindChukis() {
    var result = findChukis(2449432.2276343490);
    var answers = [
        2449462.6910369310000,
        2449493.6580418450000,
        2449524.9906033690000,
    ];
    for (var i = 0; i < answers.length; ++i) {
        checkR(answers[i], result[i]);
    } 
    
    var result2 = findChukis(findNibunNishi(juliusDate(new Date(1993,4,1)))[1]);
    var answers2 = [
        2449097.4502,
        2449128.4174,
        2449159.7497,
    ];
    for (var i = 0; i < answers2.length; ++i) {
        checkR(answers2[i], result2[i]);
    } 

}
function testFindSaku() {
    var saku = findSaku(2449431.85263434904943); 
    checkR(2449423.6706510314940, saku);
    // alert(fromJuliusDate(saku));
    
    var sakus = findSakus(2449431.85263434904943);
    var answers = [
        2449423.6706510314940,
        2449453.3876378879538,
        2449483.0887218565143,
        2449512.7276236737596,
        2449542.2768841335603,
    ];
    for (var i = 0; i < answers.length; ++i) {
        checkR(answers[i], sakus[i]);
    } 

    var sakus2 = findSakus(findNibunNishi(juliusDate(new Date(1993,4,1)))[1]);
    var answers2 = [
        2449039.9209,
        2449069.6773,
        2449099.3680,
        2449128.9637,
        2449158.4540,
    ];
    for (var i = 0; i < answers2.length; ++i) {
        checkR(answers2[i], sakus2[i]);
    }
    
    var sakus3 = findSakus(findNibunNishi(juliusDate(new Date(1985,0,1)))[1]);
    var answers3 = [
        2446056.8671,
        2446086.4793,
        2446116.1560,
        2446145.8755,
        2446175.6000,
    ];
    for (var i = 0; i < answers3.length; ++i) {
        checkR(answers3[i], sakus3[i]);
    } 
}
function testOldCalendar() {
    // 1994年5月1日
    checkStr("3月21日", oldCalendar(juliusDate(new Date(1994,4,1))).toString());
    // 1993年5月1日
    checkStr("閏3月10日", oldCalendar(juliusDate(new Date(1993,4,1))).toString());
    // 1985年1月1日
    checkStr("11月11日", oldCalendar(juliusDate(new Date(1985,0,1))).toString());
    // alert(oldCalendar(juliusDate(new Date(2012,0,1))));
    
    // // 2002-2021 年元日 は http://www.ajnet.ne.jp/diary/ との一致を確認
    // var dates = [];
    // for (var y = 2002; y < 2051; ++y) {
    //     dates.push(y + ':' + oldCalendar(juliusDate(new Date(y,0,1))));
    // }
    // alert(dates.join('\n'));
    
    // 2016 年については正しい旧暦が得られていることを確認
    // var dates = [];
    // var jd = juliusDate(new Date(2016,6,1));
    // for (var i = 0; i < 200; ++i) {
    //     var d = fromJuliusDate(jd + i);
    //     var s = (d.getMonth()+1) + "/" + d.getDate();
    //     dates.push(s + '=>' + oldCalendar(jd + i));
    // }
    // alert(dates.join('\n'));
    checkStr("8月1日", oldCalendar(juliusDate(new Date(2017,8,20))).toString());
}
function testRokki() {
    checkStr("先勝", rokki(new OldDate(false, 3, 17)));
    checkStr("友引", rokki(new OldDate(false, 3, 18)));
    checkStr("先負", rokki(new OldDate(false, 3, 19)));
    checkStr("空亡", rokki(new OldDate(false, 3, 20)));
    checkStr("大安", rokki(new OldDate(false, 3, 21)));
    checkStr("赤口", rokki(new OldDate(false, 3, 22)));
    checkStr("先勝", rokki(new OldDate(false, 3, 23)));
    checkStr("先勝", rokki(new OldDate(true, 3, 23))); // 閏月も同じだったはず
}
function testEto() {
    // 1873年 1月12日 が甲子の基準日
    checkStr("甲子", eto(juliusDate(new Date(1873,0,12))));
    checkStr("丁巳", eto(juliusDate(new Date(2014,3,16))));
    checkStr("戊午", eto(juliusDate(new Date(2014,3,17))));
    checkStr("己未", eto(juliusDate(new Date(2014,3,18))));
    checkStr("庚申", eto(juliusDate(new Date(2014,3,19))));
}
function testKyusei() {
    checkStr("六白", kyusei(juliusDate(new Date(2014,3,16))));
    checkStr("七赤", kyusei(juliusDate(new Date(2014,3,17))));

    checkStr("八白", kyusei(juliusDate(new Date(2008,11,18))));
    checkStr("七赤", kyusei(juliusDate(new Date(2008,11,19))));
    checkStr("七赤", kyusei(juliusDate(new Date(2008,11,20))));
    checkStr("八白", kyusei(juliusDate(new Date(2008,11,21))));

    checkStr("二黒", kyusei(juliusDate(new Date(1997,5,19))));
    checkStr("三碧", kyusei(juliusDate(new Date(1997,5,20))));
    checkStr("三碧", kyusei(juliusDate(new Date(1997,5,21))));
    checkStr("二黒", kyusei(juliusDate(new Date(1997,5,22))));

    // var r = [];    
    // for (var i = 0; i < 6; ++i) {
    //     r.push(kyusei(juliusDate(new Date(1997,5,18+i))));
    // }
    // alert(r);
}
function testFindSetsugetsu() {
    var s;
    // 2016年3月20日=春分→2月節、3/5
    s = findSetsugetsu(juliusDate(new Date(2016,2,20)));
    checkP(2, s[0]); // 2月節
    checkDate(new Date(2016,2,5), fromJuliusDate(Math.floor(s[1]))); // 3/5
    
    // 2016年4月20日=穀雨→3月節、4/4
    s = findSetsugetsu(juliusDate(new Date(2016,3,20)));
    checkP(3, s[0]); // 3月節
    checkDate(new Date(2016,3,4), fromJuliusDate(Math.floor(s[1]))); // 4/4
    
    // 2016年3月4日=1月節,2/4
    s = findSetsugetsu(juliusDate(new Date(2016,2,4)));
    checkP(1, s[0]); // 2月節
    checkDate(new Date(2016,1,4), fromJuliusDate(Math.floor(s[1]))); // 2/4
    // 2016年3月5日=2月節,3/5
    s = findSetsugetsu(juliusDate(new Date(2016,2,5)));
    checkP(2, s[0]); // 2月節
    checkDate(new Date(2016,2,5), fromJuliusDate(Math.floor(s[1]))); // 3/5
}
function testChoku() {
    checkStr("除", choku(juliusDate(new Date(2014,3,16))));
    checkStr("危", choku(juliusDate(new Date(2014,4,4))));
    checkStr("危", choku(juliusDate(new Date(2014,4,5))));
    checkStr("除", choku(juliusDate(new Date(2014,3,16,12)))); // jd が整数とならないパターン
}
function testShuku() {
    checkStr("心", shuku(oldCalendar(juliusDate(new Date(2014,3,16)))));
    checkStr("尾", shuku(oldCalendar(juliusDate(new Date(2014,3,17)))));
    checkStr("参", shuku(oldCalendar(juliusDate(new Date(2014,4,1)))));
    checkStr("房", shuku(oldCalendar(juliusDate(new Date(2014,4,12)))));
    checkStr("心", shuku(oldCalendar(juliusDate(new Date(2014,4,13)))));
}
function testNattin() {
    checkStr("沙中土", nattin(juliusDate(new Date(2014,3,16))));
    checkStr("天上火", nattin(juliusDate(new Date(2014,3,17))));
}
function testNijuShisekki() {
    checkStr("", nijuShisekki(juliusDate(new Date(2014,4,4))));
    checkStr("立夏", nijuShisekki(juliusDate(new Date(2014,4,5))));
    checkStr("", nijuShisekki(juliusDate(new Date(2014,4,6))));
}
function testIsIchiryuManbai() {
    // 2016/1/7 は一粒万倍日
    checkBool(false, isIchiryuManbai(juliusDate(new Date(2016,0,6))));
    checkBool(true,  isIchiryuManbai(juliusDate(new Date(2016,0,7))));
    checkBool(false, isIchiryuManbai(juliusDate(new Date(2016,0,8))));
    
    checkBool(true,  isIchiryuManbai(juliusDate(new Date(2016,0,10)))); // 2016/1/10 も
}
function testIsTensya() {
    checkBool(false, isTensya(juliusDate(new Date(2016, 1, 25))));
    checkBool(true,  isTensya(juliusDate(new Date(2016, 1, 26))));
    checkBool(false, isTensya(juliusDate(new Date(2016, 1, 27))));
}
function testIsFujoju() {
    // 2016/01/08 は不成就日
    checkBool(false, isFujoju(oldCalendar(juliusDate(new Date(2016, 0, 7)))));
    checkBool(true,  isFujoju(oldCalendar(juliusDate(new Date(2016, 0, 8)))));
    checkBool(false, isFujoju(oldCalendar(juliusDate(new Date(2016, 0, 9)))));
}
function testIsSanrinbou() {
    // 2016/1/13は三輪宝
    checkBool(false, isSanrinbou(juliusDate(new Date(2016, 0, 12))));
    checkBool(true,  isSanrinbou(juliusDate(new Date(2016, 0, 13))));
    checkBool(false, isSanrinbou(juliusDate(new Date(2016, 0, 14))));
}

function runTests() {
    testJuliusDate();
    testDynamicalTime();
    testSolarEclipticLongitude();
    testLunarEclipticLongitude();
    testFindNibunNishi();
    testFindSeason();
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
    testIsIchiryuManbai();
    testIsTensya();
    testIsFujoju();
    testIsSanrinbou();
}
