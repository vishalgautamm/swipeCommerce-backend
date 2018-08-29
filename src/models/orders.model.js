const ObjectId = require('mongoose').Schema.Types.ObjectId

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const addresses = new Schema(
    {
      streetNumber: { type: Number, required: true },
      suite: { type: String, required: [true, 'Error, cannot be blank'] },
      street: { type: String, required: [true, 'Error, cannot be blank'] },
      city: { type: String, required: [true, 'Error, cannot be blank'] },
      province: { type: String, required: [true, 'Error, cannot be blank'] },
      postalCode: { type: String, required: [true, 'Error, cannot be blank'] },
      country: { type: String, required: [true, 'Error, cannot be blank'] },
      latitude: { type: Number },
      longtitude: { type: Number }
    },
    {
      timestamps: true
    }
  )
  const orderDetails = new Schema(
    {
      productId: {
        type: ObjectId,
        ref: 'products'
      },
      title: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      displayName: {
        type: String,
        required: true
      },
      address: { type: addresses, required: true }
    },
    {
      timestamps: true
    }
  )

  const orders = new Schema(
    {
      status: { type: Number, required: true },
      orderDetails: [orderDetails],
      total: {type: Number, required: true},
      transactionIds: [
        {
          type: ObjectId,
          ref: 'transactions'
        }
      ]
    },
    {
      timestamps: true
    }
  )

  return mongooseClient.model('orders', orders)
}
