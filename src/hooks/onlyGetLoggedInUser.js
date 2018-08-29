const Forbidden = require('@feathersjs/errors/lib')

module.exports = () => async context => {
  try {
    const { params: { user, provider } } = context

    if (!provider && !user) return

    if (provider && !user) throw new Forbidden('Must be logged in')

    context.id = user._id
    return context
  } catch (e) {
    console.log(e)
  }
}
