import './styles/cabinetTrade.scss'
import React, { useState } from 'react'
import { Stock } from '../helpers/stock.js'
import { searchInstruments, demoRates } from '../../data/catalog.mjs'
import { useDemo } from '../../data/demoStore.js'
import { money } from '../../data/model.mjs'

export function CabinetTrade() {
	const [query, setQuery] = useState('')
	const { state } = useDemo()
	const list = searchInstruments(query)
	return <section className='cabinetTrade'>
		<div className='trade-status'><span className='trade-status-content indicator--open'>Демобиржа открыта</span></div>
		<p className='demo-note'>Условные фиксированные котировки · USD · комиссия 0,04%</p>
		<p className='demo-note'>Доступно: <span data-testid='trade-cash'>{money(state.cashCents)}</span></p>
		<div className='trade-rates'><span>1€ = {demoRates.EUR.toFixed(2)}₽</span><span>1$ = {demoRates.USD.toFixed(2)}₽</span></div>
		<form className='stock-search' onSubmit={e => e.preventDefault()}>
			<input className='stock-search-line' type='search' aria-label='Поиск инструментов' placeholder='Введите тикер или название' value={query} onChange={e => setQuery(e.target.value)} />
			<button className='stock-search-button' aria-label='Поиск акции по тикеру'>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path fill='#190C3B' d='M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z' /></svg>
			</button>
		</form>
		<div className='stock-list'>{list.map(data => <div className='stock-wrapper' key={data.ticker}><Stock data={data} /></div>)}</div>
		{!list.length && <p className='demo-note' role='status'>Инструменты не найдены. Попробуйте AAPL, AMD или Microsoft.</p>}
	</section>
}
