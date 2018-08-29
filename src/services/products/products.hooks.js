const { authenticate } = require('@feathersjs/authentication/lib').hooks
const { disallow } = require('feathers-hooks-common/lib')
const search = require('feathers-mongodb-fuzzy-search')

const linkTo = require('../../hooks/linkTo')
const unlinkFrom = require('../../hooks/unlinkFrom')
const idExists = require('../../hooks/idExists')
const restrictToOwner = require('../../hooks/restrictToOwner')
const injectUserId = require('../../hooks/injectUserId')
const populateReviews = require('../../hooks/populateReviews')
const populateRating = require('../../hooks/populateRating')

const restrictToSeller = () => restrictToOwner('seller', 'productIds')

const productsLinks = [
  {
    targetService: 'users',
    sourceIdKey: 'userId',
    targetKey: 'seller.productIds'
  }
  // {
  //   targetService: 'categories',
  //   sourceIdKey: 'categoryId',
  //   targetKey: 'productIds'
  // }
]

const filterDisabledProducts = () => async context => {
  const { params } = context
  if (params.provider === undefined) return context

  // context.params.query = {
  //   ...params.query,
  //   status: 1
  // }
  if (context.params.query && context.params.query.findIds) {
    context.params.query = {
      _id: { $in: Object.values(context.params.query.findIds) }
    }
  }

  return context
}

module.exports = {
  before: {
    all: [
      search()
    ],
    find: [
      filterDisabledProducts(),
      populateReviews()
    ],
    get: [
      populateReviews()
    ],
    create: [
      authenticate('jwt'),
      injectUserId(),
      idExists('userId', 'users')
    ],
    update: [
      disallow('external'),
      authenticate('jwt'),
      restrictToSeller()
    ],
    patch: [
      authenticate('jwt'),
      restrictToSeller()
    ],
    remove: [
      authenticate('jwt'),
      restrictToSeller(),
      unlinkFrom(productsLinks)
    ]
  },

  after: {
    all: [],
    find: [populateRating()],
    get: [populateRating()],
    create: [linkTo(productsLinks)],
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
