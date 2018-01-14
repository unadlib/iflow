# Async Action

由于目前浏览器的支持情况并没有完美支持原生的`async`类型函数，所以我们在有必须外部使用异步串联Actions的时候，必须用`external`来包装一下，以包装外部的API能够正确识别使用这个Action的异步特性。

例如：

```javascript
import iFlow, { external } from 'iflow'
const store = iFlow({
  fetch: external(async function(){
    return await fetch(params) // omit
  })
})

(async ()=>{
  await store.fetch() // It will async for external effect.
})
```

当然如果你如果用类的方式来构建state管理的时，你可以选择使用装饰器`@external()`

例如：

```javascript
import iFlow, { external } from 'iflow'
const store = iFlow(new class {
    @external()
    async fetch(){
      return await fetch(params) // omit
    }
})

(async ()=>{
  await store.fetch() // It will async for external effect.
})
```

更多详细说明请查看相关[external](/docs/api/external.md)API文档。

⚠️⚠️⚠️️需要注意的是： 

**如果你只是想Action内部异步的话，那么其实你可以不必使用`external`来包装成外部的异步Action。**
