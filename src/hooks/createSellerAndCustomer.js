module.exports = () => async context => {
  const { app, result } = context
  const data = {
    seller: {
      productIds: [],
      orderIds: []
    },
    customer: {
      orderIds: []
    },
    addresses: result.addresses || []
  }

  await app.service('users').patch(result._id, data)
  await app.service('carts').create({ userId: result._id })
}
