'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.post('/users', 'UserController.create')
/*Route.resource('users', 'UserController')
  .apiOnly()
  .middleware(new Map([[['users.update', 'users.delete'], ['auth']]]))
  */
// Double map? Why?
Route.post('/sessions', 'SessionController.create')

Route.resource('teams', 'TeamController')
  .apiOnly()
  .middleware('auth')
Route.resource('teams.orders', 'OrderController')
  .apiOnly()
  .middleware('auth')
Route.resource('teams.transactions', 'TransactionController')
  .apiOnly()
  .middleware('auth')
Route.resource('products', 'ProductController')
  .apiOnly()
  .middleware('auth')
