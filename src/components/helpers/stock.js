import './stock.scss'
import React, { useState } from 'react'
import { money } from '../../data/model.mjs'
import { OperationButton } from './operation.js'

export function Stock({ data }) {
	const [counter, setCounter] = useState(1)
	return <article className='stock' data-ticker={data.ticker}>
		<div className='stock-top'>
			<div className='stock-name'>{data.name}</div>
			<div className='stock-type'>{data.ticker} · {data.i_name}</div>
			<div className='stock-description'>{data.descr}</div>
		</div>
		<div className='stock-bottom'>
			<div className='stock-price'>{money(data.priceCents * (Number(counter) || 0))}<small>Цена за шт.: {money(data.priceCents)} · комиссия 0,04%</small></div>
			<div className='stock-buttons'>
				<div className='stock-buttons-moreless-wrapper'>
					<button className='stock-buttons-moreless' aria-label={`Увеличить количество ${data.ticker}`} onClick={() => setCounter(Math.min(1000000, Number(counter) + 1))}>+</button>
					<input className='demo-quantity' aria-label={`Количество ${data.ticker}`} type='number' min='1' max='1000000' step='1' value={counter} onChange={e => setCounter(e.target.value)} />
					<span className='stock-buttons-counter'>шт.</span>
					<button className='stock-buttons-moreless' aria-label={`Уменьшить количество ${data.ticker}`} onClick={() => setCounter(Math.max(1, Number(counter) - 1))}>-</button>
				</div>
				<OperationButton className='stock-buttons-button' command={{ type: 'buy', ticker: data.ticker, quantity: Number(counter) }}>Купить</OperationButton>
			</div>
		</div>
	</article>
}
