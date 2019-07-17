'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Transaction = use('App/Models/Transaction')
const Team = use('App/Models/Team')
/**
 * Resourceful controller for interacting with transactions
 */
class TransactionController {
  /**
   * Show a list of all transactions.
   * GET transactions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ params, request, response, view }) {
    const { team_id } = params
    const transaction = await Transaction.query()
      .where('team_id', '=', team_id)
      .fetch()
    return transaction
  }

  /**
   * Create/save a new transaction.
   * POST transactions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ params, request, response, auth }) {
    const { user_id } = await auth.getUser()
    const { team_id } = params
    const data = request.only(['delta'])
    const team = await Team.findOrFail(team_id)
    const transaction = await Transaction.create({
      ...data,
      team_id: team.id,
      created_by: user_id,
    })
    team.total += data.delta
    await team.save()
    return transaction
  }

  /**
   * Display a single transaction.
   * GET transactions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const transaction = await Transaction.findOrFail(params.id)
    return transaction
  }

  /**
   * Update transaction details.
   * PUT or PATCH transactions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const transaction = await Transaction.findOrFail(params.id)
    const data = request.only(['delta'])
    //TODO: SANITIZE
    transaction.merge(data)
    return await transaction.save()
  }

  /**
   * Delete a transaction with id.
   * DELETE transactions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const transaction = await Transaction.findOrFail(params.id)
    return await transaction.delete()
  }
}

module.exports = TransactionController
