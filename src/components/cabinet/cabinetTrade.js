import './styles/cabinetTrade.scss'
import React from 'react'
import { trade } from '../../scripts/trade'
import { useAuth } from '../../scripts/firebaseAuth'

export function CabinetTrade() {
	let user = useAuth().user
	function buy() {
		trade(user, 'buy', 'AAPL', 3, 450)
	}
	function sell() {
		trade(user, 'sell', 'AAPL', 3, 400)
	}
	return (
		<section className='profile-trade'>
			trade<button onClick={buy}>buy some apples</button>
			<button onClick={sell}>sell some apples</button>
		</section>
	)
}
