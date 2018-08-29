const ObjectId = require('mongoose').Types.ObjectId

const addOrderToSeller = async (userId, orderId, app) =>
  app.service('users').patch(userId, {
    $push: { 'seller.orderIds': orderId }
  })

module.exports = () => context => {
  doAsync(context)
  return context
}

async function doAsync(context) {
  const { app, result } = context
  const productIds = result.orderDetails.map(order => ObjectId(order.productId))
  console.log(productIds)
  const sellers = await app.service('users').find({
    query: {
      'seller.productIds': { $in: productIds }
    }
  })

  sellers.data.forEach(seller => console.log(seller))

  sellers.data.map(async seller =>
    addOrderToSeller(seller._id, result._id, app)
  )
}
