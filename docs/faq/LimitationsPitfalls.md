# 限制与陷阱

* [无法调度器内部自动批处理更新](https://github.com/unadlib/iflow/issues/3)
对于一个普通的同步流程的action内，同个state被改变多次的合并问题之前被忽略了，我们将进行修复。

* [未实现Computed](https://github.com/unadlib/iflow/issues/1)
我们考虑实现标准的Observable来完成Computed，或者实现非标准immutable模式来cache衍生计算。

* [未支持Proxy/Reflect的polyfill](https://github.com/unadlib/iflow/issues/2)
由于IE11未支持ES6的Proxy/Reflect，我们将考虑加入Proxy/Reflect的polyfill以便支持IE11。

* 未支持Immutable
被iFlow连接state组件的子组件，如果用到该父组件的iFlow的State，那么其子组件内的`shouldComponentUpdate`API将无法进行判断进行更新控制。

* 未支持原生无法Proxy的原生类型的原型链函数注入，引发这些类型的改变行为无法自动触发通知
目前已知的不支持类型有：`Set` / `WeakSet` / `Map` / `WeakMap`，很快我们将支持它。


