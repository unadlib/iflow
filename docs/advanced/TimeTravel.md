# Time Travel

Regarding time travel, we will later bring a `iflow-devtools` its feature, which will be based on iFlow middleware.

If you are interested in developing it, you can [contact us](https://github.com/unadlib/iflow/issues)

Approximate implementation process:

1. By `initStateTree = Store.__pipe__.getstate()` After being initialized in the store, get the initialized version of the store state tree.

2. Using the `addObserver` middleware to get the setter Path, each time the `initStateTree` merge operation, if necessary can carry out `Object.freeze`, to complete a true sense of immutable time travel.