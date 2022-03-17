import './styles/cabinetMain.scss'
import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import { useAuth, db } from '../../scripts/firebaseAuth'
import { getDoc, doc } from 'firebase/firestore'
import { PortfolioItem } from '../helpers/portfolioItem.js'
import { getInfo } from '../../scripts/functions'

export function CabinetMain() {
	let [portfolioPrice, changePortfolioPrice] = useState(0)
	let [reload, doReload] = useState(true)
	let auth = useAuth()

	async function handleChangePortfolioPrice(ticker, count, exchanges) {
		let currentStocksPrice = await getInfo(ticker + '.' + exchanges[0]) //only first exchange...enough for now
		currentStocksPrice = +currentStocksPrice['true_price'] * Number(count)
		changePortfolioPrice((portfolioPrice) => (+portfolioPrice + currentStocksPrice).toFixed(2)) //genius
	}

	function changeBalance(sum) {
		let action = sum > 0 ? 'deposit' : 'withdraw'
		if (+auth.user.balance + sum >= 0) {
			auth.changeBalance(sum, action, () => {})
		}
	}

	async function loadPortfolio() {
		const docSnap = await getDoc(doc(db, 'users', auth.user.id, 'portfolio', 'data'))
		if (docSnap.exists()) {
			let data = docSnap.data()
			//console.log('Portfolio data:', data) //debug
			if (Object.keys(data).length === 0) {
				document.querySelector('.portfolio-empty').hidden = false
			}
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
				handleChangePortfolioPrice(ticker, count, exchanges)
				ReactDom.render(
					<PortfolioItem
						ticker={ticker}
						count={count}
						exchanges={exchanges}
						auth={auth}
						callback={() => doReload(!reload)}
					/>,
					item
				)
				wrapper.appendChild(item)
			}
		} else {
			// doc.data() will be undefined in this case
			console.error('No such document!')
		}
	}

	useEffect(() => {
		document.querySelector('.portfolio-wrapper').innerHTML = ''
		document.querySelector('.portfolio-empty').hidden = true
		changePortfolioPrice(0)
		loadPortfolio()
	}, [reload])

	useEffect(() => {
		if (portfolioPrice == 0) {
			document.querySelector('.portfolio-empty').hidden = false
		} else {
			document.querySelector('.portfolio-empty').hidden = true
		}
	}, [portfolioPrice])

	return (
		<section className='cabinetMain-wrapper'>
			<div className='cabinetMain-balance'>
				<h2>Ваш баланс:</h2>
				<div className='balance-value'>{auth.user.balance}$</div>
				<div className='balance-portfolioPrice'>Стоимость активов: {portfolioPrice}$</div>
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
				<div className='portfolio-empty' hidden>
					Ваш портфель пуст :(
					<br />
					Купите что-либо в разделе Торговля
				</div>
			</div>
		</section>
	)
}
