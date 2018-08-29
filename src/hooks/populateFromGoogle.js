const BadRequest = require('@feathersjs/errors/lib').BadRequest

module.exports = () => {
  return async function (context) {
    const { data, params } = context
    if (process.env.NODE_ENV === 'test') return context

    if (params.provider && !data.google) {
      throw new BadRequest('Must sign up with Google!')
    }
    // do more security checks for Google only sign ups

    data.email = data.google.profile.emails.find(
      e => e.type === 'account'
    ).value

    data.displayName = data.google.profile.displayName

    return context
  }
}
