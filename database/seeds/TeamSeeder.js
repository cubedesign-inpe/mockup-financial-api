'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class TeamSeeder {
  async run() {
    const createdTeams = await Factory.model('App/Models/Team').createMany(3)
    const createdObservation = await Factory.model('App/Models/Observation').create({
      team_id: createdTeams[0].id,
    })
  }
}

module.exports = TeamSeeder
