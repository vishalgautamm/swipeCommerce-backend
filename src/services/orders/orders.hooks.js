const { authenticate } = require('@feathersjs/authentication/lib').hooks
const injectUserId = require('../../hooks/injectUserId')
const linkTo = require('../../hooks/linkTo')
const { disallow } = require('feathers-hooks-common/lib')
const restrictToOwner = require('../../hooks/restrictToOwner')
const sendOrderDetails = require('../../hooks/sendOrderDetails')
const { populateOrderDetails } = require('../../hooks/populateOrderDetails')
const linkSellerToOrder = require('../../hooks/linkSellerToOrders')

const restrictToCustomer = () =>
  restrictToOwner('customer', 'cartId')

const cartLinks = [{
  targetService: 'users',
  targetKey: 'customer.orderIds',
  sourceIdKey: 'userId'
}, {
  targetService: 'carts',
  targetKey: 'orderId',
  sourceIdKey: 'cartId'
}]

module.exports = {
  before: {
    all: [
      authenticate('jwt')
    ],
    find: [
    ], // TODO: put patch disallow
    get: [sendOrderDetails()],
    create: [
      // not checking cartId because it is done in
      // populateOrderDetails
      injectUserId(),
      populateOrderDetails()
    ],
    update: [
      disallow('external')
    ],
    patch: [disallow('external')],
    remove: [
      disallow('external')
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      linkTo(cartLinks),
      linkSellerToOrder()
    ],
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
