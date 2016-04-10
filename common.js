function parseHash(url) {
    var parts = url.split('#');
    if (parts.length < 2) {
        return null;
    }
    return decodeURIComponent(parts[1]);
}
function tagsForJuliusDate(jd) {
    var tags = [];
    var newNijuShisekki = nijuShisekki(jd);
    if (newNijuShisekki) {
        tags.push('<span class="nijuShisekki">' + newNijuShisekki + '</span>');
    }
    if (isIchiryuManbai(jd)) {
        tags.push('<span class="ichiryuManbai">一粒万倍日</span>');
    }
    return tags;
}