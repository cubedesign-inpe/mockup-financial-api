'use strict'

const { test, trait } = use('Test/Suite')('User')
const User = use('App/Models/User')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('can create user', async ({ client, assert }) => {
  const testUser = {
    username: 'test',
    full_name: 'Testing Testington the Third',
    email: 'test@test.com',
    password: 'testing',
  }
  const response = await client
    .post('users')
    .send(testUser)
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    username: 'test',
    email: 'test@test.com',
  })
  const createdUser = await User.findBy('username', 'test')
  response.assertJSONSubset({
    username: createdUser.username,
    email: createdUser.email,
  })
})
