import Pipe from './pipe'
import batch from './batch'

const pipe = (model) => new Pipe(model)

export {
  pipe as default,
  batch
}
