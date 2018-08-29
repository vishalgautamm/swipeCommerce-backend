const Forbidden = require('@feathersjs/errors/lib').Forbidden

module.exports = (first, idKey) => async context => {
  const {
    id,
    params: { user, provider }
  } = context

  if (!user && !provider) return context

  if (!id) throw new Forbidden('Multi-entry records not allowed.')

  if (!user[first] || !user[first][idKey]) throw new Forbidden()

  if (Array.isArray(user[first][idKey])) {
    if (user[first][idKey].every(_id => id.toString() !== _id.toString())) {
      throw new Forbidden('You are not the owner.')
    }
  } else {
    if (user[first][idKey].toString() !== id.toString()) {
      throw new Forbidden('You are not the owner.')
    }
  }

  return context
}
