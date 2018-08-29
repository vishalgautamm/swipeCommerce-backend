const Forbidden = require('@feathersjs/errors/lib').Forbidden

const isSellersProduct = async (productId, seller) =>
  seller.productIds.some(
    _productId => _productId.toString() === productId.toString()
  )

const includesId = (arr, id) =>
  arr.some(_id => _id.toString() === id.toString())

module.exports = () => async context => {
  const { app, id, params } = context
  const { provider, query } = params
  let { user } = params

  const serverSellerRequest = !provider && query.seller

  if (!user && !serverSellerRequest) {
    throw new Forbidden('You are not allowed to get this.')
  }

  if (serverSellerRequest) {
    user = await app.service('users').get(query.userId)
  }

  const isCustomersOrder =
    !serverSellerRequest && includesId(user.customer.orderIds, id.toString())

  const isSellersOrder =
    serverSellerRequest || includesId(user.seller.orderIds, id.toString())

  if (!isCustomersOrder && !isSellersOrder) {
    throw new Forbidden('You are not allowed to get this.')
  }

  if (isCustomersOrder) return context

  const { orderDetails } = await app.service('orders').Model.findById(id)

  const sellersOrderDetails = orderDetails.filter(details =>
    isSellersProduct(details.productId, user.seller)
  )

  return Object.assign(context, {
    result: { orderDetails: sellersOrderDetails }
  })
}
