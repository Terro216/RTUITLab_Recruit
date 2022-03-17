import React, { useEffect } from 'react'
import './styles/tariffs.scss'
import { animateCSS } from '../scripts/functions.js'

export function Tariffs() {
	useEffect(() => {
		animateCSS('.tariffs-wrapper', 'fadeIn')
	}, [])
	return (
		<section className='tariffs-wrapper'>
			<table border='0' className='tariffs-table'>
				<caption className='table-caption'>
					<h2 className='table-caption-header'>Тарифы</h2>
				</caption>
				<thead>
					<tr>
						<th>&nbsp;</th>
						<th className='table-header-item'>Новичок</th>
						<th className='table-header-item'>Я уже смешарик</th>
						<th className='table-header-item'>Профессионал</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>Комиссия со сделки</th>
						<td>0.04%</td>
						<td>0.03%</td>
						<td>0.005%</td>
					</tr>
					<tr>
						<th>
							Открытие/закрытие счёта,
							<br /> пополнение/снятие средств,
							<br /> депозитарное обслуживание
						</th>
						<td>Бесплатно</td>
						<td>Бесплатно</td>
						<td>Бесплатно</td>
					</tr>
					<tr>
						<th>Ежемесячное обслуживание</th>
						<td>Бесплатно</td>
						<td>
							1000 рублей
							<br />
							<span>Бесплатно при совершении сделок больше чем на 100 000</span>
						</td>
						<td>
							10 000 рублей
							<br />
							<span>Бесплатно при совершении сделок больше чем на 1 000 000</span>
						</td>
					</tr>
					<tr>
						<th>Поддержка</th>
						<td>Моральная</td>
						<td>Чат с оператором</td>
						<td>Персональный ассистент</td>
					</tr>
				</tbody>
			</table>
		</section>
	)
}
