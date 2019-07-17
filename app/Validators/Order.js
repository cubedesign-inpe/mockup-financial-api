'use strict'

class Order {
  get rules() {
    return {
      price_penalty: 'required|integer',
      products: 'required|array',
    }
  }
  get messages() {
    return {
      'price_penalty.required': 'You must provide a price penalty.',
      'products.required': 'You must provide the products.',
    }
  }
  get validateAll() {
    return true
  }
  async fails(errorMessages) {
    return this.ctx.response.status(400).json(errorMessages)
  }
}

module.exports = Order
