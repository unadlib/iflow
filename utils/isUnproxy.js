/* global toString */

const unProxyTypes = [
  '[object Set]',
  '[object WeakSet]',
  '[object Map]',
  '[object WeakMap]'
]

export default (target) => unProxyTypes.includes(toString.call(target))