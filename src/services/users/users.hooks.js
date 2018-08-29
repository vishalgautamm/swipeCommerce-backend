const { authenticate } = require('@feathersjs/authentication/lib').hooks
const { disallow } = require('feathers-hooks-common/lib')
const populateFromGoogle = require('../../hooks/populateFromGoogle')
const createSellerAndCustomer = require('../../hooks/createSellerAndCustomer')
const onlyGetLoggedInUser = require('../../hooks/onlyGetLoggedInUser')

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt'), disallow('external')],
    get: [authenticate('jwt'), onlyGetLoggedInUser()],
    create: [populateFromGoogle()],
    update: [disallow('external'), authenticate('jwt')],
    patch: [authenticate('jwt'), onlyGetLoggedInUser()],
    remove: [authenticate('jwt'), disallow('external')]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [createSellerAndCustomer()],
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
