const ObjectId = require('mongoose').Schema.Types.ObjectId

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const products = new Schema(
    {
      title: {
        type: String,
        required: [true, 'Cannot be blank']
      },
      price: { type: Number, required: [true, 'Cannot be blank'] },
      images: { type: Array },
      qInStock: { type: Number, required: [true, 'Cannot be blank'] },
      reviewIds: [{ type: ObjectId, ref: 'reviews' }],
      categoryId: {
        type: ObjectId,
        required: [true, 'Cannot be blank'],
        ref: 'categories'
      },
      description: { type: String, required: [true, 'Cannot be blank'] },
      status: { type: Number, required: [true, 'Cannot be blank'] },
      city: { type: String, required: [true, 'Cannot be blank'] },
      rating: { type: Number }
    },
    {
      timestamps: true
    }
  )

  products.index({
    title: 'text',
    description: 'text'
  })

  return mongooseClient.model('products', products)
}
