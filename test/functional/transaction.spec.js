'use strict'

const { test, trait } = use('Test/Suite')('Transaction')
const Transaction = use('App/Models/Transaction')
const User = use('App/Models/User')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('can index transactions', async ({ client, assert }) => {
  const user = await User.find(1)
  const response = await client
    .get('transactions')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('can create transaction', async ({ client, assert }) => {
  const user = await User.find(1)
  const testTransaction = {
    name: 'testttransaction',
    base_price: 20,
  }
  const response = await client
    .post('transactions')
    .send(testTransaction)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  const createdTransaction = await Transaction.findBy('id', response.body.id)
  response.assertJSONSubset({
    name: createdTransaction.name,
    base_price: createdTransaction.base_price,
  })
})

test('can edit a transaction', async ({ client, assert }) => {
  const user = await User.find(1)
  const testTransaction = {
    name: 'testttransaction',
    base_price: 20,
  }
  const response = await client
    .post('transactions')
    .send(testTransaction)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  let createdID = response.body.id;
  let createdTransaction = await Transaction.findBy('id', createdID)
  response.assertJSONSubset({
    name: createdTransaction.name,
    base_price: createdTransaction.base_price,
  })
  testTransaction.base_price = 50
  const responseEdit = await client
    .put(`transactions/${createdID}`)
    .send(testTransaction)
    .loginVia(user, 'jwt')
    .end()
  responseEdit.assertStatus(200)
  createdTransaction = await Transaction.findBy('id', createdID)
  assert.equal(testTransaction.base_price, createdTransaction.base_price, "Base price not changed")
})

test('can delete a transaction', async ({ client, assert }) => {
  const user = await User.find(1)
  const testTransaction = {
    name: 'testttransaction',
    base_price: 20,
  }
  const response = await client
    .post('transactions')
    .send(testTransaction)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  let createdTransaction = await Transaction.findBy('id', response.body.id)
  response.assertJSONSubset({
    name: createdTransaction.name,
    base_price: createdTransaction.base_price,
  })
  const deletion = await client
    .delete(`transactions/${response.body.id}`)
    .loginVia(user, 'jwt')
    .end()
  deletion.assertStatus(200)
  createdTransaction = await Transaction.findBy('id', response.body.id)
  assert.isNull(createdTransaction)
})
