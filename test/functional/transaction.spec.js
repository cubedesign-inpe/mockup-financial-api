'use strict'

const { before, beforeEach, after, afterEach, test, trait } = use('Test/Suite')(
  'Transaction'
)
const Factory = use('Factory')

const Transaction = use('App/Models/Transaction')
const Team = use('App/Models/Team')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

let user = null
let team = null

beforeEach(async () => {
  user = await Factory.model('App/Models/User').create()
  team = await Factory.model('App/Models/Team').create()
})

test('can index transactions', async ({ client, assert }) => {
  const transactions = await Factory.model('App/Models/Transaction').makeMany(
    2,
    {
      team_id: team.id,
    }
  )
  transactions.forEach(
    async transaction => await team.transactions().save(transaction)
  )
  const response = await client
    .get(`teams/${team.id}/transactions`)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  assert.equal(response.body.length, transactions.length)
  response.assertJSONSubset([
    { team_id: transactions[0].team_id },
    { team_id: transactions[1].team_id },
  ])
})

test('can get transaction detail', async ({ client, assert }) => {
  const transaction = await Factory.model('App/Models/Transaction').make({
    team_id: team.id,
  })
  await team.transactions().save(transaction)
  const response = await client
    .get(`teams/${team.id}/transactions/${transaction.id}`)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    team_id: transaction.team_id,
    delta: transaction.delta,
  })
})

test('can delete an transaction', async ({ client, assert }) => {
  const transaction = await Factory.model('App/Models/Transaction').create({
    team_id: team.id,
  })
  const deletion = await client
    .delete(`teams/${team.id}/transactions/${transaction.id}`)
    .loginVia(user, 'jwt')
    .end()
  deletion.assertStatus(200)
  let createdTransaction = await Transaction.findBy('id', transaction.id)
  assert.isNull(createdTransaction)
})

test('can create transaction and update team total', async ({
  client,
  assert,
}) => {
  const transaction = await Factory.model('App/Models/Transaction').make({
    team_id: team.id,
  })
  const expectedTotal = team.total + transaction.delta
  const teamDelta = {
    team_id: team.id,
    delta: transaction.delta,
  }
  const response = await client
    .post(`teams/${team.id}/transactions`)
    .send(teamDelta)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  const createdTransaction = await Transaction.findBy('id', response.body.id)
  response.assertJSONSubset({
    delta: createdTransaction.delta,
  })
  const updatedTeam = await Team.findBy('id', team.id)
  assert.equal(
    updatedTeam.total,
    expectedTotal,
    "Team total isn't being updated"
  )
})
