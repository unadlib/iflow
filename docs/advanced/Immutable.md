# Immutable

Immutable can bring a lot of benefits, but if you use deconstruction or object.assign, it's actually not good for developers to maintain the code, or to directly introduce the drawbacks of the Immutable.js-band conversion consumption.

Although iFlow does not directly internally implement a complete immutable, it can benefit iFlow's `getState` internal API combining `addObserver` middleware to achieve immutable, As to whether it is necessary to support immutable directly we are still in discussion and may soon have results.

You are welcome to join [the discussion](https://github.com/unadlib/iflow/issues/3).