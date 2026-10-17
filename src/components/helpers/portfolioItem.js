import './portfolioItem.scss'
import React, { useState } from 'react'
import { findInstrument } from '../../data/catalog.mjs'
import { money } from '../../data/model.mjs'
import { OperationButton } from './operation.js'

export function PortfolioItem({ ticker, position }) {
	const [quantity, setQuantity] = useState(1)
	const data = findInstrument(ticker)
	const value = data.priceCents * position.quantity
	return <div className='item' data-position={ticker}>
		<div className='item-name'>{data.name}<small>{ticker} · {money(data.priceCents)} / шт.</small></div>
		<div className='item-val'><span data-testid='position-quantity'>{position.quantity} шт.</span><small>{money(value)}<br />Результат: {money(value - position.costCents)}</small></div>
		<div className='demo-sell'>
			<label>Продать, шт.<input className='demo-quantity' type='number' min='1' max={position.quantity} step='1' aria-label={`Продать количество ${ticker}`} value={quantity} onChange={e => setQuantity(e.target.value)} /></label>
			<OperationButton className='sell-button' command={{ type: 'sell', ticker, quantity: Number(quantity) }}>Продать</OperationButton>
		</div>
	</div>
}
