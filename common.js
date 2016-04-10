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
        tags.push('<span class="tag sekku">' + newSekku + '</span>');
    }
    var newNijuShisekki = nijuShisekki(jd);
    if (newNijuShisekki) {
        tags.push('<span class="tag nijuShisekki">' + newNijuShisekki + '</span>');
    }
    if (isIchiryuManbai(jd)) {
        tags.push('<span class="tag goodDay">一粒万倍日</span>');
    }
    if (isTensya(jd)) {
        tags.push('<span class="tag goodDay">天赦日</span>');
    }
    if (isFujoju(oldCalendar(jd))) {
        tags.push('<span class="tag badDay">不成就日</span>');
    }
    if (!moon) {
        moon = new Moon(date.getFullYear(), date.getMonth());
    }
    if (moon.isFullmoon(date)) {
        tags.push('<span class="tag">満月</span>');
    }
    if (moon.isNewmoon(date)) {
        tags.push('<span class="tag">新月</span>');
    }
    return tags;
}