var Hammer = require("./hammer.min.js");
var React = require('react');
var ReactDOM = require('react-dom');
var oc = require("./harima-koyomi/old_calendar.js");
var common = require("./common.js");
var Button = require("./Button.jsx");
var OldDateMonth = require("./OldDateMonth.jsx");

function renderOldDateMonth(props) {
    if (!props.date) {
        props.date = new Date();
    }
    if (!props.subtitle) {
        props.subtitle = "旧暦 0月0日"; 
    }
    return ReactDOM.render(
        <OldDateMonth type="date"
                      date={props.date}
                      subtitle={props.subtitle}
                      onPrevClick={prev}
                      onCurrentClick={today}
                      onNextClick={next} />,
        document.getElementById("old-date-month")
    );
}
renderOldDateMonth({});

var kExplanations = [
    {
        name: "六輝",
        description: "諸葛孔明が<strong>戦略</strong>として伝え、江戸時代流行し今も人気。(仏滅を空亡としています)", 
        items: [
            ["先勝", "せんがち", "戦いは朝から昼までよし。午前中は吉。"],
            ["友引", "ともびき", "勝負のつかない日。朝晩、夕方は吉。"],
            ["先負", "せんまけ", "戦いは昼過ぎより日暮れまでよし。午後は吉。"],
            ["空亡", "くうぼう", "仏滅。全てがむなしくなる日。戦えば失うものが多い。"],
            ["大安", "たいあん", "大安吉日なり。何事によらずよし。"],
            ["赤口", "しゃっく", "赤口神が民を悩ます日。特に祝い事に凶事あり。午前11時から午後１時までの時間帯のみは吉で、それ以外は凶。"],
        ],
    },
    {
        name: "干支",
        description: "木の幹にあたる”十干”と枝にあたる”十二支”を合わせて<strong>状態</strong>を表すものです。",
        items: [
            ["甲", "きのえ", "草木の芽生え、鱗芽のかいわれの象意"],
            ["乙", "きのと", "陽気のまだ伸びない、かがまっているところ"],
            ["丙", "ひのえ", "陽気の発揚"],
            ["丁", "ひのと", "陽気の充溢"],
            ["戊", "つちのえ", "“茂”に通じ、陽気による分化繁栄"],
            ["己", "つちのと", "紀に通じ、分散を防ぐ統制作用"],
            ["庚", "かのえ", "結実、形成、陰化の段階"],
            ["辛", "かのと", "陰による統制の強化"],
            ["壬", "みずのえ", "“妊”に通じ、陽気を下に姙む意"],
            ["癸", "みずのと", "“揆”に同じく生命のない残物を清算して地ならしを行い、新たな生長を行う待機の状態"],
        ],
        items2: [
            ["子", "ね", "“孳”で、陽気が色々に発現しようとする動き"],
            ["丑", "うし", "“紐”で、生命エネルギーの様々な結合"],
            ["寅", "とら", "“演”で、形をとっての発生"],
            ["卯", "う", "同音“冒”に通じ、開発の意"],
            ["辰", "たつ", "“震”、同音“申”に同じ、生の活動"],
            ["巳", "み", "“已”に通じ、陽盛の極、漸く陰に移ろうとする所"],
            ["午", "うま", "“忤(さからう)”に通じ、上昇する陰と下退する陽との抵触"],
            ["未", "ひつじ", "“昧”で、陰気の支配"],
            ["申", "さる", "陰気の支配"],
            ["酉", "とり", "酒熟して気の漏れる象。陰気の熟する所"],
            ["戌", "いぬ", "同音“恤”であり、“滅”である。統一退蔵。"],
            ["亥", "い", "“核”で、生命の完全な収蔵含蓄"],
        ],
        cite: "(表は <a href='https://ja.wikipedia.org/wiki/%E5%B9%B2%E6%94%AF#.E5.8D.81.E5.B9.B2'>干支 - Wikipedia</a> より引用)",
    },
    {
        name: "九星",
        description: "運命の流れの数学的な基本概念を表すガイドとして<strong>紫白</strong>九星(七色星)を採用。",
        items: [
            [["一白", "一白水星"], null, "祓いに強力に作用する吉日。凶神である大将軍や金神のもたらす厄を霊的に抑えることができる。"],
            [["二黒", "二黒土星"], null, ""],
            [["三碧", "三碧木星"], null, ""],
            [["四緑", "四緑木星"], null, ""],
            [["五黄", "五黄土星"], null, ""],
            [["六白", "六白金星"], null, "祓いに強力に作用する吉日。凶神である大将軍や金神のもたらす厄を霊的に抑えることができる。"],
            [["七赤", "七赤金星"], null, ""],
            [["八白", "八白土星"], null, "祓いに強力に作用する吉日。凶神である大将軍や金神のもたらす厄を霊的に抑えることができる。"],
            [["九紫", "九紫火星"], null, "祓いに強力に作用する吉日。凶神である大将軍や金神のもたらす厄を霊的に抑えることができる。"],
        ],
    },
    {
        name: "直",
        description: "十二直。北斗七星信仰に由来するもので、<strong>吉凶</strong>がよくあたると重宝されています。",
        items: [
            ["建", "たつ", "万物の立て生ずる日。土を動かし、大金を支払うは凶。"],
            ["除", "のぞく", "万物を祓う故、のぞくと言う。厄を祓うに吉。百凶を除き去る。婚礼・井戸掘りに向かず。"],
            ["満", "みつ", "天の宝を満る故、みつるという。神事に吉。土を動かすに凶。"],
            ["平", "たいら", "万物を平分する日。満れば、すなわち平となる。不足なく良き日なり。"],
            ["定", "さだん", "大忌みという。祈祷に吉。平なれば定まる。山あり谷ありは安定を欠く。"],
            ["執", "とる", "定まれば、すなわち取る。定まらぬものを取るに過ちあり。立てるに凶。壊すに吉。"],
            ["破", "やぶる", "築けば、すなわち破る。壊すに吉。邪気を祓い祟りを祈るに吉。この日、戦えば、必ず傷付くと言う。"],
            ["危", "あやぶ", "すでに破れば、すでに危うし。無分別の状態にあり。高き所の登るは凶。"],
            ["成", "なる", "よく危ぶ時は、すなわち成る。万事必ず成就する時。争い事には凶。木を切るに吉。"],
            ["納", "おさん", "すでに成らば、すなわち、納む。この神の来る日は、開くの神が来たりて、福を授ける。"],
            ["開", "ひらく", "納むれば、すなわち、開くを良しとす。蔵を開くに吉。道を開く日。"],
            ["閉", "とず", "開くこと、もっぱらであれば、あるものもなく、閉ずこともまた必要なる。陰気の気が閉じ塞がる日。"],
        ],
    },
    {
        name: "宿",
        description: "インド由来の古法二十七宿を採用。<strong>星々</strong>に対応し<strong>様々</strong>な吉凶判断にも用います。",
        items: [
            // 東方の蒼竜七宿
            ["角", "かく", "物事を始めるに吉。葬式・心の問題に凶事あり。"],
            ["亢", "こう", "婚礼、取引、交渉に吉。建築など土に凶事あり。"],
            ["氐", "てい", "転居・転職に吉。家の増改築などにに凶・水難あり。"],
            ["房", "ぼう", "神事に吉。隠し事に凶事あり。"],
            ["心", "しん", "神事、旅行に吉。葬儀・埋葬に凶事あり。盗難の相。"],
            ["尾", "び", "話し合い・薬に吉。衣類裁断・不注意の厄あり。"],
            ["箕", "き", "金運に吉。身内との間に凶事。婚礼大凶。"],
            // 北方の玄武六宿
            ["斗", "と", "種まきに吉。この日動けば凶事あり。"],
            ["女", "じょ", "武器作り・紙すき・神参りに吉。概ね凶事日なり。"],
            ["虚", "きょ", "智を得ることに吉。造作すれば厄あり。"],
            ["危", "き", "目上の者に従う時は吉。衣類裁断・移転に凶事あり。"],
            ["室", "しつ", "造作・近き方に吉あり。遠方に凶事あり。仏事に凶。"],
            ["壁", "へき", "子孫繁栄に吉。南方に凶事あり。"],
            // 西方の白虎七宿
            ["奎", "けい", "婚礼、棟上げに吉。交渉に凶事あり。"],
            ["婁", "ろう", "衣類裁断すれば寿命増す。博打に凶事あり。"],
            ["胃", "い", "婚礼・造作・公事に吉あり。衣類裁断・私事は凶事あり。"],
            ["昴", "ぼう", "祈願に吉。土を動かすに凶事あり。"],
            ["畢", "ひつ", "神事・祭礼に吉あり。特に婚礼に凶あり。"],
            ["觜", "し", "仕事始めに吉。造作に用いれば家財失う。"],
            ["参", "しん", "財宝・養子・遠出に吉。新しきことに凶事あり。"],
            // 南方の朱雀七宿
            ["井", "せい", "種まき・神事に吉。衣類裁断すれば離婚の相あり。"],
            ["鬼", "き", "万事に大吉。ただし婚礼は凶事あり。"],
            ["柳", "りゅう", "物事を断るに吉。葬儀に不幸あり。"],
            ["星", "せい", "治療に吉。婚礼・葬式・種まきに凶事あり。"],
            ["張", "ちょう", "養蚕に吉。木を切れば厄あり。"],
            ["翼", "よく", "旅立ちに吉。婚礼は離婚の相あり。"],
            ["軫", "しん", "万事に吉。ただし、衣類裁断すれば火難あり。"],
        ],
    },
    {
        name: "納音",
        description: "物事の吉凶(人の気の現出)が変動するときに出る音のことで、<strong>兆し</strong>を読みます。",
        items: [
            ["海中金", "かいちゅうのこん", "表に出るべきものの、海中に閉ざされる兆し。"],
            ["爐中火", "ろちゅうのか", "燃え上がる炎のごとく、運気の上がる兆し。"],
            ["大林木", "たいりんのもく", "多くの木々は茂り、森を成す兆し。"],
            ["路傍土", "ろぼうのど", "今は路傍の土なれど、やがて日の目を見るの兆し。"],
            ["剣鋒金", "けんぼうのこん", "物事の極みにありて、最後の人手を探るものありとの兆し。"],
            ["山頭火", "さんとうのか", "はげ山に火事ありて、焼き尽くすべき勢いも、無き兆し。"],
            ["澗下水", "かんげのすい", "水の尽きること無く、溢れ出づる兆し。"],
            ["城頭土", "じょうとうのど", "運に勢い有るの兆し。"],
            ["白蝋金", "はくろうのこん", "水で鍛うれば、形、整うの兆し。"],
            ["楊柳木", "ようりゅうのもく", "今は勢いを失うの兆し。"],
            ["井泉水", "いせんのすい", "小さき井戸なれども、水の満ちる兆し。"],
            ["屋上土", "おくじょうのど", "土の気の塞がる兆し。"],
            ["霹靂火", "へきれきのか", "晴天の霹靂を見るも、変化せずの兆し。"],
            ["松柏木", "しょうはくのもく", "雲を突き、そびえ立つの兆し。春を待つに勢いあり。"],
            ["長流水", "ちょうりゅうのすい", "水の流れの絶えることなく、流るる川の兆し。"],
            ["沙中金", "さちゅうのこん", "砂の内に秘める金の兆し。目立つ時は光を放ち、動かぬ時は、砂にまぎれる。"],
            ["山下火", "さんげのか", "ただ燃えるがごとく、広がり伸べる兆し。"],
            ["平地木", "へいちのもく", "淋しくたたずむ、ひとつの木の兆し。"],
            ["壁上土", "へきじょうのど", "壁の上の土は、もはや、土にあらず。土の力を失う兆し。"],
            ["金箔金", "きんぱくのこん", "死滅の兆し。金も使い道を誤れば、かえってその力を失う。"],
            ["覆燈火", "ふくとうのか", "倒れたる灯籠の灯りは、夜を照らさずの兆し。"],
            ["天河水", "てんがのすい", "豊なる水の流れ。人に徳を施し、福をもたらすの兆し。"],
            ["大駅土", "だいえきのど", "大きなる 駅 に人馬の行き交うの兆し。"],
            ["剣釧金", "けんせんのこん", "万物の乱れの、防ぎありの兆し。"],
            ["桑柘木", "そうたくのもく", "絶えて春を待つの兆し。やがて、成長せし木々あり。"],
            ["大渓水", "たいけいのすい", "勢い盛んな水の気の兆し。"],
            ["沙中土", "さちゅうのど", "砂の中の土の兆し。役立たぬこと多し。"],
            ["天上火", "てんじょうのか", "天地に光りあるの兆し。"],
            ["柘榴木", "ざくりゅうのもく", "外に現れず、内に秘めたる兆し。"],
            ["大海水", "たいかいのすい", "天に連なる、大海の水の兆し。"],
        ],
    },
];
function makeExplanations() {
    var sections = [];
    kExplanations.forEach(function (aExplanation) {
        var name = aExplanation.name;
        var section = [
            '<h2 id="' + name + '">' + name + '</h2>',
            '<p>' + aExplanation.description + '</p>',
        ];
        var tables = [aExplanation.items];
        if (aExplanation.items2) {
            tables.push(aExplanation.items2);
        }
        tables.forEach(function (aTable) {
            section.push('<table>');
            aTable.forEach(function (aItem) {
                var title = aItem[0];
                if (!Array.isArray(title)) {
                    title = [title, title];
                }
                var reading = aItem[1];
                var desc = aItem[2];
                var id = name + '_' + title[0];
                var titleHtml = '<span id="' + id + '">' + title[1] + '</span>';
                if (reading) {
                    titleHtml = '<div class="ruby">' + reading + '</div>' + titleHtml;
                }
                section.push('<tr><th>' + titleHtml + '</th><td>' + desc + '</td></tr>');
            });
            section.push('</table>');
        });
        var cite = aExplanation.cite;
        if (cite) {
            section.push('<p><cite>' + cite + '</cite></p>');
        }
        sections.push(section.join('\n'));
    });
    return sections.join('\n<hr>\n');
}

