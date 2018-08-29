const { authenticate } = require('@feathersjs/authentication').hooks
const BadRequest = require('@feathersjs/errors').BadRequest
const stripe = require('stripe')('sk_test_b1DHtdWESFu51bgEnyWrLXYy')
const {
  validateStock,
  orderIdToProductQtys
} = require('../../helpers/validateStock')

const validateTransaction = () => async context => {
  const { app, data, params } = context
  const { total, token, orderId } = data

  try {
    if (!orderId) throw new BadRequest('No orderId was supplied!')
    if (!total) throw new BadRequest('No total was supplied!')
    if (!token) throw new BadRequest('No token was supplied!')

    const productQtys = await orderIdToProductQtys(orderId, app)
    const invalidStock = await validateStock(productQtys, app)

    if (invalidStock.length) {
      context.result = {
        error: 'NOT_IN_STOCK',
        productIds: invalidStock
      }
      return context
    }

    const resp = await stripe.charges.create({
      amount: total,
      currency: 'usd',
      description: 'An example charge',
      source: token.id
    })

    const data = {
      id: resp.id,
      last4: resp.source.last4,
      status: resp.status,
      paid: resp.paid,
      type: resp.outcome.type,
      amount: resp.amount
    }

    const transaction = await app.service('transactions').Model.create(data)

    await app.service('orders').patch(orderId, {
      $push: { transactionIds: transaction._id }
    })

    if (resp.status === 'succeeded') {
      await Promise.all(
        productQtys.map(async ([productId, qty]) =>
          app
            .service('products')
            .Model.update({ _id: productId }, { $inc: { qInStock: -qty } })
            .exec()
        )
      )

      await app
        .service('carts')
        .Model.update({ _id: params.user.cartId }, { productIds: { $set: [] } })

      context.result = {
        ...data
      }

      return context
    }

    context.result = {
      id: resp.id,
      last4: '',
      status: resp.status,
      paid: '',
      type: resp.outcome.type,
      amount: ''
    }

    return context
  } catch (err) {
    console.log(`Error validating Stripe transaction! ${err}`)
    throw err
  }
}

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [validateTransaction()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
