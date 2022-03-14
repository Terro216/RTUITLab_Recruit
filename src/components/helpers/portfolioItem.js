import './portfolioItem.scss'
import React, { useState, useEffect } from 'react'
import { trade } from '../../scripts/trade.js'
import { getInfo } from '../../scripts/functions.js'

function PortfolioItem(props) {
	let [elem, deleteElem] = useState(true)
	let [data, setData] = useState(props.ticker)
	async function updateTicker() {
		let newData = await getInfo(props.ticker + '.' + props.exchanges[0])
		setData(newData)
	}
	useEffect(() => {
		updateTicker()
	}, [])
	return elem ? (
		<div className='item'>
			<div className='item-name'>{data.name}</div>
			<div className='item-val'>{props.count} шт.</div>
			<button
				className='sell-button'
				onClick={() => {
					trade(props.auth, 'sell', props.ticker, props.count, +data.true_price * +props.count)
					deleteElem(false)
					props.callback()
				}}>
				Продать
			</button>
		</div>
	) : null
}

export { PortfolioItem }
