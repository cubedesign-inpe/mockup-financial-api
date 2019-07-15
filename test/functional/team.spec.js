'use strict'

const { test, trait } = use('Test/Suite')('Team')
const Team = use('App/Models/Team')
const User = use('App/Models/User')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('can index teams', async ({ client, assert }) => {
  const user = await User.find(1)
  const response = await client
    .get('teams')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('can create team', async ({ client, assert }) => {
  const user = await User.find(1)
  const testTeam = {
    name: 'testtteam',
    total: 100,
  }
  const response = await client
    .post('teams')
    .send(testTeam)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  const createdTeam = await Team.findBy('id', response.body.id)
  response.assertJSONSubset({
    name: createdTeam.name,
    total: createdTeam.total,
  })
})

test('can delete a team', async ({ client, assert }) => {
  const user = await User.find(1)
  const testTeam = {
    name: 'testtteam',
    total: 100,
  }
  const response = await client
    .post('teams')
    .send(testTeam)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  let createdTeam = await Team.findBy('id', response.body.id)
  response.assertJSONSubset({
    name: createdTeam.name,
    total: createdTeam.total,
  })
  const deletion = await client
    .delete(`teams/${response.body.id}`)
    .loginVia(user, 'jwt')
    .end()
  deletion.assertStatus(200)
  createdTeam = await Team.findBy('id', response.body.id)
  assert.isNull(createdTeam)
})
