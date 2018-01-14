# 概念与原则

>用过了一些状态管理库或者容器以后，总觉得应该有一种新的状态管理库，虽然它是Mutable结构，但是同时应该能保持状态的数据类型原始性；它也支持Immutable，同时兼顾Mutable的有利于编程和操作，而且它应该是渐进式的，不会因过多的繁琐操作(如解构操作Spread Operator)以及其他多种复杂的概念而破坏编程乐趣。

因此，iFlow尝试利用ECMAScript 2015的Proxy & Reflect构建一个基于**Paths Match**的一种新的状态管理库。需要特别说明的是**iFlow定义的Store是包括Actions和State**。

* **Paths Match**

在View组件进行引用Store的State的时候获得Getter Paths；在Action被触发的时候，将通过Proxy得到Setter Path。通过观察者来传递Setter Path，并在连接器进行快速的Getter Paths Match.

* **Action 运行过程**

View组件触发Action，而Action执行的时候先进过`addInterceptor`设置的拦截中间件，然后如果有Action内部有进行State操作就会先经过`addMiddleware`设置的标准中间件，然后在进行State操作，然后在通过`addObserver`设置的观察中间件，直到Action执行完成，然后在最后调用`addListener`设置的监听中间件。当然，**默认情况，这些中间件没有被设置和使用，是不会进入到这些中间件的**。 默认情况下，对应的View使用到的State通知改变是基于每次的State改变，而不是Action每次执行结束的时候改变，当然，我们也有提供[batch](/docs/api/batch.md)API来批量更新State的改变。


* **State 引用过程**

Store的State被先选择器(如果有设置)处理，然后再经过连接器，最后被插入到View组件内。

### 如何工作
![Data Flow](https://raw.githubusercontent.com/unadlib/iflow/master/assets/flowChart.png)

---
>抽象化公式来表达就是: action (store) => store = newStore

---
欢迎使用iFlow!🎉🎉🎉
