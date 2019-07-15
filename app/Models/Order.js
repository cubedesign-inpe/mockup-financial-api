'use strict'

const BaseModel = use('App/Models/BaseModel')

class Order extends BaseModel {
  team() {
    return this.belongsTo('App/Models/Team')
  }
  transaction() {
    return this.belongsTo('App/Models/Transaction')
  }
  items() {
    return this.hasMany('App/Models/OrderItem')
  }
}

module.exports = Order
