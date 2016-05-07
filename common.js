function parseHash(url) {
    var parts = url.split('#');
    if (parts.length < 2) {
        return null;
    }
    return decodeURIComponent(parts[1]);
}
function tagsForDate(date, moon) {
    var jd = juliusDate(date);
    var tags = [];
    var newSekku = sekku(date);
    if (newSekku) {
        tags.push(["sekku", newSekku]);
    }
    var newNijuShisekki = nijuShisekki(jd);
    if (newNijuShisekki) {
        tags.push(["nijuShisekki", newNijuShisekki]);
    }
    if (isSetsubun(jd)) {
        tags.push(["zassetsu", "節分"]);
    }
    if (isHachijuHachiya(jd)) {
        tags.push(["zassetsu", "八十八夜"]);
    }
    if (isNyubai(jd)) {
        tags.push(["zassetsu", "入梅"]);
    }
    if (isHangesyo(jd)) {
        tags.push(["zassetsu", "半夏生"]);
    }
    if (isSyunsya(jd)) {
        tags.push(["zassetsu", "社日(春)"]);
    }
    if (isSyusya(jd)) {
        tags.push(["zassetsu", "社日(秋)"]);
    }
    if (isHiganStart(jd)) {
        tags.push(["zassetsu", "彼岸入"]);
    }
    if (isHiganEnd(jd)) {
        tags.push(["zassetsu", "彼岸明"]);
    }
    if (isJippouGureStart(jd)) {
        tags.push(["badDay", "十方暮入"]);
    }
    if (isJippouGureEnd(jd)) {
        tags.push(["badDay", "十方暮終"]);
    }
    if (isTenichiTenjoStart(jd)) {
        tags.push(["goodDay", "天天上入"]);
    }
    if (isTenichiTenjoEnd(jd)) {
        tags.push(["goodDay", "天天上終"]);
    }
    if (isIchiryuManbai(jd)) {
        tags.push(["goodDay", "一粒万倍日"]);
    }
    if (isTensya(jd)) {
        tags.push(["goodDay", "天赦日"]);
    }
    if (isFujoju(oldCalendar(jd))) {
        tags.push(["badDay", "不成就日"]);
    }
    if (isHassen(jd)) {
        tags.push(["badDay", "八専"]);
    }
    if (isSanrinbou(jd)) {
        tags.push(["goodDay", "三輪宝"]);
    }
    if (!moon) {
        moon = new Moon(date.getFullYear(), date.getMonth());
    }
    var fullmoon = moon.fullmoonOf(date); 
    if (fullmoon) {
        tags.push(["fullmoon", "満月", fullmoon]);
    }
    var newmoon = moon.newmoonOf(date);
    if (newmoon) {
        tags.push(["newmoon", "新月", newmoon]);
    }
    return tags;
}