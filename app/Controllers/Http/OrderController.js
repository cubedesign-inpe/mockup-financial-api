'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Order = use('App/Models/Order')
const Team = use('App/Models/Team')
const Product = use('App/Models/Product')
const OrderProduct = use('App/Models/OrderProduct')
/**
 * Resourceful controller for interacting with orders
 */
class OrderController {
  /**
   * Show a list of all orders.
   * GET orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ params, request, response }) {
    const { team_id } = params
    const orders = await Order.query()
      .where({ team_id: team_id })
      .fetch()
    return orders
  }

  /**
   * Create/save a new order.
   * POST orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ params, request, response, auth }) {
    //Why are there no services in this framework?
    const user = await auth.getUser()
    const { team_id } = params
    const data = request.only(['products', 'price_penalty'])
    const team = await Team.findOrFail(team_id)
    const product_ids = data.products.map(_ => _.id)
    const productsDb = await Product.query()
      .select('id', 'name', 'base_price')
      .whereIn('id', product_ids)
      .fetch()
    let products = productsDb.toJSON()
    if (products.length === 0 || products.legnth < product_ids) {
      return response
        .status(400)
        .json({ error: 'All products must have valid ids' })
    }
    const pricePenalty = data.price_penalty
    const orderTotal = products.reduce((agg, _) => {
      const productCart = data.products.find(p => p.id == _.id)
      return agg + _.base_price * pricePenalty * productCart.quantity
    }, 0)
    const order = await Order.create({
      price_penalty: pricePenalty,
      total: orderTotal,
      team_id: team.id,
      created_by: user.id,
    })
    await order.products().attach(products.map(_ => _.id), row => {
      const productDetail = data.products.find(_ => _.id == row.product_id)
      row.quantity = productDetail.quantity
    })
    team.total -= order.total
    await team.save()
    //Service logic
    await order.load('products')
    return order
  }

  /**
   * Display a single order.
   * GET orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const order = await Order.query()
      .where({ id: params.id })
      .with('products')
      .limit(1)
      .fetch()
    return order
  }

  /**
   * Update order details.
   * PUT or PATCH orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const order = await Order.findOrFail(params.id)
    return order
  }

  /**
   * Delete a order with id.
   * DELETE orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const order = await Order.findOrFail(params.id)
    return await order.delete()
  }
}

module.exports = OrderController
