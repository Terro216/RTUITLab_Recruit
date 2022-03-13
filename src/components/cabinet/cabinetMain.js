import './styles/cabinetMain.scss'
import React, { useEffect } from 'react'
import ReactDom from 'react-dom'
import { useAuth, db } from '../../scripts/firebaseAuth'
import { getDoc, doc } from 'firebase/firestore'
import { PortfolioItem } from '../helpers/portfolioItem.js'

export function CabinetMain() {
	let auth = useAuth()

	function changeBalance(sum) {
		let newBalance = +auth.user.balance + sum
		if (newBalance >= 0) {
			auth.changeBalance(newBalance)
		}
	}

	async function loadPortfolio() {
		const docSnap = await getDoc(doc(db, 'users', auth.user.id, 'portfolio', 'data'))
		if (docSnap.exists()) {
			let data = docSnap.data()
			console.log('Portfolio data:', data)
			let wrapper = document.querySelector('.portfolio-wrapper')
			for (let ticker in data) {
				let item = document.createElement('div')
				item.classList.add('item-wrapper')
				let count = 0
				let exchanges = []
				for (let curExchange in data[ticker]) {
					exchanges.push(curExchange)
					count += data[ticker][curExchange]
				}
				ReactDom.render(
					<PortfolioItem ticker={ticker} count={count} exchanges={exchanges} auth={auth} />,
					item
				)
				wrapper.appendChild(item)
			}
		} else {
			// doc.data() will be undefined in this case
			console.log('No such document!')
		}
	}

	useEffect(() => {
		document.querySelector('.portfolio-wrapper').innerHTML = ''
		loadPortfolio()
	}, [])

	return (
		<section className='cabinetMain-wrapper'>
			<div className='cabinetMain-balance'>
				<h2>Ваш баланс:</h2>
				<div className='balance-value'>{auth.user.balance}$</div>
				<div className='balance-buttons'>
					<button className='balance-button' onClick={() => changeBalance(300)}>
						Пополнить на 300$
					</button>
					<button className='balance-button' onClick={() => changeBalance(-300)}>
						Вывести 300$
					</button>
				</div>
			</div>
			<div className='cabinetMain-portfolio'>
				<h2>Ваш портфель:</h2>
				<div className='portfolio-wrapper'></div>
			</div>
		</section>
	)
}
