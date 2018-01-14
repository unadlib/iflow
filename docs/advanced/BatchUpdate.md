# 批量更新

iFlow默认每次进行State改变的时候都将进行更新通知，但是有时Action可能有多次的state同步执行改变，我们希望它执行结束在一起通知更新，那么这时候我们就必须使用`batch`来合并更新了。

例如
```javascript
import iFlow, { batch } from 'iflow'
const store = iFlow({
  foobar: [],
  multiPush: batch(function(){
    this.foobar.push(1)
    this.foobar.push(1)
    this.foobar.push(1)
  })
})

store.multiPush()  // It will batch update.
```

同样的如果你的类的结构设计，那么建议你使用它的装饰器`@batch()`

```javascript
import iFlow, { external } from 'iflow'
const store = iFlow(new class {
    foobar = []
    @batch()
    multiPush(){
      this.foobar.push(1)
      this.foobar.push(1)
      this.foobar.push(1)
    }
})

store.multiPush()  // It will batch update.
```

更多详细说明请查看相关[batch](/docs/api/batch.md)API文档。

