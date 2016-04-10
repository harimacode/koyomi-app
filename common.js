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
    if (isIchiryuManbai(jd)) {
        tags.push(["goodDay", "一粒万倍日"]);
    }
    if (isTensya(jd)) {
        tags.push(["goodDay", "天赦日"]);
    }
    if (isFujoju(oldCalendar(jd))) {
        tags.push(["badDay", "不成就日"]);
    }
    if (isSanrinbou(jd)) {
        tags.push(["badDay", "三隣亡"]);
    }
    if (!moon) {
        moon = new Moon(date.getFullYear(), date.getMonth());
    }
    if (moon.isFullmoon(date)) {
        tags.push(["fullmoon", "満月"]);
    }
    if (moon.isNewmoon(date)) {
        tags.push(["newmoon", "新月"]);
    }
    return tags;
}