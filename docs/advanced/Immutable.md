# Immutable

Immutable can bring a lot of benefits, but if you use deconstruction or object.assign, it's actually not good for developers to maintain the code, or to directly introduce the drawbacks of the Immutable.js-band conversion consumption.

Although iFlow does not directly internally implement a complete immutable, it can benefit iFlow's `getState` internal API combining `addObserver` middleware to achieve immutable, iFlow also provides the [predict](/docs/api/predict.md) API, which also helps to achieve a complete immutable.