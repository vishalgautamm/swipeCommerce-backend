// Initializes the `reviews` service on path `/reviews`
const createService = require('feathers-mongoose/lib')
const createModel = require('../../models/reviews.model')
const hooks = require('./reviews.hooks')

module.exports = function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/reviews', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('reviews')

  service.hooks(hooks)
}
