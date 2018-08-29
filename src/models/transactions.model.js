module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const transactions = new Schema(
    {
      id: { type: String, required: true },
      amount: { type: Number, required: true },
      type: { type: String, required: true },
      paid: { type: Boolean, required: true },
      status: { type: String, required: true },
      last4: { type: Number, required: true }
    },
    {
      timestamps: true
    }
  )

  return mongooseClient.model('transactions', transactions)
}
