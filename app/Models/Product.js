'use strict'

const BaseModel = use('App/Models/BaseModel')

class Product extends BaseModel {
  orders() {
    return this.belongsToMany('App/Models/Order').pivotModel(
      'App/Models/OrderProduct'
    )
  }
}

module.exports = Product
