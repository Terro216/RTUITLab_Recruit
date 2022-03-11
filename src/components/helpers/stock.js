import './stock.scss'
import React, { useState } from 'react'
import { trade } from '../../scripts/trade.js'

function Stock({ data, auth }) {
	let user = auth.user
	let [counter, changeCounter] = useState(1)

	function handleChange(num) {
		if (counter + num > 0) changeCounter(counter + num)
	}

	function buy(elem) {
		elem = elem.target
		let price = +data.true_price * +data.lot_size_q

		if (+user.balance - price >= 0) {
			elem.innerText = 'Готово!'
			changeCounter(1)
			trade(auth, user, 'buy', data.ticker, counter, price)
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
			<div className='stock-top'>
				<div className='stock-name'>{data.name}</div>
				<div className='stock-type'>{data.i_name}</div>
				<div className='stock-description'>{data.descr}</div>
			</div>
			<div className='stock-bottom'>
				<div className='stock-price'>{new Number(data.true_price * counter).toFixed(2) + '$'}</div>
				<div className='stock-buttons'>
					<div className='stock-buttons-moreless-wrapper'>
						<button className='stock-buttons-moreless' onClick={() => handleChange(1)}>
							+
						</button>
						<span className='stock-buttons-counter'>{counter} шт.</span>
						<button className='stock-buttons-moreless' onClick={() => handleChange(-1)}>
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
