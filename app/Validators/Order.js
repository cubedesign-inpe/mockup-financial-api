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
      'price_penalty.required': 'Você precisa da penalidade',
      'products.required': 'Você precisa enviar algum produto',
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
