module.exports = () => async context => {
  context.params.query = {
    ...(context.params.query || {}),
    $populate: 'reviewIds'
  }

  return context
}
