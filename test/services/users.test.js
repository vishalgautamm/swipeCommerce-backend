const assert = require('assert')
// const mocha = require('mocha')
const app = require('../../src/app')

let user

process.env.NODE_ENV = 'test'

describe('\'users\' service', () => {
  it('registered the service', () => {
    const service = app.service('users')

    assert.ok(service, 'Registered the service')
  })

  it('Can create a new user', async () => {
    const data = {
      displayName: 'John Smith',
      email: `t${~~(Math.random() * 10000000)}est${~~(Math.random() * 10000000)}@test.com`,
      addresses: [{
        streetNumber: ~~((Math.random() * 50000000)),
        suite: '12a',
        street: 'St Johns',
        city: 'Montreal',
        province: 'QC',
        postalCode: 'H4H 2G4',
        country: 'Canada'
      }]
    }
    user = await app.service('users').create(data)
    assert(user._id)
  })

  it('Can find user by street number', async () => {
    const result = await app.service('users').find({
      query: {
        'addresses.streetNumber': user.addresses[0].streetNumber
      }
    })

    assert(result.data[0]._id.toString() === user._id.toString())
  })

  it('Can change user country', async () => {
    const result = await app.service('users').patch(user._id, {
      addresses: {
        ...user.addresses[0],
        country: 'United States'
      }
    })

    assert(result.addresses[0].country === 'United States')
  })

  it('Only GET/PATCH the profile of the logged in user', async () => {
    const data = {
      displayName: 'New Smith',
      email: `test${~~(Math.random() * 1000)}@test.com`
    }

    const newUser = await app.service('users').create(data)

    const result = await app.service('users').get(newUser._id, {
      user
    })

    assert(result._id.toString() === user._id.toString())

    const patchedResult = await app.service('users').patch(newUser._id, {
      displayName: 'Tried To Hack'
    }, { user })

    const updatedUser = await app.service('users').get(user._id)
    const updatedNewUser = await app.service('users').get(newUser._id)

    assert(patchedResult._id.toString() === updatedUser._id.toString())
    assert(updatedNewUser.displayName === 'New Smith')
    assert(updatedUser.displayName === 'Tried To Hack')
  })

  it('Can delete the user', async () => {
    await app.service('users').remove(user._id)
    const TryToFindUserShouldFail = await app.service('users').find({
      query: {
        _id: user._id
      }
    })

    assert(TryToFindUserShouldFail.total === 0)
  })
})
