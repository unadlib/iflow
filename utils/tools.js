/* global toString */
const INFINITY = 1 / 0

export const isSymbol = (value) => {
  const type = typeof value
  return type === 'symbol' || (type === 'object' && value !== null && toString.call(value) === '[object Symbol]')
}

export const toKey = (value) => {
  if (typeof value === 'string' || isSymbol(value)) {
    return value
  }
  const result = `${value}`
  return (result === '0' && (1 / value) === -INFINITY) ? '-0' : result
}

export const get = (object, path) => {
  if (typeof path === 'string') path = [path]
  let index = 0
  const length = path.length
  while (object !== null && index < length) {
    object = object[toKey(path[index++])]
  }
  return (index && index === length) ? object : undefined
}