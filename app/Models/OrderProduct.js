'use strict'

const BaseModel = use('App/Models/BaseModel')

class OrderProduct extends BaseModel {
  static get updatedAtColumn() {
    return 'updated_at'
  }
  static get createdAtColumn() {
    return 'created_at'
  }
  getQuantity(quantity) {
    return quantity
  }
}

module.exports = OrderProduct
