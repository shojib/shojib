var shojib = isDefined(shojib) ? shojib : {}

shojib.module = function (name) {
    this.name = name

    return {
        model: _model,
        view: _view,
        controller: _controller,
        service: _service,
        component: _component,
        filter: _filter
    }
}