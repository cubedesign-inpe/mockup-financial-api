'use strict'

const { before, beforeEach, after, afterEach, test, trait } = use('Test/Suite')(
  'Product'
)
const Factory = use('Factory')

const Product = use('App/Models/Product')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

let user = null

beforeEach(async () => {
  user = await Factory.model('App/Models/User').create()
})

test('can index products', async ({ client, assert }) => {
  const products = await Factory.model('App/Models/Product').createMany(5)
  const response = await client
    .get('products')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  // This test is not testing anything.
  assert.isAbove(
    response.body.length,
    products.length,
    'Did not return the minimum of products'
  )
})

test('can create product', async ({ client, assert }) => {
  const product = await Factory.model('App/Models/Product').create()
  const testProduct = {
    name: product.name,
    base_price: product.base_price,
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
  const product = await Factory.model('App/Models/Product').create()
  let oldProductPrice = product.base_price
  const changedProduct = {
    base_price: 50,
  }
  const responseEdit = await client
    .put(`products/${product.id}`)
    .send(changedProduct)
    .loginVia(user, 'jwt')
    .end()
  responseEdit.assertStatus(200)
  await product.reload()
  assert.notEqual(oldProductPrice, product.base_price, 'Product did not update')
})

test('can delete a product', async ({ client, assert }) => {
  let product = await Factory.model('App/Models/Product').create()
  const deletion = await client
    .delete(`products/${product.id}`)
    .loginVia(user, 'jwt')
    .end()
  deletion.assertStatus(200)
  const deletedProduct = await Product.findBy('id', product.id)
  assert.isNull(deletedProduct, 'Product did not get deleted')
})
