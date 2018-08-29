const assert = require('assert')
const chai = require('chai')
const expect = require('chai').expect
const chaiAsPromised = require('chai-as-promised')
const app = require('../../src/app')
const BadRequest = require('@feathersjs/errors/lib').BadRequest
const Forbidden = require('@feathersjs/errors/lib').Forbidden
const NotFound = require('@feathersjs/errors/lib').NotFound

let product
let user

process.env.NODE_ENV = 'test'

const CATEGORIES = [
  '5b6c69e81c12cd298894e468',
  '5b6c69e81c12cd298894e467',
  '5b6c69e81c12cd298894e466',
  '5b6c69e81c12cd298894e465',
  '5b6c69e71c12cd298894e464'
]
chai.use(chaiAsPromised)

describe("'products' service", () => {
  before(async () => {
    const data = {
      displayName: 'John Smith',
      email: `product${Math.random() * 10000}@test.com`,
      addresses: [
        {
          streetNumber: ~~(Math.random() * 50000),
          suite: '12a',
          street: 'St Johns',
          city: 'Montreal',
          province: 'QC',
          postalCode: 'H4H 2G4',
          country: 'Canada'
        }
      ]
    }
    user = await app.service('users').create(data)
  })

  it('registered the service', () => {
    const service = app.service('products')

    assert.ok(service, 'Registered the service')
  })

  it('creates a new product', async () => {
    const data = {
      images: [
        'https://cdn8.bigcommerce.com/s-k11cg5mzh9/images/stencil/500x659/products/123/588/14aceff30f3b64d8937419039e5b77ee2ee53b4e7795f9d4ac50031527f6ee19__91144.1533448991.jpg?c=2',
        'https://cdn8.bigcommerce.com/s-k11cg5mzh9/images/stencil/500x659/products/123/588/14aceff30f3b64d8937419039e5b77ee2ee53b4e7795f9d4ac50031527f6ee19__91144.1533448991.jpg?c=2',
        'https://cdn8.bigcommerce.com/s-k11cg5mzh9/images/stencil/500x659/products/123/588/14aceff30f3b64d8937419039e5b77ee2ee53b4e7795f9d4ac50031527f6ee19__91144.1533448991.jpg?c=2',
        'https://cdn8.bigcommerce.com/s-k11cg5mzh9/images/stencil/500x659/products/123/588/14aceff30f3b64d8937419039e5b77ee2ee53b4e7795f9d4ac50031527f6ee19__91144.1533448991.jpg?c=2'
      ],
      qInStock: 5,
      categoryId: CATEGORIES[~~(Math.random() * CATEGORIES.length)],
      description: 'I am a product',
      status: 1,
      rating: 4,
      price: 200,
      title: 'Crusher Wireless Headphones',
      city: 'Montreal',
      userId: user._id
    }

    product = await app.service('products').create(data)
    assert(product._id)
  })

  it('Can find product by city', async () => {
    const result = await app.service('products').find({
      query: {
        city: 'Montreal'
      }
    })

    assert(
      result.data.some(res => res._id.toString() === product._id.toString())
    )
  })

  it('Can change product city', async () => {
    const result = await app.service('products').patch(product._id, {
      city: 'Toronto'
    })

    assert(result.city === 'Toronto')
  })

  it('Should throw BadRequest if no userId is passed', async () => {
    const data = {
      images: ['www.test.com'],
      qInStock: 5,
      categoryId: CATEGORIES[~~(Math.random() * CATEGORIES.length)],
      description: 'I am a product',
      status: 1,
      price: 1234,
      title: 'Sample product',
      city: 'Montreal'
    }
    await expect(
      app.service('products').create(data)
    ).to.be.rejectedWith(BadRequest)
  })

  it('Should throw BadRequest userId is not found', async () => {
    const data = {
      images: ['www.test.com'],
      qInStock: 5,
      categoryId: CATEGORIES[~~(Math.random() * CATEGORIES.length)],
      description: 'I am a product',
      status: 1,
      price: 1234,
      title: 'Sample product',
      city: 'Montreal',
      userId: '7f7371435676544588585555'
    }

    await expect(
      app.service('products').create(data)
    ).to.be.rejectedWith(BadRequest)
  })

  it('Shouldn\'t filter disabled products with REST', async () => {
    const data = {
      images: [
        'https://cdn8.bigcommerce.com/s-k11cg5mzh9/images/stencil/500x659/products/123/588/14aceff30f3b64d8937419039e5b77ee2ee53b4e7795f9d4ac50031527f6ee19__91144.1533448991.jpg?c=2',
        'https://cdn8.bigcommerce.com/s-k11cg5mzh9/images/stencil/500x659/products/123/588/14aceff30f3b64d8937419039e5b77ee2ee53b4e7795f9d4ac50031527f6ee19__91144.1533448991.jpg?c=2',
        'https://cdn8.bigcommerce.com/s-k11cg5mzh9/images/stencil/500x659/products/123/588/14aceff30f3b64d8937419039e5b77ee2ee53b4e7795f9d4ac50031527f6ee19__91144.1533448991.jpg?c=2',
        'https://cdn8.bigcommerce.com/s-k11cg5mzh9/images/stencil/500x659/products/123/588/14aceff30f3b64d8937419039e5b77ee2ee53b4e7795f9d4ac50031527f6ee19__91144.1533448991.jpg?c=2'
      ],
      qInStock: 5,
      categoryId: CATEGORIES[~~(Math.random() * CATEGORIES.length)],
      description: 'I am a product',
      status: 1,
      rating: 4,
      price: 200,
      title: 'Crusher Wireless Headphones',
      city: 'Montreal',
      userId: user._id
    }

    await app.service('products').create(data)

    const result = await app.service('products').find({})

    assert(
      result.data.some(product => product.status === 0)
    )
  })

  it('Should throw Forbidden if non owners edit other products', async () => {
    const data = {
      displayName: 'John Smith',
      email: `product${Math.random() * 10000}@test.com`,
      addresses: [
        {
          streetNumber: ~~(Math.random() * 50000),
          suite: '12a',
          street: 'St Johns',
          city: 'Montreal',
          province: 'QC',
          postalCode: 'H4H 2G4',
          country: 'Canada'
        }
      ]
    }

    const hackerUser = await app.service('users').create(data)

    const hackerProductData = {
      images: [
        'https://cdn8.bigcommerce.com/s-k11cg5mzh9/images/stencil/500x659/products/123/588/14aceff30f3b64d8937419039e5b77ee2ee53b4e7795f9d4ac50031527f6ee19__91144.1533448991.jpg?c=2',
        'https://cdn8.bigcommerce.com/s-k11cg5mzh9/images/stencil/500x659/products/123/588/14aceff30f3b64d8937419039e5b77ee2ee53b4e7795f9d4ac50031527f6ee19__91144.1533448991.jpg?c=2',
        'https://cdn8.bigcommerce.com/s-k11cg5mzh9/images/stencil/500x659/products/123/588/14aceff30f3b64d8937419039e5b77ee2ee53b4e7795f9d4ac50031527f6ee19__91144.1533448991.jpg?c=2',
        'https://cdn8.bigcommerce.com/s-k11cg5mzh9/images/stencil/500x659/products/123/588/14aceff30f3b64d8937419039e5b77ee2ee53b4e7795f9d4ac50031527f6ee19__91144.1533448991.jpg?c=2'
      ],
      qInStock: 5,
      categoryId: CATEGORIES[~~(Math.random() * CATEGORIES.length)],
      description: 'I am a product',
      status: 1,
      rating: 4,
      price: 200,
      title: 'Crusher Wireless Headphones',
      city: 'Montreal',
      userId: hackerUser._id
    }

    const hackerProduct = await app.service('products').create(hackerProductData)

    await expect(
      app.service('products')
        .patch(
          hackerProduct._id,
          { displayName: 'Hacker' },
          { user: hackerUser }
        )
    ).to.be.rejectedWith(Forbidden)
  })

  it('Adds the product id to the user', async () => {
    const updatedUser = await app.service('users').get(user._id)

    assert(
      updatedUser.seller.productIds.some(
        productId => productId.toString() === product._id.toString()
      )
    )
  })

  it('Shouldn\'t have a userId', async () => {
    assert(product.userId === undefined)
  })

  it('Can delete the product', async () => {
    await app.service('products').remove(product._id)

    await expect(
      app.service('products').get(
        product._id
      )
    ).to.be.rejectedWith(NotFound)
  })

  it('Removed the product Id from the user', async () => {
    const updatedUser = await app.service('users').get(user._id)

    assert(
      !updatedUser.seller.productIds.some(
        productId => productId.toString() === product._id.toString()
      )
    )
  })
})
