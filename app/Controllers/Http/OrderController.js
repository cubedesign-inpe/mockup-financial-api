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
      .where('team_id', '=', team_id)
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
    const { user_id } = await auth.getUser()
    const { team_id } = params
    const data = request.only(['products', 'price_penalty'])
    const team = await Team.findOrFail(team_id)
    const product_ids = data.products.map(_ => _.id)
    let products = await Product.query()
      .select('id', 'name', 'base_price')
      .whereIn('id', product_ids)
      .fetch()
    products = products.toJSON()
    const pricePenalty = data.price_penalty
    const orderTotal = products.reduce(
      (agg, _) => agg + _.base_price * pricePenalty,
      0
    )
    const order = await Order.create({
      price_penalty: pricePenalty,
      total: orderTotal,
      team_id: team.id,
      created_by: user_id,
    })
    // Holy shit
    const productsQuantities = await Promise.all(
      data.products.map(async _ => {
        return await OrderProduct.create({
          product_id: _.id,
          order_id: order.id,
          quantity: _.quantity,
        })
      })
    )
    team.total -= order.total
    await team.save()
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
    const order = await Order.findOrFail(params.id)
    await order.load('products')
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
