'use strict'

const Logger = use('Logger')

class SessionController {
  async create({ params, request, response, auth }) {
    const { email, password } = request.all()
    const token = await auth.attempt(email, password)
    return token
  }
}

module.exports = SessionController
