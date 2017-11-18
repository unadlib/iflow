import be from 'be-type'

export default (func, resolver) => {
  if (!be.function(func) || (!be.Nil(resolver) && !be.function(resolver))) {
    throw new TypeError(`error`)
  }

  function memoized (...args) {
    const key = resolver ? resolver.apply(this, args) : args[0]
    const cache = memoized.cache
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = func.apply(this, args)
    memoized.cache = cache.set(key, result) || cache
    return result
  }

  memoized.cache = new WeakMap()
  return memoized
}