const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

const populateMonths = (key, label) => ({
  [key]: {
    ...MONTHS.reduce(
      (acc, month) => ({
        ...acc,
        [month]: { [label]: 0 }
      }),
      {}
    )
  }
})

module.exports = () => async context => {
  const type = Object.keys(context.params.query)[0]
  switch (type) {
    case 'dashboard':
      return getDashboardStats(context)
    case 'reports':
      return getReportsStats(context)
    default:
      return context
  }
}

const getReportsStats = async context => {
  const { app } = context
  const users = await app.service('users').find({})
  const productTotals = {}
  const userData = await Promise.all(
    users.data.map(async user => {
      const totals = { total: 0, units: 0 }
      for (let orderId of user.seller.orderIds) {
        const { orderDetails } = await app
          .service('orders')
          .get(orderId, { query: { seller: true, userId: user._id } })

        const total = orderDetails.reduce((acc, orderDetail) => {
          const totalsForProduct = productTotals[orderDetail.productId]
          productTotals[orderDetail.productId] = {
            total: ((totalsForProduct && totalsForProduct.total) || 0) + 1,
            title: orderDetail.title,
            seller: user.displayName
          }
          return acc + orderDetail.price
        }, 0)

        totals.total += total
        totals.units += orderDetails.length
      }

      return {
        ...totals,
        displayName: user.displayName
      }
    })
  )

  const topSellers = userData.sort((a, b) => b.total - a.total).slice(0, 10)
  const topProducts = Object.values(productTotals)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
  context.result = {
    topSellers,
    topProducts
  }

  return context
}

const getDashboardStats = async context => {
  const { app } = context
  const users = await app.service('users').find({})
  const userData = users.data.reduce(
    (acc, user) => {
      const month = MONTHS[user.createdAt.getMonth() - 1]
      return {
        totalUsers: (acc.customers || 0) + 1,
        usersByMonth: {
          ...acc.usersByMonth,
          [month]: {
            users:
              ((acc.usersByMonth[month] && acc.usersByMonth[month].users) ||
                0) + 1
          }
        },
        totalSellers: user.seller.productIds.length
          ? (acc.totalSellers || 0) + 1
          : acc.totalSellers || 0
      }
    },
    { ...populateMonths('usersByMonth', 'users') }
  )

  const products = await app.service('products').find({})
  const productData = { totalProducts: products.total }
  const sales = await app.service('orders').find({})
  const salesData = sales.data.reduce(
    (acc, order) => {
      const month = MONTHS[order.updatedAt.getMonth() - 1]
      return {
        totalSales: (acc.totalSales || 0) + (order.total || 0),
        salesByMonth: {
          ...acc.salesByMonth,
          [month]: {
            sales:
              ((acc.salesByMonth[month] && acc.salesByMonth[month].sales) ||
                0) + (order.total || 0)
          }
        },
        unitsByMonth: {
          ...acc.unitsByMonth,
          [month]: {
            units:
              ((acc.unitsByMonth[month] && acc.unitsByMonth[month].units) ||
                0) + order.orderDetails.length
          }
        },
        ordersByMonth: {
          ...acc.ordersByMonth,
          [month]: {
            orders:
              ((acc.ordersByMonth[month] && acc.ordersByMonth[month].orders) ||
                0) + 1
          }
        }
      }
    },
    {
      ...populateMonths('salesByMonth', 'sales'),
      ...populateMonths('unitsByMonth', 'units'),
      ...populateMonths('ordersByMonth', 'orders')
    }
  )

  context.result = {
    ...userData,
    ...productData,
    ...salesData
  }
  return context
}
