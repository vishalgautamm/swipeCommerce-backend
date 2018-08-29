const ObjectId = require('mongoose').Schema.Types.ObjectId

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')

  const { Schema } = mongooseClient

  const customers = new Schema(
    {
      cartId: { type: ObjectId, ref: 'carts' },
      orderIds: [{ type: ObjectId, ref: 'orders' }]
    },
    {
      timestamps: true
    }
  )

  const sellers = new Schema(
    {
      productIds: [{ type: ObjectId, ref: 'products' }],
      orderIds: [{ type: ObjectId, ref: 'orders' }]
    },
    {
      timestamps: true
    }
  )

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

  const users = new Schema(
    {
      googleId: { type: String },
      email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"]
      },
      displayName: String,
      customer: customers,
      seller: sellers,
      addresses: [addresses]
    },
    {
      timestamps: true
    }
  )

  return mongooseClient.model('users', users)
}
