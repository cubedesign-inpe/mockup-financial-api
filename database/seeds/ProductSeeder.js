'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class ProductSeeder {
  async run() {
    const createdProducts = await Factory.model(
      'App/Models/Product'
    ).createMany(5)
  }
}

module.exports = ProductSeeder
