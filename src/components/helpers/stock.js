import './stock.scss'
import React, { useState, useEffect } from 'react'
import { trade } from '../../scripts/trade.js'
import { Modal } from './modal.js'

function Stock({ data, auth }) {
	let [counter, changeCounter] = useState(1)
	let [modalContent, changeModalContent] = useState({
		head: '',
		body: '',
		show: false,
		callback: handleModalCallback,
	})
	let [notFound, changeNotFound] = useState(false)

	function handleModalCallback(val) {
		changeModalContent({ head: '', body: '', afterClose: '', show: false, callback: handleModalCallback })
		if (val === 'notFound') {
			changeNotFound(true)
		}
	}

	function handleCounterChange(num) {
		if (counter + num > 0) changeCounter(counter + num)
	}

	async function buy(elem) {
		elem = elem.target
		let price = +data.true_price // * +data.lot_size_q

		if (+auth.user.balance - price * +counter >= 0) {
			elem.disabled = true
			elem.innerText = 'Обработка'
			await trade(auth, 'buy', data.ticker, counter, price)
			elem.innerText = 'Готово!'
			handleCounterChange(-counter + 1)
			changeModalContent({
				head: 'Успех',
				body: `Теперь вы владеете частью ${data.ticker.split('.')[0]}!`,
				afterClose: 'reloadPage',
				show: true,
				callback: handleModalCallback,
			})
		} else {
			elem.innerText = 'Недостаточно средств'
			setTimeout(
				() => {
					elem.innerText = 'Купить'
				},
				2000,
				elem
			)
		}
	}

	useEffect(() => {
		if (data.title == null) {
			//alert('Ошибка поиска. Проверьте введенное значение на корректность')
			changeModalContent({
				head: 'Ошибка поиска',
				body: 'Проверьте введенное значение на корректность',
				afterClose: 'notFound',
				show: true,
				callback: handleModalCallback,
			})
		}
	}, [])

	return notFound ? null : (
		<article className='stock'>
			<Modal props={modalContent} />
			<div className='stock-top'>
				<div className='stock-name'>{data.name}</div>
				<div className='stock-type'>{data.i_name}</div>
				<div className='stock-description'>{data.descr}</div>
			</div>
			<div className='stock-bottom'>
				<div className='stock-price'>{new Number(data.true_price * counter).toFixed(2) + '$'}</div>
				<div className='stock-buttons'>
					<div className='stock-buttons-moreless-wrapper'>
						<button className='stock-buttons-moreless' onClick={() => handleCounterChange(1)}>
							+
						</button>
						<span className='stock-buttons-counter'>{counter} шт.</span>
						<button className='stock-buttons-moreless' onClick={() => handleCounterChange(-1)}>
							-
						</button>
					</div>
					<button className='stock-buttons-button' onClick={buy}>
						Купить
					</button>
				</div>
			</div>
		</article>
	)
}

export { Stock }
