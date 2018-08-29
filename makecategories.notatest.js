const app = require('../../src/app')

process.env.NODE_ENV = 'test'

describe('\'categories\' service', () => {
  it('makes Categories', async () => {
    const data1 = {
      name: 'Cell Phones'
    }
    const data2 = {
      name: 'Laptops'
    }
    const data3 = {
      name: 'Desktops'
    }
    const data4 = {
      name: 'Software'
    }
    const data5 = {
      name: 'Components'
    }
    await app.service('categories').create(data1)
    await app.service('categories').create(data2)
    await app.service('categories').create(data3)
    await app.service('categories').create(data4)
    await app.service('categories').create(data5)
  })
})
