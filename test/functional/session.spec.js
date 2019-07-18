'use strict'

const { before, beforeEach, after, afterEach, test, trait } = use('Test/Suite')(
  'Session'
)
const Factory = use('Factory')

const User = use('App/Models/User')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('can create and login user', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').make()
  const testUser = {
    username: user.username,
    email: user.email,
    password: 'something',
  }
  const createResponse = await client
    .post('users')
    .send(testUser)
    .end()
  createResponse.assertStatus(200)
  createResponse.assertJSONSubset({
    email: user.email,
  })
  const response = await client
    .post('sessions')
    .send(testUser)
    .end()
  console.log('Error', response.error)
  response.assertStatus(200)
})
