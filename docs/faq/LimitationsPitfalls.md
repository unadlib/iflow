# Limitations Pitfalls

* [Unable to automate batch update within dispatcher](https://github.com/unadlib/iflow/issues/3)
For the action of a normal synchronization process, the merge problem with the same state being changed multiple times is ignored and we will fix it.

* [Computed not implemented](https://github.com/unadlib/iflow/issues/1)
We consider implementing standard observable to complete computed, or implementing non-standard immutable patterns to cache derivative computations.

* [Proxy/Reflect polyfill not supported](https://github.com/unadlib/iflow/issues/2)
Since IE11 does not support ES6 Proxy/Reflect, we will consider adding Proxy/Reflect polyfill to support IE11.

* Immutable not supported
A sub-component that is connected to the state component is iFlow, and the `shouldComponentUpdate` API within its sub-component will not be able to be judged for update control if it is used in the iFlow of the parent component.

* A prototype chain function injection of a primitive type that does not support native proxy cannot trigger notification of these types of change behavior automatically
Currently known unsupported types are: `Set` / `WeakSet` / `Map` / `WeakMap`, and soon we will support it.
 