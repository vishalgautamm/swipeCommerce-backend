const Forbidden = require('@feathersjs/errors/lib').Forbidden

const populateOrderDetails = () => async context => {
  const { app, data } = context
  const { userId } = data
  if (!data.cartId) throw new Forbidden('Cart was not found!')

  const user = await app.service('users').get(userId || context.params.user._id)

  const result = await app
    .service('carts')
    .Model.find({
      _id: data.cartId
    })
    .populate('cartProducts.productId', '_id, price title')
    .select('cartProducts -_id')
    .exec()

  if (!result.length) throw new Forbidden('Cart was not found!')

  let total = 0
  context.data.orderDetails = result[0].cartProducts.map(
    ({ productId: { _id, price, title } }) => {
      total += price
      return {
        productId: _id,
        price,
        title,
        displayName: user.displayName,
        address: user.addresses[0]
      }
    }
  )

  context.data.total = total

  return context
}

exports.populateOrderDetails = populateOrderDetails
