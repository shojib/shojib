
function isMapFn (obj) {
    if (typeof obj === 'object' || Array.isArray(obj)) {
        var str = JSON.stringify(obj);
        var match = str.match(/[{}]/g);
        return match ? match.length > 2 : false;
    } else {
        return false;
    }
}

function docFragmentFn (html) {
    var frag = document.createDocumentFragment(), frags = [],
        bodyEle = document.createElement('body'), child;
    bodyEle.innerHTML = html;
    while (child = bodyEle.firstElementChild) {
        frag.appendChild(child);
        frags.push(child);
    }
    return frags;
}

function stringify (obj) {
    return JSON.stringify(obj);
}

function isDefined (obj) {
    return typeof obj !== 'undefined';
}

function isNull (obj) {
    return obj === null;
}

function removeCurly (str) {
    if (isDefined(str)) return str.match(REGEX.stripCurly).pop();
}

function removeFor (str) {
    var re = str.match(REGEX.stripFor);
    return RegExp.$1;
}

function rmCurlySplit (match) {
    if (isDefined(match)) return removeCurly(match).split('.')[1];
}

function isMatch (freg, regex) {
    if (isDefined(freg)) return freg.outerHTML.match(regex)!==null;
}