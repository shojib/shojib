

function _curlyDirective (match, fragment, model) {
    var frag, regexp = new RegExp(match[0], 'g');
    if (isDefined(model[match[1]])) {
        frag = fragment.replace(regexp, model[match[1]]);
        return frag;
    } else if (isDefined(model)) {
        frag = fragment.replace(regexp, model);
        return frag;
    } else {
        return fragment;
    }
}

function _forDirective (match, model) {
    var match, syntax, valName, iterable, compiledTpl = '',
    arrays = match[1].split(' ');

    if (arrays.length === 3) {
        objKey = arrays[0];
        separator = arrays[1] === 'in';
        
        var scopes = Object.keys(model), len = scopes.length;
        for (var j = 0; j < len; j++) {
            if (arrays[2] === scopes[j]) {
                iterable = scopes[j];
                break;
            }
        }
        
        if (separator && isDefined(iterable)) {
            var data = model[iterable],
                keys = Object.keys(data),
                len = keys.length,
                fMatch, frag = [];
            for (var i = 0; i < len; i++) {
                frag = match.input.trim();
                while (fMatch = REGEX.curly.exec(match.input)) {
                    fMatch[1] = fMatch[1].split('.')[1];
                    frag = _curlyDirective(fMatch, frag, data[i]);
                }
                compiledTpl += frag;
            }
        }
    }
    return compiledTpl;
}

// remove this when controller is ready
function showTest () {
    return false;
}

function view (opts) {
    var opts = opts || {},
        template = opts.template.trim(),
        model = opts.model,
        scopes = Object.keys(model),
        element = opts.element,
        match, year = new Date().getFullYear(),
        fragments = docFragmentFn(template),
        fragmentsLength = fragments.length;

    update();

    function update () {
        for (var i = 0; i < fragmentsLength; i++) {
            var frag;
            if (match = REGEX.if.exec(fragments[i].outerHTML)) {
                window.frag1 = fragments[i];
                console.log(eval(match[1]));
                if (eval(match[1])===false && fragments.splice(i, 1)) {
                    fragmentsLength = fragments.length;
                    i -= 1;
                }
                console.log('if ', typeof fragments);
            } else {
                if (!isMatch(fragments[i], REGEX.for)) {
                    frag = fragments[i].outerHTML;
                    while (match = REGEX.curly.exec(fragments[i].innerHTML)) {
                        frag = _curlyDirective(match, frag, model);
                    }
                    fragments[i].innerHTML = frag;
                }
                if (isMatch(fragments[i], REGEX.for)) {
                    var tokens = docFragmentFn(fragments[i].outerHTML)[0].childNodes,
                        prevIndex;
                    for (var t = 0; t < tokens.length; t++) {
                        console.log(tokens[t].outerHTML);
                        while (match = REGEX.for.exec(tokens[t].outerHTML)) {
                            frag = tokens[t].innerHTML;
                            frag = _forDirective(match, model);
                            prevIndex = t;
                        }
                        tokens[t].innerHTML = frag;
                    }
                    console.log(tokens[prevIndex]);
                    fragments[i].childNodes[prevIndex].innerHTML = tokens[prevIndex].innerHTML;
                    console.log(fragments[i].childNodes[prevIndex]);
                }
            }
        }

        window.frags = fragments;
        document.querySelector(element).innerHTML = ''
        for (var h = 0; h < fragments.length; h++) {
            document.querySelector(element).appendChild(fragments[h]);
        }
    }

}

