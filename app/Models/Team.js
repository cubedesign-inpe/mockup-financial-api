'use strict'

const BaseModel = use('App/Models/BaseModel')

class Team extends BaseModel {
  orders() {
    return this.hasMany('App/Models/Order')
  }
  transactions() {
    return this.hasMany('App/Models/Transaction')
  }
}

module.exports = Team
