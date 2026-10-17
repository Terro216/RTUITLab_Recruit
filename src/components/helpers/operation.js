import React, { useRef, useState } from 'react'
import { useDemo, operationId } from '../../data/demoStore.js'
import { money, tradeQuote } from '../../data/model.mjs'
import { Modal } from './modal.js'

// The intent gets an ID once, when the confirmation opens. Repeated events,
// including double-clicks, cannot create a second transaction from that intent.
export function OperationButton({ command, className, children }) {
	const { dispatch } = useDemo()
	const [intent, setIntent] = useState(null)
	const [result, setResult] = useState(null)
	const busy = useRef(false)
	const [pending, setPending] = useState(false)
	function open() {
		if (intent || busy.current) return
		try {
			const quote = command.type === 'buy' || command.type === 'sell' ? tradeQuote(command.type, command.ticker, command.quantity) : null
			setIntent({ ...command, id: operationId(), quote })
		} catch (error) { setResult({ head: 'Проверьте заявку', body: error.message }) }
	}
	async function confirm() {
		if (busy.current || !intent) return
		busy.current = true
		setPending(true)
		try {
			await dispatch(intent)
			setResult({ head: 'Готово!', body: 'Демонстрационная операция сохранена.' })
		} catch (error) { setResult({ head: 'Операция не выполнена', body: error.message }) }
		setIntent(null)
		setPending(false)
		// Keep this intent locked until the receipt/error is dismissed.
	}
	return <>
		<button className={className} onClick={open} disabled={pending}>{children}</button>
		<Modal props={{ show: !!intent, head: 'Подтвердить демооперацию', body: intent && (intent.quote ?
			`${intent.type === 'buy' ? 'Покупка' : 'Продажа'} ${intent.ticker}: ${intent.quantity} шт. Сумма ${money(intent.quote.grossCents)}, комиссия 0,04%: ${money(intent.quote.feeCents)}. ${intent.type === 'buy' ? 'К списанию' : 'К зачислению'}: ${money(intent.quote.totalCents)}.` :
			`${intent.type === 'deposit' ? 'Пополнить' : 'Списать'} ${money(intent.amountCents)} виртуальных средств?`), confirm, pending, callback: () => setIntent(null) }} />
		<Modal props={{ show: !!result, ...result, callback: () => { setResult(null); busy.current = false } }} />
	</>
}