function set(id, value) {
    document.getElementById(id).innerHTML = value;
}
function sets(clazz, value) {
    Array.prototype.forEach.call(document.querySelectorAll("." + clazz), function (e) {
        e.innerHTML = value;
    });
}
function update() {
    // 月表示の更新
    var month = date.getMonth() + 1;
    var yearMonth = [date.getFullYear(), month].join("/"); 
    document.getElementById("gotoMonth").innerHTML = '<a href="month.html#' + yearMonth + '">&lt; <span class="keyNumber">'+ month +'</span>月</a>';
    
    var month = date.getMonth() + 1; // 月は 0 始まり
    var jd  = oc.juliusDate(date);
    var old = oc.oldCalendar(jd);
    renderOldDateMonth({
        date: date,
        subtitle: '旧暦 ' + old
    });
    var newRokki = oc.rokki(old);
    sets('rokki', newRokki);
    var newEto = oc.eto(jd);
    sets('eto', newEto);
    var newKyusei = oc.kyusei(jd);
    sets('kyusei', newKyusei);
    var newChoku = oc.choku(jd);
    sets('choku', newChoku);
    var newShuku = oc.shuku(old);
    sets('shuku', newShuku);
    var newNattin = oc.nattin(jd);
    sets('nattin', newNattin);
    var tags = [];
    oc.tagsForDate(date).forEach(function (tag) {
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
        } else if (tag[1].indexOf("天天上") == 0) {
            tagText = tag[1].substr(0, 1) + "一" + tag[1].substr(1);
        }
        tags.push('<span class="tag ' + tag[0] + '">' + tagText + '</span>'); 
    });
    set('tags', tags.join(" ･ "));
    
    // 今解説に表がある項目について、マーカー表示します。
    markItems([["六輝", newRokki], // 六輝
        ["干支", newEto.charAt(0)], ["干支", newEto.charAt(1)], // 十干、十二支
        ["九星", newKyusei], // 九星
        ["直", newChoku], ["宿", newShuku], ["納音", newNattin]]); // 直、宿、納音
}

