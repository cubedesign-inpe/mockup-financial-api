'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash')

Factory.blueprint('App/Models/User', async (faker, i, data) => {
  return {
    username: faker.username(),
    full_name: faker.name(),
    email: data.email || faker.email(),
    password: data.password || faker.password(),
  }
})

Factory.blueprint('App/Models/Team', async faker => {
  return {
    name: faker.guid(),
    total: 400,
  }
})

Factory.blueprint('App/Models/Product', async faker => {
  return {
    name: faker.animal(),
    base_price: faker.integer({ min: 1, max: 200 }),
    picture: faker.avatar(),
  }
})

Factory.blueprint('App/Models/Order', async (faker, i, data) => {
  return {
    team_id: data.team_id,
    price_penalty: faker.integer({ min: 1, max: 2 }),
  }
})

Factory.blueprint('App/Models/OrderProduct', async (faker, i, data) => {
  return {
    team_id: data.team_id,
    order_id: data.order_id,
    quantity: faker.integer({ min: 1, max: 20 }),
  }
})
Factory.blueprint('App/Models/Transaction', async (faker, i, data) => {
  return {
    team_id: data.team_id,
    delta: faker.integer({ min: -50, max: 100 }),
  }
})
