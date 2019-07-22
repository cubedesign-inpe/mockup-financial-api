'use strict'

const Logger = use('Logger')

class SessionController {
  async create({ params, request, response, auth }) {
    const { email, password } = request.all()
    const token = await auth.attempt(email, password)
    return token
  }
  async revokeUserToken({ auth }) {
    const user = auth.current.user
    const token = auth.getAuthHeader()

    await user
      .tokens()
      .where('token', token)
      .update({ is_revoked: true })
  }
}

module.exports = SessionController
