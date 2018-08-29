const { authenticate } = require('@feathersjs/authentication/lib').hooks
const linkTo = require('../../hooks/linkTo')
const unlinkFrom = require('../../hooks/unlinkFrom')
const idExists = require('../../hooks/idExists')
const injectUserId = require('../../hooks/injectUserId')

const reviewLinks = [{
  targetService: 'products',
  sourceIdKey: 'productId',
  targetKey: 'reviewIds'
}]

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      idExists('productId', 'products'),
      injectUserId(),
    ],
    update: [],
    patch: [],
    remove: [unlinkFrom(reviewLinks)]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [linkTo(reviewLinks)],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
