'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransactionSchema extends Schema {
  up() {
    this.create('transactions', table => {
      table.increments()
      table
        .integer('team_id')
        .unsigned()
        .references('id')
        .inTable('teams')
        .notNullable()
        .onDelete('CASCADE')
      table.float('delta').notNullable()
      table
        .integer('order_id')
        .unsigned()
        .references('id')
        .inTable('orders')
        .onDelete('CASCADE')
      table.timestamps()
      table
        .integer('created_by')
        .unsigned()
        .references('id')
        .inTable('users')
    })
  }

  down() {
    this.drop('transactions')
  }
}

module.exports = TransactionSchema
