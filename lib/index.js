import Pipe from './pipe'
import batch from './batch'
import async from './async'

const pipe = (model) => new Pipe(model)

export {
  pipe as default,
  batch,
  async
}
