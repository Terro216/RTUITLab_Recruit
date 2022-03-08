import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './styles/404.scss'

export function Error404() {
	let navigate = useNavigate()
	console.log(navigate)
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
