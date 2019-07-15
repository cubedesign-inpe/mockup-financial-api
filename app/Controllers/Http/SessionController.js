'use strict'

class SessionController {
  async create({ request, auth }) {
    const { email, password } = request.all()
    const token = await auth.attempt(email, password)
    return token
  }
  // Not sure if working?
  async revokeUserToken({ request, auth }) {
    const user = auth.current.user
    const token = auth.getAuthHeader()
    await user
      .tokens()
      .where('token', token)
      .update({ is_revoked: true })
  }
}

module.exports = SessionController
