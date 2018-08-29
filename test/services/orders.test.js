const assert = require('assert')
const app = require('../../src/app')

let order
let cart
let user
let seller
let product

process.env.NODE_ENV = 'test'

const CATEGORIES = [
  '5b6c69e81c12cd298894e468',
  '5b6c69e81c12cd298894e467',
  '5b6c69e81c12cd298894e466',
  '5b6c69e81c12cd298894e465',
  '5b6c69e71c12cd298894e464'
]
describe('\'orders\' service', () => {

  before(async () => {
    const data = {
      displayName: 'John Smith',
      email: `review${~~(Math.random() * 100000)}@test.com`,
      addresses: [{
        streetNumber: ~~(Math.random() * 500002),
        suite: '12a',
        street: 'St Johns',
        city: 'Montreal',
        province: 'QC',
        postalCode: 'H4H 2G4',
        country: 'Canada'
      }]
    }

    user = await app.service('users').create(data)

    const sellerData = {
      displayName: 'Seller',
      email: `review${~~(Math.random() * 100000)}@test.com`,
      addresses: [{
        streetNumber: ~~(Math.random() * 500002),
        suite: '12a',
        street: 'St Johns',
        city: 'Montreal',
        province: 'QC',
        postalCode: 'H4H 2G4',
        country: 'Canada'
      }]
    }

    seller = await app.service('users').create(sellerData)

    const dataProduct = {
      images: ['www.test.com'],
      qInStock: 5,
      description: 'I am a product',
      categoryId: CATEGORIES[~~(Math.random() * CATEGORIES.length)],
      status: 1,
      city: 'Montreal',
      price: 123,
      title: 'Crazy Product' + (~~(Math.random() * 10000)),
      userId: seller._id
    }

    product = await app.service('products').create(
      dataProduct
    )

    const cartData = {
      content: 'Hello Nice product!',
      userId: user._id
    }

    cart = await app.service('carts').create(
      cartData
    )

    await app.service('carts').patch(cart._id, {
      $push: { cartProducts: { productId: product._id } }
    })
  })

  it('registered the service', () => {
    const service = app.service('orders')

    assert.ok(service, 'Registered the service')
  })

  it('creates a new order', async () => {
    const data = {
      cartId: cart._id,
      userId: user._id,
      status: 0
    }

    order = await app.service('orders').create(
      data
    )

    assert(order._id)
  })

  it('Can find order by userId', async () => {
    // this list all the orders from by one user
    const result = await app.service('users').find({
      query: {
        'customer.orderIds': { $in: [order._id] }
      }
    })

    assert(result.data.some(
      res => res._id.toString() === user._id.toString())
    )
  })

  it('Adds the order id to the user', async () => {
    const updatedUser = await app.service('users').get(user._id)
    assert(updatedUser.customer.orderIds.some(
      res => res._id.toString() === order._id.toString())
    )
  })

  it('Adds the order id to the seller', async () => {
    const updatedSeller = await app.service('users').get(seller._id)
    assert(updatedSeller.seller.orderIds.some(
      res => res._id.toString() === order._id.toString())
    )
  })

  it('Adds all the products', async () => {
    assert(
      order.orderDetails.some(op =>
        op.productId.toString() === product._id.toString()
      )
    )
  })

  it('Only returns order details to the seller', async () => {
    const updatedSeller = await app.service('users').get(seller._id)
    const result = await app.service('orders').get(order._id,
      { user: updatedSeller }
    )
    assert(result.status === undefined)
  })
})
