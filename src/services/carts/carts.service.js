// Initializes the `carts` service on path `/carts`
const createService = require('feathers-mongoose/lib')
const createModel = require('../../models/carts.model')
const hooks = require('./carts.hooks')

module.exports = function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/carts', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('carts')

  service.hooks(hooks)
}
