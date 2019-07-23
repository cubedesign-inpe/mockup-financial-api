'use strict'

const BaseModel = use('App/Models/BaseModel')

class Observation extends BaseModel {
  static boot() {
    super.boot()
    this.addTrait('@provider:Jsonable')
  }
  get jsonFields() {
    return ['observation']
  }
  team() {
    return this.belongsTo('App/Models/Team')
  }
}

module.exports = Observation
