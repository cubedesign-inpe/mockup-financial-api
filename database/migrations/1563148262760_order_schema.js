'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderSchema extends Schema {
  up() {
    this.create('orders', table => {
      table.increments()
      table
        .integer('team_id')
        .unsigned()
        .references('id')
        .inTable('teams')
        .notNullable()
        .onDelete('CASCADE')
      table.timestamps()
      table.float('price_penalty')
      table.float('total')
      table.text('status')
      table
        .integer('created_by')
        .unsigned()
        .references('id')
        .inTable('users')
    })
  }

  down() {
    this.drop('orders')
  }
}

module.exports = OrderSchema
