export default class BaseHandle {
  static getImmutable (node) {
    return node['__pipe__'].getImmutableStore().root
  }

  static getStore (node, path) {
    return node.__pipe__.get(path)
  }

  static listen (node, path, callback) {
    return node.__pipe__.listen(path, callback)
  }

  static getState (node) {
    return node.__pipe__.getState()
  }

  static setState (node, state) {
    return node.__pipe__.setState(state)
  }
}