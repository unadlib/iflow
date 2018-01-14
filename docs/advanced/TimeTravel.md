# 时间旅行(Time Travel)

关于时间旅行，我们稍后会带来一个 `iflow-devtools` 它的特性，它将基于iFlow的中间件。

如果你有兴趣开发它，你可以[联系我们](https://github.com/unadlib/iflow/issues)

大概的实现过程情况:

1. 通过在Store在初始化的后，进行`initStateTree = store.__pipe__.getState()`,获得初始化版本的Store State Tree.

2. 利用`addObserver`中间件得到的Setter Path，进行每次对`initStateTree`的合并操作，如果有必要可以进行Object.freeze，来完成一个真正意义上的immutable的时间旅行。