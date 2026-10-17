import './styles/cabinetMain.scss'
import React from 'react'
import { useDemo } from '../../data/demoStore.js'
import { money, portfolioValue } from '../../data/model.mjs'
import { PortfolioItem } from '../helpers/portfolioItem.js'
import { OperationButton } from '../helpers/operation.js'

export function CabinetMain() {
	const { state } = useDemo()
	const assets = portfolioValue(state)
	const titles = { buy: 'Покупка', sell: 'Продажа', deposit: 'Пополнение', withdraw: 'Списание' }
	return (
		<section className='cabinetMain-wrapper'>
			<div className='cabinetMain-balance'>
				<h2>Ваш баланс:</h2>
				<div className='balance-value' data-testid='cash'>{money(state.cashCents)}</div>
				<div className='balance-portfolioPrice'>Стоимость активов: <span data-testid='assets'>{money(assets)}</span><br />Всего: <span data-testid='total'>{money(state.cashCents + assets)}</span></div>
				<div className='balance-buttons'>
					<OperationButton className='balance-button' command={{ type: 'deposit', amountCents: 30000 }}>Пополнить на 300$</OperationButton>
					<OperationButton className='balance-button' command={{ type: 'withdraw', amountCents: 30000 }}>Вывести 300$</OperationButton>
				</div>
			</div>
			<div className='cabinetMain-portfolio'>
				<h2>Ваш портфель:</h2>
				<div className='portfolio-wrapper'>{Object.entries(state.positions).map(([ticker, position]) => <div className='item-wrapper' key={ticker}><PortfolioItem ticker={ticker} position={position} /></div>)}</div>
				{!Object.keys(state.positions).length && <div className='portfolio-empty'>Ваш портфель пуст :(<br />Купите что-либо в разделе Торговля</div>}
			</div>
			<section className='demo-history' aria-label='История операций'>
				<h2>История операций</h2>
				{!state.history.length && <p>Пока нет операций. Начальные активы входят в демопортфель.</p>}
				<ol>{[...state.history].reverse().map(row => <li key={row.id} data-testid='history-row'>
					<time dateTime={row.at}>{new Date(row.at).toLocaleString('ru-RU')}</time>
					<strong>{titles[row.type]}{row.ticker ? ` · ${row.ticker} · ${row.quantity} шт.` : ''}</strong>
					<span>Сумма: {money(row.grossCents)}{row.ticker ? ` · комиссия: ${money(row.feeCents)}` : ''}</span>
					<span>Баланс после: {money(row.cashCents)}</span>
				</li>)}</ol>
			</section>
		</section>
	)
}
