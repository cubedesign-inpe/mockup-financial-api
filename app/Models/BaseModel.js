'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const User = use('App/Models/User')

class BaseModel extends Model {
  /**
   * The user that created this
   *
   * @method created_by
   *
   * @return {Object}
   */
  created_by() {
    return this.hasOne('App/Models/User')
  }
}

module.exports = BaseModel
