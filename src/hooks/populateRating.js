const getRating = reviews =>
  reviews.reduce((acc, curr, idx, arr) => {
    const { rating } = curr
    const total = acc + rating
    if (idx === arr.length - 1) {
      return total / arr.length
    }
    return total
  }, 0)

module.exports = () => context => {
  if (context.method === 'find') {
    context.result = {
      ...context.result,
      data: context.result.data.map(product => ({
        ...product,
        rating: getRating(product.reviewIds)
      }))
    }
    return context
  }

  if (!context.result.reviewIds) return context

  context.result = {
    ...context.result,
    rating: getRating(context.result.reviewIds)
  }

  return context
}
