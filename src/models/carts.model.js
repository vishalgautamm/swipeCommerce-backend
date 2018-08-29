// carts-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const ObjectId = require('mongoose').Schema.Types.ObjectId

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const cartProducts = new Schema(
    {
      productId: { type: ObjectId, ref: 'products' }
    },
    {
      timestamps: true
    }
  )

  const carts = new Schema(
    {
      orderId: { type: ObjectId, ref: 'products' },
      cartProducts: [cartProducts],
      isPlaced: { type: Boolean, required: true }
    },
    {
      timestamps: true
    }
  )

  return mongooseClient.model('carts', carts)
}
