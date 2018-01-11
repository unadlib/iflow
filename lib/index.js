import Pipe from './pipe'
import batch from './batch'
import external from './external'

const pipe = (model) => new Pipe(model)

export {
  pipe as default,
  pipe as iFlow,
  batch,
  external
}
