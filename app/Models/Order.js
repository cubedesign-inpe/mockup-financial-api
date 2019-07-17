'use strict'

const BaseModel = use('App/Models/BaseModel')

class Order extends BaseModel {
  team() {
    return this.belongsTo('App/Models/Team')
  }
  transaction() {
    return this.belongsTo('App/Models/Transaction')
  }
  products() {
    return this.belongsToMany('App/Models/Product').pivotModel(
      'App/Models/OrderProduct'
    )
  }
}

module.exports = Order
