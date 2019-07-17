'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TeamSchema extends Schema {
  up() {
    this.create('teams', table => {
      table.increments()
      table
        .text('name')
        .notNullable()
        .unique()
      table.float('total').notNullable()
      table.timestamps()
      table
        .integer('created_by')
        .unsigned()
        .references('id')
        .inTable('users')
    })
  }

  down() {
    this.drop('teams')
  }
}

module.exports = TeamSchema
