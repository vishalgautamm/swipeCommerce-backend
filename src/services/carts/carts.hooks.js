const { authenticate } = require('@feathersjs/authentication/lib').hooks
const linkTo = require('../../hooks/linkTo')
const unlinkFrom = require('../../hooks/unlinkFrom')
const { disallow } = require('feathers-hooks-common/lib')
const restrictToOwner = require('../../hooks/restrictToOwner')
const injectUserId = require('../../hooks/injectUserId')

const restrictToCustomer = () => restrictToOwner('customer', 'cartId')

const cartLinks = [
  {
    targetService: 'users',
    targetKey: 'customer.cartId',
    sourceIdKey: 'userId',
    isArray: false
  }
]

const createNewCart = () => async context => {
  context.data.isPlaced = false
  context.data.cartProducts = []

  return context
}

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [restrictToCustomer()],
    create: [
      // put back disallow
      injectUserId(),
      createNewCart()
    ],
    update: [],
    patch: [restrictToCustomer()],
    remove: [disallow('external'), injectUserId(), unlinkFrom(cartLinks)]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [linkTo(cartLinks)],
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
