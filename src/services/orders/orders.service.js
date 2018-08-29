// Initializes the `orders` service on path `/orders`
const createService = require('feathers-mongoose/lib')
const createModel = require('../../models/orders.model')
const hooks = require('./orders.hooks')

module.exports = function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    'paginate': {
      'default': 10000,
      'max': 10000
    }
  }

  // Initialize our service with any options it requires
  app.use('/orders', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('orders')

  service.hooks(hooks)
}
