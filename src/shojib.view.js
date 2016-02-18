var CONSTANTS = {
	startTagRe: '/{{\s*',
	endTagRe: '\s*?}}/g'
}

var Utility = {
	parser: function (html) {
		var parser = new DOMParser(),
			doc = parser.parseFromString(html, "text/html")
		return doc
	},
	stringify: function (obj) {
		return JSON.stringify(obj)
	},
	docFragment: function (html) {
	    var frag = document.createDocumentFragment(),
	    tmp = document.createElement('body'), child;
	    tmp.innerHTML = html;
	    while (child = tmp.firstElementChild) {
	        frag.appendChild(child);
	    }
	    return frag;
	}
}

function View (options) {
	this.element = options.element
	this.model = options.model
	this.template = options.template
}

View.prototype = {
	update: function () {
		console.log('updating view...' + Utility.stringify(this.model))
		dthis.show(Utility.stringify(this.model))
	},
	parsedTemplate: function () {
		return Utility.parser(this.template)
	},
	show: function (html) {
		document.querySelector(this.element).innerHTML = html
	},
	tokenize: function () {
		var parsed = this.parsedTemplate()
		return parsed.body.querySelectorAll('*')
	}
}


