const app = require('../../src/app')

process.env.NODE_ENV = 'test'

const CATEGORIES = [
  '5b6c69e81c12cd298894e468',
  '5b6c69e81c12cd298894e467',
  '5b6c69e81c12cd298894e466',
  '5b6c69e81c12cd298894e465',
  '5b6c69e71c12cd298894e464'
]

describe('\'reviews\' service', () => {

  const newReview = async () => {
    const data = {
      displayName: 'John Smith',
      email: `re${~~(Math.random() * 10000)}vi${~~(Math.random() * 10000)}ew${~~(Math.random() * 10000)}@test.com`,
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

    // const user = await app.service('users').create(data)

    const dataProduct = {
      images: [
        'https://cdn8.bigcommerce.com/s-k11cg5mzh9/images/stencil/500x659/products/123/588/14aceff30f3b64d8937419039e5b77ee2ee53b4e7795f9d4ac50031527f6ee19__91144.1533448991.jpg?c=2',
        'https://cdn8.bigcommerce.com/s-k11cg5mzh9/images/stencil/500x659/products/123/588/14aceff30f3b64d8937419039e5b77ee2ee53b4e7795f9d4ac50031527f6ee19__91144.1533448991.jpg?c=2',
        'https://cdn8.bigcommerce.com/s-k11cg5mzh9/images/stencil/500x659/products/123/588/14aceff30f3b64d8937419039e5b77ee2ee53b4e7795f9d4ac50031527f6ee19__91144.1533448991.jpg?c=2',
        'https://cdn8.bigcommerce.com/s-k11cg5mzh9/images/stencil/500x659/products/123/588/14aceff30f3b64d8937419039e5b77ee2ee53b4e7795f9d4ac50031527f6ee19__91144.1533448991.jpg?c=2'
      ],
      qInStock: 5,
      description: 'I am a product',
      status: 1,
      rating: 4,
      price: 200,
      title: 'Crusher Wireless Headphones',
      city: 'Montreal',
      categoryId: CATEGORIES[~~(Math.random() * CATEGORIES.length)],
      userId: '5b6be2e63a2628e21ec47a01'
    }

    const product = await app.service('products').create(
      dataProduct
    )

    const dataReview = {
      content: 'I love these Headphones! they are the best ones i have ever owned. these offer a great sound quality while being really comfortable all at a reasonable price. I refuse to pay crazy prices just for a brand or artist name. Also, i have a cerebral shunt and most headphones push on the shunt site and cause me a good deal of discomfort but these Uproar headphones do no such thing. they do not put pressure on my ears or head but yet are just tight enough to stay on my head! Also the sound is awesome, especially the bass. ',
      userId: '5b6be2e63a2628e21ec47a01',
      productId: product._id
    }

    const cartData = {
      content: 'Hello Nice product!',
      userId: '5b6be2e63a2628e21ec47a01'
    }

    const cart = await app.service('carts').create(
      cartData
    )

    await app.service('carts').patch(cart._id, {
      $push: { cartProducts: { productId: product._id } }
    })

    const productData = {
      cartId: cart._id,
      userId: '5b6be2e63a2628e21ec47a01',
      status: 1
    }

    await app.service('orders').create(
      productData
    )

    await app.service('reviews').create(
      dataReview
    )
    await app.service('reviews').create(
      dataReview
    )
  }

  it('create 10 products', async () => {
    await Promise.all([...Array(10)].map(newReview))
  })
})
