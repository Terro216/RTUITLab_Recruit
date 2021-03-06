import './styles/cabinetTrade.scss'
import ReactDom from 'react-dom'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../scripts/firebaseAuth.js'
import { Stock } from '../helpers/stock.js'
import { getInfo } from '../../scripts/functions.js'
import { Loader } from '../helpers/loader.js'

export function CabinetTrade() {
	const [exchangeStatus, setExchangeStatus] = useState(undefined)
	const [curRates, setCurRates] = useState(null)
	let auth = useAuth()

	function changeExchangeStatus(status) {
		if (status === 'OPEN') setExchangeStatus(true)
		else if (status === 'CLOSE') setExchangeStatus(false)
		else if (status === 'TECH') setExchangeStatus('tech')
		else if (status === 'POST') setExchangeStatus('post')
		else setExchangeStatus(null)
	}

	async function getExchangeStatus() {
		let paramsToGetStatus = {
			cmd: 'getMarketStatus',
			params: {
				market: '*',
			},
		}
		await fetch(`https://tradernet.ru/api/?q=${JSON.stringify(paramsToGetStatus)}`)
			.then((response) => response.json())
			.then((json) => {
				json.result.markets.m.forEach((market) => {
					if (market.n2 === 'SPBFOR') changeExchangeStatus(market.s)
				})
			})
			.catch((error) => {
				console.error('error:', error)
				changeExchangeStatus(null)
			})
	}

	function addStock(apiElem) {
		let wrapper = document.createElement('div')
		wrapper.classList.add('stock-wrapper')
		ReactDom.render(<Stock data={apiElem} auth={auth} />, wrapper)
		return wrapper
	}

	async function getShopCatalog() {
		let params = {
			cmd: 'getShopCatalog',
			params: {
				domain: 'freedom24.ru',
				lang: 'ru',
			},
		}
		await fetch(`https://tradernet.ru/api/?q=${JSON.stringify(params)}`)
			.then((response) => response.json())
			.then((data) => {
				setCurRates(data.currRates)
				data.shopSet['spb_stock'].list.forEach((apiElem) => {
					document.querySelector('.stock-list').appendChild(addStock(apiElem))
				})
			})
			.catch((error) => console.error('error:', error))

		document.querySelector('.loader-spinner').classList.add('hidden')
	}

	useEffect(() => {
		if (exchangeStatus === undefined) {
			//document.querySelector('.stock-search-line').value = 'AMD' //default value
			getExchangeStatus()
			getShopCatalog()
		}
	}, [])

	return (
		<section className='cabinetTrade'>
			<Loader />
			<div className='trade-status'>
				{exchangeStatus === true ? (
					<span className='trade-status-content indicator--open'>?????????? ??????????????</span>
				) : exchangeStatus === false ? (
					<span className='trade-status-content indicator--close'>?????????? ??????????????</span>
				) : exchangeStatus === undefined ? (
					<></>
				) : exchangeStatus === 'tech' ? (
					<span className='trade-status-content'>???? ?????????? ?????????????????????? ????????????</span>
				) : exchangeStatus === 'post' ? (
					<span className='trade-status-content'>?????????? ?? ???????????????????? ????????????</span>
				) : (
					<span className='trade-status-content'>???????????? ?????????? ????????????????????</span>
				)}
			</div>

			{curRates === null ? (
				<></>
			) : (
				<div className='trade-rates'>
					<span>1??? = {curRates.rates.EUR.toFixed(2)}???</span>{' '}
					<span>1$ = {curRates.rates.USD.toFixed(2)}???</span>
				</div>
			)}

			<div className='stock-search'>
				<input
					className='stock-search-line'
					type='text'
					//placeholder='GOOGL'
					placeholder='?????????????? ?????????? ?????? ???????????? ???? ??????????????'
				/>
				<button
					className='stock-search-button'
					aria-label='?????????? ?????????? ???? ????????????'
					onClick={async (el) => {
						let ticker = el.currentTarget.parentNode.childNodes[0].value
						let apiElem = await getInfo(ticker + '.' + 'US')
						if (apiElem?.code == 1) {
							apiElem = await getInfo(ticker + '.' + 'SPBEX')
							if (apiElem?.code == 1) {
								apiElem = await getInfo(ticker + '.' + 'MOEX')
							}
						}
						document.querySelector('.stock-list').insertAdjacentElement('afterbegin', addStock(apiElem))
					}}>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
						<path
							fill='#190C3B'
							d='M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z'
						/>
					</svg>
				</button>
			</div>
			<div className='stock-list'></div>
		</section>
	)
}
