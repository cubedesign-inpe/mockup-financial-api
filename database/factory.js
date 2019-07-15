'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash')

Factory.blueprint('App/Models/User', async faker => {
  return {
    username: faker.username(),
    full_name: faker.name(),
    email: faker.email(),
    password: await Hash.make(faker.password()),
  }
})

Factory.blueprint('App/Models/Team', async faker => {
  return {
    name: faker.company(),
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
