var REGEX = {
    curly: /{{([^}}]+)}}/g,
    tag: /<(.*?)>/g,
    end: /(<\/[a-z]+?>)/g,
    for: /for="(.*?)"/g,
    if: /if="(.*?)"/g,
    var: /[^{}]/g,
    stripCurly: /[a-z.A-Z0-9_]+/g,
    stripFor: /for="(.*[^"])/g
};
