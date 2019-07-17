'use strict'

const { test, trait } = use('Test/Suite')('Product')
const Product = use('App/Models/Product')
const User = use('App/Models/User')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('can index products', async ({ client, assert }) => {
  const user = await User.find(1)
  const response = await client
    .get('products')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
})

test('can create product', async ({ client, assert }) => {
  const user = await User.find(1)
  const testProduct = {
    name: 'testtproduct',
    base_price: 20,
  }
  const response = await client
    .post('products')
    .send(testProduct)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  const createdProduct = await Product.findBy('id', response.body.id)
  response.assertJSONSubset({
    name: createdProduct.name,
    base_price: createdProduct.base_price,
  })
})

test('can edit a product', async ({ client, assert }) => {
  const user = await User.find(1)
  const testProduct = {
    name: 'testtproduct',
    base_price: 20,
  }
  const response = await client
    .post('products')
    .send(testProduct)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  let createdID = response.body.id;
  let createdProduct = await Product.findBy('id', createdID)
  response.assertJSONSubset({
    name: createdProduct.name,
    base_price: createdProduct.base_price,
  })
  testProduct.base_price = 50
  const responseEdit = await client
    .put(`products/${createdID}`)
    .send(testProduct)
    .loginVia(user, 'jwt')
    .end()
  responseEdit.assertStatus(200)
  createdProduct = await Product.findBy('id', createdID)
  assert.equal(testProduct.base_price, createdProduct.base_price, "Base price not changed")
})

test('can delete a product', async ({ client, assert }) => {
  const user = await User.find(1)
  const testProduct = {
    name: 'testtproduct',
    base_price: 20,
  }
  const response = await client
    .post('products')
    .send(testProduct)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  let createdProduct = await Product.findBy('id', response.body.id)
  response.assertJSONSubset({
    name: createdProduct.name,
    base_price: createdProduct.base_price,
  })
  const deletion = await client
    .delete(`products/${response.body.id}`)
    .loginVia(user, 'jwt')
    .end()
  deletion.assertStatus(200)
  createdProduct = await Product.findBy('id', response.body.id)
  assert.isNull(createdProduct)
})
