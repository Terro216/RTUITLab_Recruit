import './styles/cabinetMain.scss'
import React from 'react'
import { getCookie } from '../../scripts/cookie'

export function CabinetMain() {
	return (
		<section className='cabinetMain-wrapper'>
			<div className='cabinetMain-balance'>
				<h2>Ваш баланс:</h2>
				<span>{getCookie('balance') + '$'}</span>
			</div>
			<div className='cabinetMain-portfolio'>
				<h2>Ваш портфель:</h2>
			</div>
		</section>
	)
}
