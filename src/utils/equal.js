import { fromJS, is } from 'immutable'
import be from 'be-type'

export default (x, y) => {
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
    const isKeysEqual = is(Object.keys(x), Object.keys(y))
    if (!isKeysEqual) {
      return false
    } else if (isMutualContains(Object.values(x), Object.values(y))) {
      return true
    }
  }
  try {
    return JSON.stringify(x) === JSON.stringify(y)
  } catch (e) {}
  return is(fromJS(x), fromJS(y))
}

const isMutualContains = (x, y) => {
  return x.every(i => y.includes(i)) && y.every(i => x.includes(i))
}
