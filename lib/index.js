import Pipe from './pipe'
import batch from './batch'
import external from './external'
import base from './base'

const pipe = (model) => new Pipe(model)
export const {
  getImmutable,
  getStore,
  listen,
  getState,
  setState
} = base

export {
  pipe as default,
  pipe as iFlow,
  batch,
  external,
  Pipe,
}
