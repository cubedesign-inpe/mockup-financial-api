'use strict'

const { before, beforeEach, after, afterEach, test, trait } = use('Test/Suite')(
  'Order'
)
const Factory = use('Factory')

const Order = use('App/Models/Order')
const User = use('App/Models/User')
const Team = use('App/Models/Team')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

// Reuse variables
let user = null
let team = null

beforeEach(async () => {
  user = await Factory.model('App/Models/User').create()
  team = await Factory.model('App/Models/Team').create()
})

test('can index orders', async ({ client, assert }) => {
  const orders = await Factory.model('App/Models/Order').makeMany(2, {
    team_id: team.id,
  })
  orders.forEach(async order => await team.orders().save(order))
  const response = await client
    .get(`teams/${team.id}/orders`)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  assert.equal(response.body.length, orders.length)
  response.assertJSONSubset([
    { team_id: orders[0].team_id },
    { team_id: orders[1].team_id },
  ])
})

test('can create order', async ({ client, assert }) => {
  const order = await Factory.model('App/Models/Order').make({
    team_id: team.id,
  })
  team.orders().save(order)
  const testOrder = {
    name: 'testtorder',
    base_price: 20,
  }
  const response = await client
    .post('orders')
    .send(testOrder)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  const createdOrder = await Order.findBy('id', response.body.id)
  response.assertJSONSubset({
    name: createdOrder.name,
    base_price: createdOrder.base_price,
  })
})

test('can edit a order', async ({ client, assert }) => {
  const testOrder = {
    name: 'testtorder',
    base_price: 20,
  }
  const response = await client
    .post('orders')
    .send(testOrder)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  let createdID = response.body.id
  let createdOrder = await Order.findBy('id', createdID)
  response.assertJSONSubset({
    name: createdOrder.name,
    base_price: createdOrder.base_price,
  })
  testOrder.base_price = 50
  const responseEdit = await client
    .put(`orders/${createdID}`)
    .send(testOrder)
    .loginVia(user, 'jwt')
    .end()
  responseEdit.assertStatus(200)
  createdOrder = await Order.findBy('id', createdID)
  assert.equal(
    testOrder.base_price,
    createdOrder.base_price,
    'Base price not changed'
  )
})

test('can delete a order', async ({ client, assert }) => {
  const testOrder = {
    name: 'testtorder',
    base_price: 20,
  }
  const response = await client
    .post('orders')
    .send(testOrder)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  let createdOrder = await Order.findBy('id', response.body.id)
  response.assertJSONSubset({
    name: createdOrder.name,
    base_price: createdOrder.base_price,
  })
  const deletion = await client
    .delete(`orders/${response.body.id}`)
    .loginVia(user, 'jwt')
    .end()
  deletion.assertStatus(200)
  createdOrder = await Order.findBy('id', response.body.id)
  assert.isNull(createdOrder)
})
