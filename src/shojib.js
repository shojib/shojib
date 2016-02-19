var TEMPLATE_REGEX = {
    curlyRe: /{{([^}}]+)}}/g,
    tagRe: /<(.*?)>/g,
    endRe: /(<\/[a-z]+?>)/g,
    forRe: /for="(.*?)"/g,
    ifRe: /if="(.*?)"/g,
    varRe: /[^{}]/g,
    stripCurly: /[a-z.A-Z0-9_]+/g,
    stripFor: /for="(.*[^"])/g
}

function isMapFn (obj) {
    if (typeof obj === 'object' || Array.isArray(obj)) {
        var str = JSON.stringify(obj);   
        var match = str.match(/[{}]/g)
        return match ? match.length > 2 : false
    } else {
        return false
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
    return JSON.stringify(obj)
}

function isDefined (obj) {
    return typeof obj !== 'undefined'
}

function isNull (obj) {
    return obj === null
}

function removeCurly (str) {
    if (isDefined(str))
        return str.match(TEMPLATE_REGEX.stripCurly).pop()
}

function removeFor (str) {
    var re = str.match(TEMPLATE_REGEX.stripFor)
    return RegExp.$1
}

function rmCurlySplit (match) {
    if (isDefined(match))
        return removeCurly(match).split('.')[1]
}

var Curly = function (match, fragment, model) {
    var frag, regexp = new RegExp(match[0], 'g')
    if (isDefined(model[match[1]])) {
        frag = fragment.replace(regexp, model[match[1]])
        return frag
    } else {
        return fragment
    }
}

var ForLoop = function (match, model) {
    var match, syntax, valName, iterable, compiledTpl = '',
    arrays = match[1].split(' ')

    if (arrays.length === 3) {
        objKey = arrays[0]
        separator = arrays[1] === 'in'
        
        var scopes = Object.keys(model), len = scopes.length
        for (var j = 0; j < len; j++) {
            if (arrays[2] === scopes[j]) {
                iterable = scopes[j]
                break
            }
        }
        
        if (separator && isDefined(iterable)) {
            var data = model[iterable],
                keys = Object.keys(data),
                len = keys.length,
                fMatch, frag = []
            for (var i = 0; i < len; i++) {
                frag = match.input.trim()
                while (fMatch = TEMPLATE_REGEX.curlyRe.exec(match.input)) {
                    fMatch[1] = fMatch[1].split('.')[1]
                    frag = Curly(fMatch, frag, data[i])
                }
                compiledTpl += frag
            }
        }
    }
    return compiledTpl
}

var View = function (opts) {
    var opts = opts || {},
        template = opts.template.trim(),
        model = opts.model,
        scopes = Object.keys(model),
        element = opts.element,
        match, year = new Date().getFullYear(),
        fragments = docFragmentFn(template),
        fragmentsLength = fragments.length
        model.year = year

    for (var i = 0; i < fragmentsLength; i++) {
        var frag = fragments[i].childNodes[0].data
        while (match = TEMPLATE_REGEX.curlyRe.exec(fragments[i].innerHTML)) {
            frag = Curly(match, frag, model)
        }
        fragments[i].replaceChild(document.createTextNode(frag), fragments[i].childNodes[0])
        
        while (match = TEMPLATE_REGEX.forRe.exec(fragments[i].innerHTML)) {
            frag = fragments[i].innerHTML
            frag = ForLoop(match, model)
        }
        fragments[i].innerHTML = frag
    }

   document.querySelector(element).innerHTML = ''
    for (var h = 0; h < fragments.length; h++) {
        document.querySelector(element).appendChild(fragments[h])    
    }

}

