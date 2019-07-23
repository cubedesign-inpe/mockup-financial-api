'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class OrderSeeder {
  async run() {
    const createdTeam = await Factory.model('App/Models/Team').create()
    const createdProducts = await Factory.model(
      'App/Models/Product'
    ).createMany(5)
    const createdOrder = await Factory.model('App/Models/Order').create({
      team_id: createdTeam.id,
    })
    /*
    const createdOrderProducts = Promise.all(
      createdProducts.map(
        async _ =>
          await Factory.model('App/Models/OrderProducts').create({
            product_id: _.id,
            order_id: createdOrder.id,
          })
      )
    )
    await createdOrder.products().attach(createdOrderProducts)
    await createdTeam.orders().attach(createdOrders)
    */
  }
}

module.exports = OrderSeeder
