import { findInstrument, instruments } from './catalog.mjs'

export const STORAGE_KEY = 'honest-broker.demo.v1'
export const MAX_MONEY = 100_000_000_00
export const MAX_QUANTITY = 1_000_000
export const money = cents => (cents / 100).toFixed(2) + '$'
const integer = value => Number.isSafeInteger(value) && value >= 0
export const commission = gross => Math.round(gross * 4 / 10000)

export function initialState() {
	return {
		version: 1, revision: 0, cashCents: 1_000_000,
		profile: { name: 'Алексей Демо', mobile: '+7 (000) 000-00-00', mail: 'demo@example.com' },
		positions: { 'AAPL.US': { quantity: 5, costCents: 82500 }, 'MSFT.US': { quantity: 3, costCents: 85500 }, 'AMD.US': { quantity: 10, costCents: 110000 } },
		history: [], receipts: [],
	}
}

export function decodeState(raw) {
	let state
	try { state = JSON.parse(raw) }
	catch { throw new Error('Сохранённое демо повреждено. Сбросьте его, чтобы начать заново.') }
	if (state?.version !== 1 || !integer(state.revision) || !integer(state.cashCents) || state.cashCents > MAX_MONEY ||
		!state.profile || !['name', 'mobile', 'mail'].every(key => typeof state.profile[key] === 'string' && state.profile[key].length <= 120) ||
		!state.positions || Array.isArray(state.positions) || !Array.isArray(state.history) || !Array.isArray(state.receipts) ||
		!state.receipts.every(id => typeof id === 'string') ||
		!Object.entries(state.positions).every(([ticker, p]) => findInstrument(ticker) && integer(p.quantity) && p.quantity > 0 && p.quantity <= MAX_QUANTITY && integer(p.costCents)) ||
		!state.history.every(row => row && typeof row.id === 'string' && ['buy', 'sell', 'deposit', 'withdraw'].includes(row.type) && Number.isFinite(Date.parse(row.at)) && integer(row.cashCents) && integer(row.grossCents) && integer(row.feeCents) && (row.type === 'buy' || row.type === 'sell' ? findInstrument(row.ticker) && integer(row.quantity) && row.quantity > 0 : true))) {
		throw new Error('Сохранённое демо несовместимо или повреждено. Сбросьте его, чтобы начать заново.')
	}
	return state
}

export function portfolioValue(state) {
	return Object.entries(state.positions).reduce((sum, [ticker, p]) => sum + findInstrument(ticker).priceCents * p.quantity, 0)
}

export function tradeQuote(type, ticker, quantity) {
	const instrument = findInstrument(ticker)
	if (!instrument) throw new Error('Инструмент отсутствует в демокаталоге')
	if (!Number.isSafeInteger(quantity) || quantity <= 0 || quantity > MAX_QUANTITY) throw new Error('Количество должно быть целым числом от 1 до 1 000 000')
	const grossCents = instrument.priceCents * quantity
	const feeCents = commission(grossCents)
	return { grossCents, feeCents, totalCents: type === 'buy' ? grossCents + feeCents : grossCents - feeCents }
}

// One immutable transition contains cash, positions, receipt and history.
// Prices are resolved here, never trusted from the UI or an incoming command.
export function applyCommand(state, command, at = new Date().toISOString()) {
	if (typeof command.id !== 'string' || !command.id || command.id.length > 100) throw new Error('Не удалось определить операцию')
	if (state.receipts.includes(command.id)) return state
	const next = { ...state, revision: state.revision + 1, positions: { ...state.positions }, receipts: [...state.receipts, command.id] }
	let row = { id: command.id, type: command.type, at, grossCents: 0, feeCents: 0 }
	if (command.type === 'buy' || command.type === 'sell') {
		const { type, ticker, quantity } = command
		const quote = tradeQuote(type, ticker, quantity)
		const position = state.positions[ticker] || { quantity: 0, costCents: 0 }
		if (type === 'buy') {
			if (quote.totalCents > state.cashCents) throw new Error('Недостаточно средств с учётом комиссии')
			if (position.quantity + quantity > MAX_QUANTITY) throw new Error('Превышен лимит количества')
			next.cashCents -= quote.totalCents
			next.positions[ticker] = { quantity: position.quantity + quantity, costCents: position.costCents + quote.totalCents }
		} else {
			if (quantity > position.quantity) throw new Error('Недостаточно инструментов для продажи')
			next.cashCents += quote.totalCents
			if (quantity === position.quantity) delete next.positions[ticker]
			else next.positions[ticker] = { quantity: position.quantity - quantity, costCents: position.costCents - Math.round(position.costCents * quantity / position.quantity) }
		}
		row = { ...row, ticker, quantity, priceCents: findInstrument(ticker).priceCents, grossCents: quote.grossCents, feeCents: quote.feeCents }
	} else if (command.type === 'deposit' || command.type === 'withdraw') {
		if (!integer(command.amountCents) || command.amountCents <= 0 || command.amountCents > MAX_MONEY) throw new Error('Введите положительную сумму, не больше 100 000 000$')
		if (command.type === 'withdraw' && command.amountCents > state.cashCents) throw new Error('Недостаточно средств для списания')
		next.cashCents += command.type === 'deposit' ? command.amountCents : -command.amountCents
		row.grossCents = command.amountCents
	} else if (command.type === 'profile') {
		const profile = Object.fromEntries(['name', 'mobile', 'mail'].map(key => [key, String(command.profile?.[key] ?? '').trim()]))
		if (profile.name.length < 1 || profile.name.length > 80) throw new Error('Введите имя до 80 символов')
		if (profile.mobile.length > 40 || !/^[+\d ()-]{7,40}$/.test(profile.mobile)) throw new Error('Проверьте номер телефона')
		if (profile.mail.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.mail)) throw new Error('Проверьте почтовый адрес')
		next.profile = profile
		return next
	} else throw new Error('Неизвестная операция')
	if (!integer(next.cashCents) || next.cashCents > MAX_MONEY) throw new Error('Превышен лимит демобаланса: 100 000 000$')
	next.history = [...state.history, { ...row, cashCents: next.cashCents }]
	return next
}

export { instruments }
