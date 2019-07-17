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

test('can get order detail', async ({ client, assert }) => {
  const order = await Factory.model('App/Models/Order').make({
    team_id: team.id,
  })
  await team.orders().save(order)
  const response = await client
    .get(`teams/${team.id}/orders/${order.id}`)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    team_id: order.team_id,
  })
})

test('can delete an order', async ({ client, assert }) => {
  const order = await Factory.model('App/Models/Order').create({
    team_id: team.id,
  })
  const deletion = await client
    .delete(`teams/${team.id}/orders/${order.id}`)
    .loginVia(user, 'jwt')
    .end()
  deletion.assertStatus(200)
  let createdOrder = await Order.findBy('id', order.id)
  assert.isNull(createdOrder)
})

test('can create order from products', async ({ client, assert }) => {
  const products = await Factory.model('App/Models/Product').createMany(3)
  const shoppingCart = {
    team_id: team.id,
    products_ids: products.map(_ => _.id),
    price_penalty: 1,
  }
  const response = await client
    .post(`teams/${team.id}/orders`)
    .send(shoppingCart)
    .loginVia(user, 'jwt')
    .end()
  console.log('Error', response.error)
  response.assertStatus(200)
  const createdOrder = await Order.findBy('id', response.body.id)
  const expectedTotal = products.reduce((acc, _) => acc + _.base_price)
  response.assertJSONSubset({
    price_penalty: createdOrder.price_penalty,
    total: expectedTotal,
  })
  assert.equal(
    expectedTotal,
    createdOrder.total,
    'Not making the correct sum to total'
  )
})
