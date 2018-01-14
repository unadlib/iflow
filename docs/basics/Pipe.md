# Pipe
事实上，在上一节我们已经完成了全部的pipe设定工作，它包含初始的state设定和action设定。

但是，Pipe内其实也可以包含与State改变无直接相关的函数，例如我们给上节完成的Pipe添加一个`onSubmit`函数，这个函数将直接用于add button关联表单的`onSubmit`事件。

```javascript
import iFlow from 'iflow'

const pipe = iFlow({
    todo: [],
    tabStatus: 'All',
    tabs: [
        'All',
        'Active',
        'Completed'
    ],
    add (text) {
        this.list.push({
            id: +new Date(),
            text,
            completed: false,
        })
    },
    toggleTodo (currentId) {
        const current = this.list.find(({id}) => id === currentId)
        current.completed = !current.completed
    },
    
    clearCompleted () {
        this.list = this.list.filter(({completed}) => !completed)
    },
    
    toggleTab (tabStatus) {
        this.tabStatus = tabStatus
    },
    onSubmit (e, input) {
        e.preventDefault()
        if (!!input.value.trim()) {
          this.add(input.value)
          input.value = ''
        }
    }
})
```

当然如果是为了Pipe的状态管理是纯粹且无副作用的，事实上我们也建议`onSubmit`写在相关的View组件内以保持状态管理设计的存粹与独立性。

⚠️⚠️这里还需要特别注意的是: 👇

**Pipe初始化(create)后就变成Store，但在Pipe还未被初始化(create)之前，我们能在Pipe上追加对应的中间件**。这些我们在后续的高级篇和中间件API都将详细提到。