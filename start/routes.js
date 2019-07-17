'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.post('/users', 'UserController.create')
//TODO: api?
/*
Route.resource('users', 'UserController')
  .apiOnly()
  .middleware(
    new Map([
      [['users.index', 'users.show', 'users.update', 'users.delete'], ['auth']],
    ])
  )
  */

Route.post('/sessions', 'SessionController.create')

Route.group(() => {
  Route.resource('teams', 'TeamController').apiOnly()
  Route.resource('/teams/:team_id/orders', 'OrderController').apiOnly()
  Route.resource(
    '/teams/:team_id/transactions',
    'TransactionController'
  ).apiOnly()
  Route.resource('products', 'ProductController').apiOnly()
})
  .formats(['json'])
  .middleware('auth')
