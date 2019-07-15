'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class TeamSeeder {
  async run () {
    const createdTeam = await Factory.model('App/Models/Team').createMany(3)
  }
}

module.exports = TeamSeeder
