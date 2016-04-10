function parseHash(url) {
    var parts = url.split('#');
    if (parts.length < 2) {
        return null;
    }
    return decodeURIComponent(parts[1]);
}
function tagsForDate(date) {
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
        tags.push('<span class="tag ichiryuManbai">一粒万倍日</span>');
    }
    if (isTensya(jd)) {
        tags.push('<span class="tag">天赦日</span>');
    }
    return tags;
}