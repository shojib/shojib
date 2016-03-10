function _model (name, fn) {
    this.name = name
    this.props = fn()
}