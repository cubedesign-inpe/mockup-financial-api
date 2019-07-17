'use strict'

const BaseModel = use('App/Models/BaseModel')

class OrderProduct extends BaseModel {
  order() {
    return this.belongsTo('App/Models/Order')
  }
  product() {
    return this.belongsTo('App/Models/Product')
  }
}

module.exports = OrderProduct
