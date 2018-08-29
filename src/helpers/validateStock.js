const validateStock = async (idsAndQuantities, app) => {
  try {
    return idsAndQuantities.reduce(async (acc, [productId, qty]) => {
      const product = await app.service('products').get(productId)
      if (product.qInStock >= qty) return acc
      return [
        ...acc,
        productId
      ]
    }, [])
  } catch (e) {
    console.log(`Error validating stock! ${e}`)
    throw e
  }
}

const orderIdToProductQtys = async (orderId, app) => {
  try {
    const order = await app.service('orders').Model.findById(orderId)
    const orderDetails = order.orderDetails
    return Object.entries(orderDetails.reduce((acc, { productId }) => ({
      ...acc,
      [productId]: (acc[productId] || 0) + 1
    })
      , {}))
  } catch (e) {
    console.log(`Error converting orderId to Product quantities! ${e}`)
    throw e
  }
}

const validateStockByOrderId = (orderId, app) =>
  validateStock(orderIdToProductQtys(orderId, app), app)

module.exports = {
  validateStock,
  validateStockByOrderId,
  orderIdToProductQtys
}
