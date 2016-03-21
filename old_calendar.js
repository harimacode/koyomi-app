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
    var z,f,aa,a,b,c,k,e;

    jd+=1; // JST
    z =Math.floor(jd);
    f =jd-z;
    aa=Math.floor((z-1867216.25)/36524.25);
    a =Math.floor(z+1+aa-Math.floor(aa/4));
    b =a+1524;
    c =Math.floor((b-122.1)/365.25);
    k =Math.floor(365.25*c);
    e =Math.floor((b-k)/30.6001);

    iDay=Math.floor(b-k-Math.floor(30.6001*e));
    if(e<13.5)  iMonth=e-1;
    else        iMonth=e-13;
    if(iMonth>2.5)  iYear=c-4716;
    else            iYear=c-4715;
    iHour  =Math.floor(f*24);
    iMinute=Math.floor((f*24-iHour)*60); // おそらく分までの精度しかない…
    return new Date(iYear, iMonth-1, iDay, iHour, iMinute);
}

/*!
 * JST のユリウス日から力学時を求めます。
 */
function dynamicalTime(juliusDateJST) {
    // 元とした文献と同様、協定世界時と力学時の誤差
    // ΔTについては無視しています。
    // 日本標準時からの時差-9時間を引いています。
    return juliusDateJST - (9/24);
}

/*!
 * @brief 与えられた力学時に対応する太陽黄経を計算します。
 * 
 * @param juliusDateDynamicalTime 力学時
 * @return 太陽黄経を表す浮動小数点数
 */
function solarEclipticLongitude(juliusDateDynamicalTime) {
    //    ｔ＝（JD+0.5-2451545.0）／36525
    var t = (juliusDateDynamicalTime + 0.5 - 2451545.0) / 36525;
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
        [-0.0048*t, 35999.05,   267.52],
        [1.9147,    35999.05,   267.52],
        [36000.7695*t,  0,  0],
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
    var t = (juliusDateDynamicalTime + 0.5 - 2451545.0) / 36525;
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
        [481267.8809 * t,   0,  0],
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
    var rv = 0;
    table.forEach(function (params) {
        var a = params[0];
        var k = params[1];
        var theta0 = params[2];
        var angle = normalizeAngle(k * t + theta0);
        rv += a * Math.cos(angle * Math.PI / 180.0); // 毎回計算するのが遅ければ Math.PI/180.0 は定数化する
    });
    return normalizeAngle(rv);
}
function normalizeAngle(angle) {
    while (angle < 0) {
        angle += 360;
    }
    while (angle >= 360) {
        angle -= 360;
    }
    return angle;
}

/**
 * 指定した日付の直前の二分二至(世間的には二至二分と呼ぶ場合が多いようですが)を求めます。
 * 
 * @param date
 */
function prevNibunNishi(t) {
    // var t = (juliusDateDynamicalTime + 0.5 - 2451545.0) / 36525;
    var sel = solarEclipticLongitude(t);
    // alert(sel);
    var div = Math.floor(sel / 90);
    var angle = div * 90;
    while (true) {
        var deltaAngle = sel - angle;
        if (deltaAngle >= 180) {
            deltaAngle = -360 + deltaAngle;
        }
        var deltaT = deltaAngle * 365.2 / 360;
        // alert("lambda sun: " + sel + ", deltaT: " + deltaT);
        t -= deltaT;
        if (deltaT < 0.00001157407407) {
            // 1s 未満
            break;
        }
        sel = solarEclipticLongitude(t);
    }
    // t が期待する時刻
    var jst = t + (9/24);
    return jst;
}

// precisely に比較する
function checkP(a, b) {
    return check(a, b, 0.00000000001);
}
// roughly に比較する
function checkR(a, b) {
    return check(a, b, 0.0001);
}
function check(a, b, tolerance) {
    var result = Math.abs(a - b) < tolerance;
    if (!result) {
        alert("FAILED: " + a + " !≒ " + b);
    }
}
function checkDate(a, b) {
    // 分までだけ比較する。
    var result = a.getFullYear() == b.getFullYear()
        && a.getMonth() == b.getMonth()
        && a.getDate() == b.getDate()
        && a.getHours() == b.getHours()
        && a.getMinutes() == b.getMinutes();
    if (!result) {
        alert("FAILED: " + a + " !≒ " + b);
    }
}
function testDynamicalTime() {
    // 1994年5月1日0時 = 2449472.625
    checkP(2449472.625, dynamicalTime(juliusDate(new Date(1994,4,1))));
    // 1994年11月 8日 16:00(JST)
    checkP(2449664.2916666665, dynamicalTime(juliusDate(new Date(1994,10,8,16,00))));
}
function testSolarEclipticLongitude() {
    // 1994年11月8日 16:00(JST)
    checkP(225.6456900296, solarEclipticLongitude(dynamicalTime(juliusDate(new Date(1994,10,8,16,00)))));
    
    // 文献中の例から。
    checkP(359.9999999299906, solarEclipticLongitude(2449431.85263434904943));
    checkP(21.16941167248130, solarEclipticLongitude(2449453.295651030494));
    checkP(50.09737887498562, solarEclipticLongitude(2449483.01263787953888));
    checkP(78.63143984057999, solarEclipticLongitude(2449512.7137218565143));
    checkP(106.9141295248953, solarEclipticLongitude(2449542.3526236737596));
    checkP(40.0342792282334200, solarEclipticLongitude(2449472.625));
}
function testLunarEclipticLongitude() {
    // FIXME: 精度が 0.0001 程度しかなく、低すぎる気がするので
    // 計算部分に見直しが必要かも。
    
    // 文献中の例から。
    checkR(93.93361186916204, lunarEclipticLongitude(2449431.85263434904943));
    checkR(24.23809602459182, lunarEclipticLongitude(2449453.295651030494));
    checkR(53.34937446649215, lunarEclipticLongitude(2449483.01263787953888));
    checkR(82.69589256228039, lunarEclipticLongitude(2449512.7137218565143));
    checkR(112.2766488159473, lunarEclipticLongitude(2449542.3526236737596));
}
function testJuliusDate() {
    // 1994年5月1日 ＝ 2449473
    checkP(2449473, juliusDate(new Date(1994,4,1))); // Date#month は 0 origin
    checkDate(new Date(1994,4,1), fromJuliusDate(2449473));
}
function testPrevNibunNishi() {
    checkR(2449432.2276343490000000, prevNibunNishi(2449472.625));
    checkDate(new Date(1994,2,21,5,27,48), fromJuliusDate(prevNibunNishi(2449472.625)))
}