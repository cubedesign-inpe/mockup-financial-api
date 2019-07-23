'use strict'

const Team = use('App/Models/Team')
const Observation = use('App/Models/Observation')

class ObservationController {
  /**
   * Show a list of all observations.
   * GET observations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ params, request, response, view }) {
    const { team_id } = params
    const observations = await Observation.query()
      .where({ team_id: team_id })
      .fetch()
    return observations
  }

  /**
   * Create/save a new observation.
   * POST observations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ params, request, response, auth }) {
    const data = request.only(['observation'])
    const { team_id } = params
    const team = await Team.findOrFail(team_id)
    const user = await auth.getUser()
    const observation = await team.observations().create({
      ...data,
      created_by: user.id,
    })
    return observation
  }

  /**
   * Display a single observation.
   * GET observations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const observation = await Observation.findOrFail(params.id)
    return observation
  }

  /**
   * Update observation details.
   * PUT or PATCH observations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const observation = await Observation.findOrFail(params.id)
    const data = request.only(['observation'])
    //TODO: SANITIZE
    observation.merge(data)
    return await observation.save()
  }

  /**
   * Delete a observation with id.
   * DELETE observations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const observation = await Observation.findOrFail(params.id)
    //LOG?
    return await observation.delete()
  }
}

module.exports = ObservationController
