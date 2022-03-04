import './styles/cabinetProfile.scss'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../scripts/firebaseAuth.js'

export function CabinetProfile() {
	let auth = useAuth()
	let navigate = useNavigate()
	let name = auth.user.name
	return (
		<section className='profile-wrapper'>
			<h2 className='profile-welcome'>Здравствуйте, {name}</h2>
			<div className='profile-avatar'>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'>
					<path
						fill='black'
						d='M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z'
					/>
				</svg>
			</div>
			<div className='profile-data'>
				<h3>Ваши данные:</h3>
				<label>
					Ваше имя:
					<br />
					<input type='text' value={auth.user.name} autoComplete='username' disabled></input>
				</label>
				<label>
					Ваш пароль:
					<br />
					<input type='password' autoComplete='current-password' value={auth.user.password} disabled></input>
				</label>
				<label>
					Ваш номер телефона:
					<br />
					<input type='text' value={auth.user.mobile} disabled></input>
				</label>
				<label>
					Ваш почтовый адрес:
					<br />
					<input type='text' value='' disabled></input>
				</label>
			</div>
			<div className='profile-buttons'>
				<button
					onClick={() => {
						auth.signOut(() => navigate('/'))
					}}
					className='profile-button profile-button--change'>
					Поменять данные
				</button>
				<button
					onClick={() => {
						auth.signOut(() => navigate('/'))
					}}
					className='profile-button profile-button--exit'>
					Выход из аккаунта
				</button>
			</div>
		</section>
	)
}
