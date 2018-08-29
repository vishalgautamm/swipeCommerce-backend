module.exports = target => async context => {
  const { app, data, result } = context
  await Promise.all(
    target.map(async ({
      targetService, sourceIdKey, targetKey, isArray = true
    }) =>
      app.service(targetService).patch(
        data[sourceIdKey],
        isArray
          ? { $push: { [targetKey]: result._id } }
          : { [targetKey]: result._id }
      )
    )
  )

  return context
}
