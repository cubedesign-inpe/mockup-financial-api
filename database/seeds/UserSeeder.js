'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class UserSeeder {
  async run() {
    const createdUsers = await Factory.model('App/Models/User').createMany(5)
    const users = await Database.table('users')
  }
}

module.exports = UserSeeder
