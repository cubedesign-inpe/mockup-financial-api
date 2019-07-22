'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

const Logger = use('Logger')
const User = use('App/Models/User')

class UserSeeder {
  async run() {
    const createdUsers = await Factory.model('App/Models/User').createMany(5)
    const mainUser = await Factory.model('App/Models/User').create({
      email: 'cube@inpe.br',
      password: 'cubedesign',
    })
    const adminUser = {
      username: 'cubedesign',
      full_name: 'CubeDesign',
      email: 'cubedesign@inpe.br',
      password: 'cubedesign',
    }
    const user = await User.create(adminUser)
    Logger.info(`Created user ${user.email}`)
  }
}

module.exports = UserSeeder
