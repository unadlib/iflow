# Limitations Pitfalls

* [Unable to automate batch update within dispatcher](https://github.com/unadlib/iflow/issues/3)

For the action of a normal synchronization process, the merge problem with the same state being changed multiple times is ignored and we will fix it.

* [Proxy/Reflect polyfill not supported](https://github.com/unadlib/iflow/issues/2)

Since IE11 does not support ES6 Proxy/Reflect, we will consider adding Proxy/Reflect polyfill to support IE11.


* [A prototype chain function injection of a primitive type that does not support native proxy cannot trigger notification of these types of change behavior automatically](https://github.com/unadlib/iflow/issues/4)

Currently known unsupported types are: `Set` / `WeakSet` / `Map` / `WeakMap`, and soon we will support it.
 