import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/404.scss'
import { animateCSS } from '../scripts/functions.js'

export function Error404() {
	let navigate = useNavigate()

	useEffect(() => {
		animateCSS('.error404-wrapper', 'fadeIn')
	}, [])
	return (
		<section className='error404-wrapper'>
			<h2 className='error404-header'>Ошибка 404</h2>
			<h3 className='error404-subheader'>Страница не найдена</h3>
			<div className='error404-buttons'>
				<button onClick={() => navigate(-1)} className='error404-buttons-button'>
					Назад
				</button>
				<button onClick={() => navigate('/')} className='error404-buttons-button'>
					На главную
				</button>
			</div>
		</section>
	)
}
