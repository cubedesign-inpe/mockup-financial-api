'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

const Logger = use('Logger')

class UserSeeder {
  async run() {
    const createdUsers = await Factory.model('App/Models/User').createMany(5)
    const mainUser = await Factory.model('App/Models/User').create({
      email: 'cube@inpe.br',
      password: 'cubedesign',
    })
    const users = await Database.table('users')
  }
}

module.exports = UserSeeder
