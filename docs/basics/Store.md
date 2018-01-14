# Store

上一节我们完成了TODO Pipe，它包含的State和Actions，而Store也同有样包含State和Store，它们简单的区别是Store是Pipe初始化后(create)的产物，Pipe可以追加中间件，可以组合Pipe。

接下来我们来完成一个Pipe的初始化(create)。

```javascript
import iFlow from 'iflow'

const pipe = iFlow({
  //deliberately omit state and actions for demo.
})

const store = pipe.create()
```

一个Pipe使用`create`进行初始化后，就成为一个完备的Store，这个时候我们就可以开始利用这个Store在View组件进行State的引用和赋值操作了。

⚠️⚠️⚠️需要注意的是: 👇

**iFlow的Store是一个完整的原生(Plain)数据结构，甚至你可以直接进行操作，对State和Action进行直接改变等操作，但对于中大型项目我们非常不推荐这样做，这样会让状态结构难以追踪，而且丧失状态结构的稳定性。**

