'use strict'

const { before, beforeEach, after, afterEach, test, trait } = use('Test/Suite')(
  'User'
)
const Factory = use('Factory')

const User = use('App/Models/User')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('can create user', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').make()
  const testUser = {
    username: user.username,
    full_name: user.full_name,
    email: user.email,
    password: user.password,
  }
  const response = await client
    .post('users')
    .send(testUser)
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    username: user.username,
    email: user.email,
  })
  const createdUser = await User.findBy('username', user.username)
  response.assertJSONSubset({
    username: createdUser.username,
    email: createdUser.email,
  })
})

test('cannot create user if invalid', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').make()
  const testUser = {
    username: null,
    full_name: user.full_name,
    email: '123',
    password: user.password,
  }
  const response = await client
    .post('users')
    .send(testUser)
    .end()
  response.assertStatus(400)
  response.assertJSONSubset([
    {
      message: 'You must provide a valid email address.',
      field: 'email',
      validation: 'email',
    },
    {
      message: 'You must provide an username.',
      field: 'username',
      validation: 'required',
    },
  ])
})
