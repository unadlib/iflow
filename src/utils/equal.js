import { fromJS, is } from 'immutable'
import be from 'be-type'

const MAX_THRESHOLD = 2**16

export default (x, y, {isFilterFn = false} = {}) => {
  if (Object.is(x, y)) {
    return true
  }
  if (typeof x !== typeof y) {
    return false
  }
  if (be.array(x)) {
    if (x.length !== y.length) {
      return false
    } else {
      if (isMutualContains(x, y)) {
        return true
      }
    }
  }
  if (be.object(x)) {
    const isKeysEqual = is(fromJS(Object.keys(x)), fromJS(Object.keys(y)))
    if (!isKeysEqual) {
      return false
    } else if (
      isMutualContains(
        Object.values(x).filter(filterFunc(isFilterFn)),
        Object.values(y).filter(filterFunc(isFilterFn)),
      )
    ) {
      return true
    }
  }
  try {
    const stringifyX = JSON.stringify(x)
    if (stringifyX.length > MAX_THRESHOLD){
      return false
    }
    return stringifyX === JSON.stringify(y)
  } catch (e) {}
  return isImmutableEqual(x, y)
}

const isMutualContains = (x, y) => {
  return x.every(i => y.includes(i)) && y.every(i => x.includes(i))
}

const filterFunc = isFilterFunc => item => !filterFunc || !be.function(item)

const isImmutableEqual = (x, y) => {
  return is(fromJS(x), fromJS(y))
}
