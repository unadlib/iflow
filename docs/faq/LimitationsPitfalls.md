# Limitations Pitfalls

## Defects

* [No scheduler updates within automatic batch processing](https://github.com/unadlib/iflow/issues/3)

For the action of a normal synchronization process, the merge problem with the same state being changed multiple times is ignored and we will fix it.

* [Proxy/Reflect polyfill not supported](https://github.com/unadlib/iflow/issues/2)

Since IE11 does not support ES6 Proxy/Reflect, we will consider adding Proxy/Reflect polyfill to support IE11.


* [A prototype chain function injection of a primitive type that does not support native proxy cannot trigger notification of these types of change behavior automatically](https://github.com/unadlib/iflow/issues/4)

Currently known unsupported types are: `Set` / `WeakSet` / `Map` / `WeakMap`, and soon we will support it.
 
 ## Pitfalls
 
 * Use references and copies as directly as possible
 
 ```javascript
 const store = this.props.store
 const {foo, bar} = store
 ```
 
 iFlow is not recommended to the above example, the state reference relationship, we will monitor the `store` all changes to update, if we need to listen to update `foo` and `bar` directly, then we recommend to use their reference or copy directly.
  
 ```javascript
 const {foo, bar} = this.props.store
 //or
 const foo = this.props.store.foo
 const bar = this.props.store.bar
 ```
This will only listen the `foo` and `bar` change updates.
 
* Single-layer immutable store is effective when using immutable
 
`@immutable`is a single-layer traversal props, so the mixed structure of the iFlow store and plain objects is invalid.
  
For example:

 ```javascript
 class Parent extends Component {
   // this.props.sub is iflow store
   render <Sub store={this.props.sub} />
 }
 
 @immutable
 class Sub extends Component {
   // omit
 }
 ```
This is effective. But the following example is not valid:
 
 ```javascript
 class Parent extends Component {
   // this.props.sub is iflow store
   render <Sub store={{foo:'bar', sub: this.props.sub}} />
 }
 
 @immutable
 class Sub extends Component {
   // omit
 }
 ```

Of course, if you're not using `@immutable` You can arbitrarily pass the iFlow store.

* About the Usage of PureComponent
 
Because the iFlow connector uses the mutable store by default, So the connector directly with the React.PureComponent connection will not be updated, iFlow connector corresponding component should be react.Component, do not worry, iFlow will automatically diff comparison, it is more efficient and automatic than the light comparison of React.PureComponent.

If you really need to use react.PureComponent, then it is recommended that you could use cooperatively with `@immutable`. This is a great help in Sub-Component performance optimization.
 
For example:

 ```javascript
 @flow(store)
 @immutable
 class Body extends PureComponent {
   render () {
     return (
       <div>
         <button onClick={() => this.props.store.calculate(-1)}>-</button>
         {this.props.store.counter}
         <button onClick={() => this.props.store.calculate(1)}>+</button>
       </div>
     )
   }
 }
 ```