var marked;
function markItems(toBeMarked) {
    if (marked) {
        marked.forEach(function (item) {
            common.removeClass(item, "marked");
        });
    }
    marked = [];
    toBeMarked.forEach(function (item) {
        var e = document.getElementById(item.join("_"));
        common.addClass(e, "marked");
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
    history.replaceState(null, null, window.location.href.split("#")[0]);
}

function ScrollAnimation(aSeconds, aTo) {
    this.mDuration = 1000 * aSeconds;
    this.mFrom = window.pageYOffset;
    this.mTo   = aTo;
    this.mFps = 60;
}
ScrollAnimation.prototype = {
    start: function () {
        this.mStart = new Date().getTime();
        var that = this;
        setTimeout(function () {
            that.update();
        }, 1000 / this.mFps);
    },
    update: function () {
        var now = new Date().getTime();
        var t = (now - this.mStart) / this.mDuration;
        if (t > 1) {
            t = 1;
        }
        var distance = this.mTo - this.mFrom;
        var y = this.mFrom + distance * this.easeInOutQuad(t);
        window.scroll(window.pageXOffset, y);
        
        if (t < 1) {
            var that = this;
            setTimeout(function () {
                that.update();
            }, 1000 / this.mFps);
        }
    },
    // https://gist.github.com/gre/1650294
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
};

function jumpToHash(aHash) {
    Array.prototype.forEach.call(document.querySelectorAll("h2.marked"), function (aMarked) {
        common.removeClass(aMarked, "marked");
    });
    var newBox = document.getElementById(aHash);
    if (newBox) {
        common.addClass(newBox, "marked");
    }
    var tbHeight = document.getElementById("toolbar").getBoundingClientRect().height;
    var newY = newBox.getBoundingClientRect().top + window.pageYOffset;
    
    new ScrollAnimation(0.25, newY - tbHeight * 1.25).start();
}
function gotoTop(e) {
    e.preventDefault();
    new ScrollAnimation(0.25, 0).start();
}
window.addEventListener("load", function (e) {
    common.removeClass(document.getElementById("koyomi"), "month");
    document.getElementById("explanation").innerHTML = makeExplanations();
    
    var hash = common.parseHash(document.location.href);
    if (hash) {
        gotoDate(hash);
    } else {
        today();
    }
    
    document.getElementById("today").addEventListener("click", today, false);

    Array.prototype.forEach.call(document.querySelectorAll("a.box"), function (aBox) {
        aBox.addEventListener("click", function (e) {
            var hash = common.parseHash(aBox.getAttribute("href"));
            if (hash) {
                e.preventDefault();
                jumpToHash(hash);
            }
        }, false);
    });
    
    // runTests();
}, false);
window.addEventListener("hashchange", function (e) {
    var hash = common.parseHash(e.newURL);
    if (hash) {
        if (hash.indexOf("/") > -1) {
            // 日付指定
            gotoDate(hash);
        } else {
            // マーク
            jumpToHash(hash);
        }
    }
}, false);
window.addEventListener("scroll", function (e) {
    var tb = document.getElementById("toolbar");
    var tagsTop = document.getElementById("tags").getBoundingClientRect().top;
    common.removeClass(tb, "visible");
    if (tagsTop < 0) {
        common.addClass(tb, "visible");
    }
}, false);

new Hammer(window).on("swipe", function (ev) {
    if (ev.distance < 75) {
        return;
    }
    var dateBottom = document.getElementById("date").getBoundingClientRect().bottom;
    if (dateBottom < 0) {
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

// ReactDOM.render(
//     <Button title="&laquo;" onClick={prev}/>,
//     document.getElementById("prev")
// );
// ReactDOM.render(
//     <Button title="&raquo;" onClick={next} />,
//     document.getElementById("next")
// );
ReactDOM.render(
    <Button title="△" onClick={gotoTop} />,
    document.getElementById("top-container")
);
