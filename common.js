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