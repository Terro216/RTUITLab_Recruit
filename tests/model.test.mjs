import test from 'node:test'
import assert from 'node:assert/strict'
import { initialState, applyCommand, tradeQuote, portfolioValue, decodeState } from '../src/data/model.mjs'

const buy = (id = 'buy-1', quantity = 2) => ({ id, type: 'buy', ticker: 'AAPL.US', quantity })

test('initial balance and valuation are deterministic', () => {
  const s = initialState()
  assert.equal(s.cashCents, 1000000)
  assert.equal(portfolioValue(s), 304000)
  assert.equal(s.cashCents + portfolioValue(s), 1304000)
  assert.equal(s.history.length, 0)
})
test('buy atomically debits price plus 0.04 percent commission', () => {
  const original = initialState()
  const s = applyCommand(original, buy())
  assert.equal(s.cashCents, 964986)
  assert.equal(s.positions['AAPL.US'].quantity, 7)
  assert.equal(s.history[0].feeCents, 14)
  assert.equal(original.cashCents, 1000000)
  assert.equal(s.cashCents + portfolioValue(s), 1303986)
})
test('partial then full sale conserves remaining position and records each operation', () => {
  const original = initialState()
  const partial = applyCommand(original, { id: 's1', type: 'sell', ticker: 'AMD.US', quantity: 4 })
  assert.equal(partial.positions['AMD.US'].quantity, 6)
  assert.equal(partial.positions['AMD.US'].costCents, 66000)
  assert.equal(partial.cashCents, 1049980)
  const full = applyCommand(partial, { id: 's2', type: 'sell', ticker: 'AMD.US', quantity: 6 })
  assert.equal(full.positions['AMD.US'], undefined)
  assert.equal(full.cashCents, 1124950)
  assert.equal(full.history.length, 2)
})
test('insufficient cash includes fee and never mutates the input', () => {
  const s = initialState()
  s.cashCents = 17500
  assert.throws(() => applyCommand(s, buy('x', 1)), /Недостаточно средств/)
  assert.equal(s.cashCents, 17500)
  assert.equal(s.history.length, 0)
})
test('negative, zero, fractional, nonfinite and excessive quantities are rejected', () => {
  for (const q of [0, -1, 1.5, NaN, Infinity, 1000001, '2']) assert.throws(() => applyCommand(initialState(), buy('q', q)))
  assert.throws(() => applyCommand(initialState(), { id: 'oversell', type: 'sell', ticker: 'AMD.US', quantity: 11 }), /Недостаточно инструментов/)
})
test('price from command is ignored and unknown tickers are rejected', () => {
  const s = applyCommand(initialState(), { ...buy(), priceCents: 1 })
  assert.equal(s.history[0].priceCents, 17500)
  assert.throws(() => applyCommand(s, { ...buy('other'), ticker: 'NO.US' }))
})
test('replayed intent remains idempotent after serialization and later operations', () => {
  let s = applyCommand(initialState(), buy())
  s = decodeState(JSON.stringify(s))
  s = applyCommand(s, { id: 'deposit', type: 'deposit', amountCents: 30000 })
  assert.equal(applyCommand(s, buy()), s)
  assert.equal(s.history.length, 2)
})
test('deposit, withdrawal and insufficient cash', () => {
  const original = initialState()
  const s = applyCommand(original, { id: 'd', type: 'deposit', amountCents: 30000 })
  const w = applyCommand(s, { id: 'w', type: 'withdraw', amountCents: 30000 })
  assert.equal(w.cashCents, original.cashCents)
  assert.throws(() => applyCommand(w, { id: 'large', type: 'withdraw', amountCents: 1000001 }))
  for (const value of [0, -1, 1.5, Infinity]) assert.throws(() => applyCommand(w, { id: 'invalid', type: 'deposit', amountCents: value }))
})
test('local profile changes preserve all financial data', () => {
  const original = initialState()
  const s = applyCommand(original, { id: 'p', type: 'profile', profile: { name: 'Другой Демо', mobile: '+7 000 111-22-33', mail: 'other@example.com' } })
  assert.equal(s.profile.name, 'Другой Демо')
  assert.equal(s.cashCents, original.cashCents)
  assert.deepEqual(s.positions, original.positions)
  assert.deepEqual(s.history, original.history)
  assert.throws(() => applyCommand(s, { id: 'badp', type: 'profile', profile: { ...s.profile, mail: 'bad' } }))
})
test('fresh state resets all fields without affecting another independent state', () => {
  const other = initialState()
  const changed = applyCommand(initialState(), buy())
  assert.equal(other.positions['AAPL.US'].quantity, 5)
  assert.notDeepEqual(changed, initialState())
  assert.deepEqual(initialState(), other)
})
test('corrupt storage and incompatible versions fail closed', () => {
  for (const raw of ['garbage', 'null', '{}', JSON.stringify({ ...initialState(), version: 99 }), JSON.stringify({ ...initialState(), cashCents: -1 }), JSON.stringify({ ...initialState(), positions: { 'BAD.US': { quantity: 1, costCents: 1 } } })]) assert.throws(() => decodeState(raw))
})
test('commission is rounded in cents, never accumulated as binary fractional money', () => {
  assert.deepEqual(tradeQuote('buy', 'AAPL.US', 1), { grossCents: 17500, feeCents: 7, totalCents: 17507 })
  assert.deepEqual(tradeQuote('sell', 'AAPL.US', 1), { grossCents: 17500, feeCents: 7, totalCents: 17493 })
})
