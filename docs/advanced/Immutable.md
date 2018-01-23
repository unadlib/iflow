# Immutable

Immutable can bring a lot of benefits, but if you use deconstruction or object.assign, it's actually not good for developers to maintain the code, or to directly introduce the drawbacks of the Immutable.js-band conversion consumption.

Although iFlow internal implementation of a complete immutable, but also conducive to iFlow's `getState` internal APIs combined with `addObserver` middleware to achieve customized immutable, iFlow provide [getImmutable](/docs/api/getImmutable.md) API.
 