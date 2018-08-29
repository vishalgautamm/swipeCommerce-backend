const assert = require('assert')
// const mocha = require('mocha')
const app = require('../../src/app')
let review
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
describe('\'reviews\' service', () => {
  before(async () => {
    const data = {
      displayName: 'John Smith',
      email: `review${~~(Math.random() * 10000)}@test.com`,
      addresses: [{
        streetNumber: ~~(Math.random() * 50000),
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

    product = await app.service('products').create(
      dataProduct
    )
  })

  it('registered the service', () => {
    const service = app.service('reviews')

    assert.ok(service, 'Registered the service')
  })

  it('creates a new review', async () => {
    const data = {
      content: 'I love these Headphones! they are the best ones i have ever owned. these offer a great sound quality while being really comfortable all at a reasonable price. I refuse to pay crazy prices just for a brand or artist name. Also, i have a cerebral shunt and most headphones push on the shunt site and cause me a good deal of discomfort but these Uproar headphones do no such thing. they do not put pressure on my ears or head but yet are just tight enough to stay on my head! Also the sound is awesome, especially the bass. ',
      userId: user._id,
      productId: product._id
    }

    review = await app.service('reviews').create(
      data
    )

    assert(review._id)
  })

  it('Can find review by userId', async () => {
    // this list all the reviews from by one user
    const result = await app.service('reviews').find({
      query: {
        'userId': user._id
      }
    })

    assert(result.data.some(
      res => res._id.toString() === review._id.toString())
    )
  })

  it('Adds the review id to the product', async () => {
    const updatedProduct = await app.service('products').get(product._id)
    assert(updatedProduct.reviewIds.some(_review =>
      _review._id.toString() === review._id.toString()
    ))
  })

  it('Can delete the review', async () => {
    await app.service('reviews').remove(review._id)
    const TryToFindreviewShouldFail = await app.service('reviews').find({
      query: {
        _id: review._id
      }
    })

    assert(TryToFindreviewShouldFail.total === 0)
  })

  it('Removed the review Id from the product', async () => {
    const updatedProduct = await app.service('products').get(product._id)

    assert(!updatedProduct.reviewIds.some(reviewId =>
      reviewId.toString() === review._id
    ))
  })
})
