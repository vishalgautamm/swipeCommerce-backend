const BadRequest = require('@feathersjs/errors/lib').BadRequest

module.exports = (target, service) => async (context) => {
  const { app, data } = context

  if (!data[target]) {
    throw new BadRequest(`Missing '${target}' Parameter`)
  }

  const result = await app
    .service(service)
    .Model
    .countDocuments({ _id: data[target] })

  if (!result) throw new BadRequest(`Passed ${target} id was not found!`)

  return context
}
