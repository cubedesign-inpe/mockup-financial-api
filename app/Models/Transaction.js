'use strict'

const BaseModel = use('App/Models/BaseModel')

class Transaction extends BaseModel {
  team() {
    return this.belongsTo('App/Models/Team')
  }
  order() {
    return this.belongsTo('App/Models/Order')
  }
}

module.exports = Transaction
