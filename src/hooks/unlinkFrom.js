const BadRequest = require('@feathersjs/errors/lib')

const unlinkTargetFrom = async (context, targetService, targetKey, isArray) => {
  const { app, id } = context
  const targetInstances = await app.service(targetService).find({
    query: {
      [targetKey]: { $in: [id] }
    }
  })

  if (!targetInstances.total) throw BadRequest

  const instanceId = targetInstances.data[0]._id
  const operation = isArray
    ? { $pull: { [targetKey]: id } }
    : { [targetKey]: undefined }

  return app.service(targetService).patch(instanceId, operation)
}

module.exports = targets => async context => {
  await Promise.all(
    targets.map(
      async ({ targetService, sourceIdKey, targetKey, isArray = true }) =>
        unlinkTargetFrom(context, targetService, targetKey, isArray)
    )
  )

  return context
}
