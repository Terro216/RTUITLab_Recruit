import './styles/cabinetTrade.scss'
import ReactDom from 'react-dom'
import React, { useEffect, useState } from 'react'
import { trade } from '../../scripts/trade.js'
import { useAuth } from '../../scripts/firebaseAuth.js'

function Stock({ data, auth }) {
	let user = auth.user
	let [counter, changeCounter] = useState(1)

	function handleChange(num) {
		if (counter + num > 0) changeCounter(counter + num)
		console.log(data)
	}

	function buy(elem) {
		let price = +data.true_price * +data.lot_size_q

		if (user.balance - price >= 0) {
			elem.innerText = 'Готово!'
			trade(auth, user, 'buy', data.code_nm, counter, price)
		} else {
			elem.innerText = 'Недостаточно средств'
		}

		setTimeout(
			() => {
				elem.innerText = 'Купить'
			},
			4000,
			elem
		)
	}
	if (data.title == null) {
		alert('Ошибка поиска. Проверьте введенное значение на корректность')
		return null
	}
	return (
		<article className='stock'>
			<div className='stock-name'>{data.title}</div>
			<div className='stock-price'>{new Number(data.true_price).toFixed(2) + '$'}</div>
			<div className='stock-buttons'>
				<button className='stock-buttons-moreless' onClick={() => handleChange(1)}>
					+
				</button>
				<div className='stock-buttons-counter'>{counter}</div>
				<button className='stock-buttons-moreless' onClick={() => handleChange(-1)}>
					-
				</button>
				<button className='stock-buttons-button' onClick={buy}>
					Купить
				</button>
			</div>
		</article>
	)
}

export function CabinetTrade() {
	const [exchangeStatus, setExchangeStatus] = useState(undefined)
	const [curRates, setCurRates] = useState(null)
	let auth = useAuth()

	function changeExchangeStatus(status) {
		status === 'OPEN' ? setExchangeStatus(true) : setExchangeStatus(false)
	}

	async function getExchangeStatus() {
		let paramsToGetStatus = {
			cmd: 'getMarketStatus',
			params: {
				market: '*',
				mode: 'demo',
			},
		}
		await fetch(`https://tradernet.ru/api/?q=${JSON.stringify(paramsToGetStatus)}`)
			.then((response) => response.json())
			.then((json) =>
				json.result.markets.m.forEach((market) => {
					if (market.n2 === 'SPBFOR') changeExchangeStatus(market.s)
				})
			)
			.catch((error) => console.error('error:', error))
	}
	async function getInfo(ticker) {
		var exampleParams = {
			cmd: 'getStockData',
			params: {
				ticker: ticker,
				lang: 'ru',
			},
		}

		let apiElem = await fetch(`https://tradernet.ru/api/?q=${JSON.stringify(exampleParams)}`)
			.then((response) => response.json())
			.then((data) => data)
			.catch((error) => console.error('error:', error))
		return apiElem
	}
	function addStock(apiElem) {
		let wrapper = document.createElement('div')
		wrapper.classList.add('stock-wrapper')
		//father.appendChild(wrapper)
		ReactDom.render(<Stock data={apiElem} auth={auth} />, wrapper)
		return wrapper
	}
	async function getShopCatalog() {
		let exampleParams = {
			cmd: 'getShopCatalog',
			params: {
				domain: 'freedom24.ru',
				lang: 'ru',
			},
		}
		await fetch(`https://tradernet.ru/api/?q=${JSON.stringify(exampleParams)}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data)
				setCurRates(data.currRates)
				data.shopSet['spb_stock'].list.forEach((apiElem) => {
					document.querySelector('.stock-list').appendChild(addStock(apiElem))
				})
			})
			.catch((error) => console.error('error:', error))
	}

	useEffect(() => {
		if (exchangeStatus === undefined) {
			getExchangeStatus()
			getShopCatalog()
		}
		//return () => ws.current.close() // кода меняется connectionState - соединение закрывается
	}, [exchangeStatus])

	return (
		<section className='cabinetTrade'>
			<div className='trade-status'>
				{exchangeStatus === true ? (
					<span className='trade-status-open'>Биржа открыта</span>
				) : exchangeStatus === false ? (
					<span className='trade-status-close'>Биржа закрыта</span>
				) : (
					<span className='trade-status'>Невозможно получить статус биржи</span>
				)}
			</div>
			<div className='stock-search'>
				<input type='text' placeholder='Введите тикер для поиска по акциями'></input>
				<button
					onClick={async (el) => {
						let apiElem = await getInfo(el.target.parentNode.childNodes[0].value)
						document.querySelector('.stock-list').insertAdjacentElement('afterbegin', addStock(apiElem))
					}}>
					Поиск
				</button>
			</div>
			<div className='stock-list'></div>
		</section>
	)
}
