'use strict'

const { before, beforeEach, after, afterEach, test, trait } = use('Test/Suite')(
  'Team'
)
const Factory = use('Factory')

const Team = use('App/Models/Team')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

let user = null

beforeEach(async () => {
  user = await Factory.model('App/Models/User').create()
})

test('can index teams', async ({ client, assert }) => {
  const teams = await Factory.model('App/Models/Team').makeMany(4)
  const response = await client
    .get(`teams`)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  assert.isAtLeast(
    response.body.length,
    teams.length,
    'Did not return the minimum of teams'
  )
})

test('can get team detail', async ({ client, assert }) => {
  const team = await Factory.model('App/Models/Team').create()
  const response = await client
    .get(`teams/${team.id}`)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    name: team.name,
    total: team.total,
  })
})

test('can delete an team', async ({ client, assert }) => {
  const team = await Factory.model('App/Models/Team').create()
  const deletion = await client
    .delete(`teams/${team.id}`)
    .loginVia(user, 'jwt')
    .end()
  deletion.assertStatus(200)
  let createdTeam = await Team.findBy('id', team.id)
  assert.isNull(createdTeam)
})

test('can update team name', async ({ client, assert }) => {
  const team = await Factory.model('App/Models/Team').create()
  const teamChanges = {
    name: 'Biscuit',
  }
  const response = await client
    .put(`teams/${team.id}`)
    .send(teamChanges)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  const updatedTeam = await Team.findBy('id', team.id)
  assert.equal(
    updatedTeam.name,
    teamChanges.name,
    "Team total isn't being updated"
  )
})
