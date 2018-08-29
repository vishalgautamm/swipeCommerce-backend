const ObjectId = require('mongoose').Schema.Types.ObjectId

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const reviews = new Schema(
    {
      userId: {
        type: ObjectId,
        ref: 'users'
      },
      content: {
        type: String,
        required: [true, 'Cannot be blank']
      },
      review: {
        type: String,
        required: [true, 'Cannot be blank']
      },
      rating: { type: Number, min: 1, max: 5 }
    },
    {
      timestamps: true
    }
  )

  return mongooseClient.model('reviews', reviews)
}
