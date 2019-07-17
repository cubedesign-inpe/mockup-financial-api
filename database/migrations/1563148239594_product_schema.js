'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up() {
    this.create('products', table => {
      table.increments()
      table.text('name').notNullable()
      table.text('picture')
      table.float('base_price').notNullable()
      table.text('status')
      table.timestamps()
      table
        .integer('created_by')
        .unsigned()
        .references('id')
        .inTable('users')
    })
  }

  down() {
    this.drop('products')
  }
}

module.exports = ProductSchema
