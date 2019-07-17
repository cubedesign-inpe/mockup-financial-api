'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class OrderSeeder {
  async run() {
    const createdTeams = await Factory.model('App/Models/Team').createMany(3)
    const mainTeam = createdTeams[1]
    const createdProducts = await Factory.model(
      'App/Models/Product'
    ).createMany(5)
  }
}

module.exports = OrderSeeder
