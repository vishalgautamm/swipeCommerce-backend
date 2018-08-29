const users = require('./users/users.service.js')
const reviews = require('./reviews/reviews.service.js')
const products = require('./products/products.service.js')
const carts = require('./carts/carts.service.js')
const orders = require('./orders/orders.service.js')

const categories = require('./categories/categories.service.js');

const transactions = require('./transactions/transactions.service.js');

const statistics = require('./statistics/statistics.service.js');

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users)
  app.configure(reviews)
  app.configure(products)
  app.configure(carts)
  app.configure(orders)
  app.configure(categories)
  app.configure(transactions);
  app.configure(statistics);
}
