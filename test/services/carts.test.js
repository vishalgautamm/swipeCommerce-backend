const assert = require('assert')
// const mocha = require('mocha')
const app = require('../../src/app')

let cart
let user
let product

process.env.NODE_ENV = 'test'

const CATEGORIES = [
  '5b6c69e81c12cd298894e468',
  '5b6c69e81c12cd298894e467',
  '5b6c69e81c12cd298894e466',
  '5b6c69e81c12cd298894e465',
  '5b6c69e71c12cd298894e464'
]
describe('\'carts\' service', () => {
  before(async () => {
    const data = {
      displayName: 'John Smith',
      email: `review${~~(Math.random() * 100000)}@test.com`,
      addresses: [{
        streetNumber: ~~(Math.random() * 500000),
        suite: '12a',
        street: 'St Johns',
        city: 'Montreal',
        province: 'QC',
        postalCode: 'H4H 2G4',
        country: 'Canada'
      }]
    }

    user = await app.service('users').create(data)

    const dataProduct = {
      images: ['www.test.com'],
      qInStock: 5,
      description: 'I am a product',
      status: 1,
      city: 'Montreal',
      price: 123,
      title: 'Crazy Product' + (~~(Math.random() * 10000)),
      categoryId: CATEGORIES[~~(Math.random() * CATEGORIES.length)],
      userId: user._id
    }

    product = await app.service('products').create(
      dataProduct,
      { query: { userId: user._id } }
    )

  })

  it('registered the service', () => {
    const service = app.service('carts')

    assert.ok(service, 'Registered the service')
  })

  it('creates a new cart', async () => {
    const data = {
      userId: user._id
    }

    cart = await app.service('carts').create(
      data
    )

    assert(cart._id)
  })

  it('Can find user by cartId', async () => {
    const result = await app.service('users').find({
      query: {
        'customer.cartId': cart._id
      }
    })
    assert(result.data.some(
      res => res._id.toString() === user._id.toString())
    )
  })

  it('Adds the cart id to the user', async () => {
    const updatedUser = await app.service('users').get(user._id)
    assert(updatedUser.customer.cartId.toString() === cart._id.toString())
  })

  it('Can add a product to the cart', async () => {
    await app.service('carts').patch(cart._id, {
      $push: { cartProducts: { productId: product._id } }
    })
    const result = await app.service('carts').Model.countDocuments({
      _id: cart._id,
      'cartProducts.productId': { $in: [product._id] }
    })

    assert(result > 0)
  })

  it('Can delete the cart', async () => {
    await app.service('carts').remove(cart._id)
    const TryToFindcartShouldFail = await app.service('carts').find({
      query: {
        _id: cart._id.toString()
      }
    })
    assert(TryToFindcartShouldFail.total === 0)
  })

  it('Removed the cart Id from the user', async () => {
    const updatedUser = await app.service('users').get(user._id)
    assert(updatedUser.customer.cartId == null)
  })
})
