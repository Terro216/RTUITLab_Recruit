import './styles/cabinetProfile.scss'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../scripts/firebaseAuth.js'
import { checkMobileRegex, checkMail } from '../../scripts/functions.js'
import { Modal } from '../helpers/modal.js'

export function CabinetProfile() {
	let [editing, setEditing] = useState(false)
	let [modalContent, changeModalContent] = useState({
		head: '',
		body: '',
		show: false,
		callback: handleModalCallback,
	})
	let auth = useAuth()
	let navigate = useNavigate()

	function handleModalCallback() {
		changeModalContent({
			head: '',
			body: '',
			show: false,
			callback: handleModalCallback,
		})
	}

	function handleProfileChanging(el) {
		let inputs = document.getElementsByTagName('input')
		if (!editing) {
			for (let input of inputs) {
				input.disabled = false
			}
			el.target.innerText = 'Сохранить'
		} else {
			if (inputs[1].value.length < 6) {
				changeModalContent({
					head: 'Ошибка!',
					body: 'Слишком короткий пароль',
					show: true,
					callback: handleModalCallback,
				})
				return
			} else if (!checkMobileRegex(inputs[2].value)) {
				changeModalContent({
					head: 'Ошибка!',
					body: 'Неправильный номер телефона',
					show: true,
					callback: handleModalCallback,
				})
				return
			} else if (!checkMail(inputs[3].value)) {
				changeModalContent({
					head: 'Ошибка!',
					body: 'Неправильный адрес электронной почты',
					show: true,
					callback: handleModalCallback,
				})
				return
			}
			let newUser = {
				name: inputs[0].value,
				password: inputs[1].value,
				mobile: inputs[2].value,
				mail: inputs[3].value,
				id: auth.user.id,
				balance: auth.user.balance,
			}
			auth.updateProfileData(newUser)
			for (let input of inputs) {
				input.disabled = true
			}
			changeModalContent({
				head: 'Успех!',
				body: 'Данные изменены',
				show: true,
				callback: handleModalCallback,
			})
			el.target.innerText = 'Изменить данные'
		}
		setEditing(!editing)
	}

	return (
		<section className='profile-wrapper'>
			<Modal props={modalContent} />
			<h2 className='profile-welcome'>Здравствуйте, {auth.user.name}</h2>
			<div className='profile-avatar'>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'>
					<path
						fill='black'
						d='M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z'
					/>
				</svg>
			</div>
			<form className='profile-data'>
				<h3>Ваши данные:</h3>
				<label>
					Ваше имя:
					<br />
					<input type='text' defaultValue={auth.user.name} autoComplete='username' disabled></input>
				</label>
				<label>
					Ваш пароль:
					<br />
					<input
						type='password'
						autoComplete='new-password'
						defaultValue={auth.user.password}
						disabled></input>
				</label>
				<label>
					Ваш номер телефона:
					<br />
					<input type='text' defaultValue={auth.user.mobile} disabled></input>
				</label>
				<label>
					Ваш почтовый адрес:
					<br />
					<input type='text' defaultValue={auth.user?.mail} disabled></input>
				</label>
			</form>
			<div className='profile-buttons'>
				<button
					onClick={(el) => {
						handleProfileChanging(el)
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
