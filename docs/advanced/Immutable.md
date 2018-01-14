# Immutable

Immutable能带来很多好处，但是如果利用解构操作或者是Object.assign，事实上并不利于开发者维护相关代码，或者直接引入Immutable.js会带的转换消耗的弊端。

虽然iFlow没有直接内部实现一个完整的immutable，但可以利于iFlow的`getState`内部API结合`addObserver`中间件来实现immutable, 至于是否需要直接支持immutable我们还在讨论中，可能很快将有结果。

欢迎你也可以加入[讨论](https://github.com/unadlib/iflow/issues/3)中。