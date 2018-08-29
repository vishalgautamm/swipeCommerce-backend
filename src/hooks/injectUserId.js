const Forbidden = require('@feathersjs/errors/lib')

module.exports = () => async context => {
  console.log('we was here')
  console.log(context.params.user)
  console.log(context.params.provider)
  const { params: { user, provider } } = context

  if (!provider) return

  if (!user._id) throw new Forbidden()

  context.data.userId = user._id

  return context
}
