const ObjectId = require('mongoose').Schema.Types.ObjectId

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const categories = new Schema(
    {
      name: { type: String, required: [true, 'Cannot be blank'] },
      categoryId: [{ type: ObjectId, ref: 'categories' }],
      productIds: [{ type: ObjectId, ref: 'products' }]
    },
    {
      timestamps: true
    }
  )

  return mongooseClient.model('categories', categories)
}
