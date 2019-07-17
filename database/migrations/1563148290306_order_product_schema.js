'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderProductSchema extends Schema {
  up() {
    this.create('order_products', table => {
      table.increments()
      table.timestamps()
      table
        .integer('order_id')
        .unsigned()
        .references('id')
        .inTable('orders')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
      table.integer('quantity').notNullable()
    })
  }

  down() {
    this.drop('order_products')
  }
}

module.exports = OrderProductSchema
