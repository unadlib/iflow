/* global toString */

const unproxyTypes = [
  '[object Set]',
  '[object WeakSet]',
  '[object Map]',
  '[object WeakMap]'
]

export default (target) => unproxyTypes.includes(toString.call(target))