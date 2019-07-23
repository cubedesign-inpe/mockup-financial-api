'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ObservationSchema extends Schema {
  up() {
    this.create('observations', table => {
      table.increments()
      table.timestamps()
      table
        .integer('team_id')
        .unsigned()
        .references('id')
        .inTable('teams')
        .notNullable()
        .onDelete('CASCADE')
      table.json('observation')
      table
        .integer('created_by')
        .unsigned()
        .references('id')
        .inTable('users')
    })
  }

  down() {
    this.drop('observations')
  }
}

module.exports = ObservationSchema
