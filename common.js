function parseHash(url) {
    var parts = url.split('#');
    if (parts.length < 2) {
        return null;
    }
    return decodeURIComponent(parts[1]);
}
function addClass(e, cls) {
    var a = e.getAttribute("class");
    var classes = a ? a.split(' ') : [];
    classes.push(cls);
    e.setAttribute("class", classes.join(' '));
}
function removeClass(e, cls) {
    var newClasses = [];
    var a = e.getAttribute("class");
    var classes = a ? a.split(' ') : [];
    classes.forEach(function (c) {
        if (c != cls) {
            newClasses.push(c);
        }
    });
    e.setAttribute("class", newClasses.join(' '));
}

module.exports = {
    parseHash: parseHash,
    addClass: addClass,
    removeClass: removeClass,
};
