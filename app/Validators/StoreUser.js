'use strict'

class StoreUser {
  get rules() {
    return {
      email: 'required|email|unique:users',
      username: 'required|unique:users',
      password: 'required',
    }
  }
  get messages() {
    return {
      'email.required': 'You must provide a email address.',
      'email.email': 'You must provide a valid email address.',
      'email.unique': 'This email is already registered.',
      'password.required': 'You must provide a password',
      'username.unique': 'This username is already registered.',
      'username.required': 'You must provide an username.',
    }
  }
  get sanitizationRules() {
    return {
      email: 'trim',
      username: 'trim',
    }
  }
  get validateAll() {
    return true
  }
  async fails(errorMessages) {
    return this.ctx.response.status(400).json(errorMessages)
  }
}

module.exports = StoreUser
