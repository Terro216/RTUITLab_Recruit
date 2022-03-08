import './styles/cabinetTrade.scss'
import React, { useEffect } from 'react'
import { trade } from '../../scripts/trade.js'
import { useAuth } from '../../scripts/firebaseAuth.js'
import { ws, useExchangeStatus, useCatalog } from '../../scripts/api.js'

export function CabinetTrade() {
	let user = useAuth().user
	const isOpen = useExchangeStatus()
	const catalog = useCatalog('rus_stock')
	function buy() {
		trade(user, 'buy', 'AAPL', 3, 450)
	}
	function sell() {
		trade(user, 'sell', 'AAPL', 3, 400)
	}

	return (
		<section className='cabinetTrade'>
			<div className='trade-status'>
				{isOpen === true ? (
					<span className='trade-status-open'>МосБиржа открыта</span>
				) : (
					<span className='trade-status-close'>МосБиржа закрыта</span>
				)}
			</div>
			trade<button onClick={buy}>buy some apples</button>
			<button onClick={sell}>sell some apples</button>
		</section>
	)
}
