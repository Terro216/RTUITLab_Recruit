import './styles/login.scss'
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../scripts/firebaseAuth.js'
import { getCookie } from '../../scripts/cookie.js'
import { checkMobileRegex } from '../../scripts/functions.js'
import { Modal } from '../helpers/modal.js'
import { animateCSS } from '../../scripts/functions.js'

export function Login() {
	let [modalContent, changeModalContent] = useState({
		head: '',
		body: '',
		show: false,
		callback: handleModalCallback,
	})
	let navigate = useNavigate()
	let location = useLocation()
	let auth = useAuth()
	let from = location.state?.from?.pathname || '/'

	function showModal(state) {
		if (state === 'error') {
			changeModalContent({
				head: 'Ошибка!',
				body: 'Пожалуйста, попробуйте еще раз',
				show: true,
				callback: handleModalCallback,
			})
		} else if (state === 'success') {
			changeModalContent({
				head: 'Регистрация прошла успешно!',
				body: 'Войдите, что бы получить свои подарочные 1000$',
				show: true,
				callback: handleModalCallback,
			})
		}
	}

	function handleModalCallback() {
		changeModalContent({
			head: '',
			body: '',
			show: false,
			callback: handleModalCallback,
		})
	}

	useEffect(() => {
		if (getCookie('logged') === 'true') {
			auth.instantLogin(() => {
				navigate(from, { replace: true })
			})
		} else if (getCookie('mobile') !== undefined) {
			document.querySelector('#telInput').value = getCookie('mobile') // вставка номера если он уже вводился
		}
		animateCSS('.login-tel-form', 'fadeIn')
		document.querySelector('#telInput').focus()
	}, [])

	function handleMobile(event) {
		event.preventDefault()

		let formData = new FormData(event.currentTarget)
		let mobile = formData.get('mobile')

		if (checkMobileRegex(mobile)) {
			auth.checkMobile(mobile, (hasError, hasNum, name) => {
				if (hasError) {
					showModal('error')
					document.querySelector('.login-tel-form').reset()
					return 0
				} else if (hasNum === true) {
					document.querySelector('.login-tel-form').classList.add('hidden')
					document.querySelector('.login-password-form').classList.remove('hidden')
					animateCSS('.login-password-form', 'fadeIn').then(() => {
						document.querySelector('#passInput').focus()
					})
					document.querySelector('.login-form-welcome--password').innerText = `Рады видеть вас, ${name}!`
				} else {
					document.querySelector('.login-tel-form').classList.add('hidden')
					document.querySelector('.login-register-form').classList.remove('hidden')
					animateCSS('.login-register-form', 'fadeIn').then(() =>
						document.querySelector('#nameInput').focus()
					)
				}
				document.querySelector('.tel-error-message').classList.add('hidden')
			})
		} else {
			document.querySelector('.tel-error-message').classList.remove('hidden')
		}
	}

	function handlePass(event) {
		event.preventDefault()

		let formData = new FormData(event.currentTarget)
		let pass = formData.get('password')

		auth.signIn(pass, (hasError, correctPass) => {
			if (hasError) {
				showModal('error')
				document.querySelector('.login-password-form').reset()
			} else if (!correctPass) {
				document.querySelector('.login-password-form').reset()
				document.querySelector('.password-error-message').classList.remove('hidden')
			} else {
				document.querySelector('.password-error-message').classList.add('hidden')
				navigate(from, { replace: true })
			}
		})
	}

	function handleReg(event) {
		event.preventDefault()

		let formData = new FormData(event.currentTarget)
		let name = formData.get('name')
		let pass = formData.get('password')
		let mobile = getCookie('mobile')
		if (pass.length < 6) {
			document.querySelector('.register-error-message').classList.remove('hidden')
			return
		}

		auth.register(name, pass, mobile, (hasError) => {
			if (hasError) {
				showModal('error')
				document.querySelector('.login-register-form').reset()
			} else {
				showModal('success')
				document.querySelector('.login-tel-form').classList.remove('hidden')
				document.querySelector('.login-register-form').classList.add('hidden')
				document.querySelector('.register-error-message').classList.add('hidden')
			}
		})
	}

	return (
		<div className='login-wrapper'>
			<Modal props={modalContent} />

			<Link to='/' className='back'>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'>
					<path
						fill='white'
						d='M447.1 256C447.1 273.7 433.7 288 416 288H109.3l105.4 105.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L109.3 224H416C433.7 224 447.1 238.3 447.1 256z'
					/>
				</svg>
			</Link>

			<form onSubmit={handleMobile} className='login-form login-tel-form'>
				<div className='login-form-inputs'>
					<input
						id='telInput'
						className='login-form-input'
						name='mobile'
						type='tel'
						placeholder='Номер телефона'
					/>
				</div>
				<div className='login-error-message tel-error-message hidden'>Некорректный номер</div>
				<div className='login-form-buttons'>
					<button className='login-form-button' type='submit'>
						Продолжить
					</button>
				</div>
			</form>

			<form onSubmit={handlePass} className='login-form login-password-form hidden'>
				<div className='login-form-welcome login-form-welcome--password'></div>
				<div className='login-form-inputs'>
					<input type='text' autoComplete='username' hidden />
					<input
						className='login-form-input'
						id='passInput'
						name='password'
						type='password'
						placeholder='Пароль'
						autoComplete='current-password'
					/>
					<div className='login-error-message password-error-message hidden'>Неверный пароль :(</div>
				</div>
				<div className='login-form-buttons'>
					<button className='login-form-button' type='submit'>
						Войти
					</button>
				</div>
			</form>

			<form onSubmit={handleReg} className='login-form login-register-form hidden'>
				<div className='login-form-welcome login-form-welcome--register'>
					Введите имя и пароль для завершения регистрации
				</div>
				<div className='login-form-inputs'>
					<input
						className='login-form-input'
						id='nameInput'
						name='name'
						type='text'
						placeholder='Имя'
						autoComplete='username'
					/>
					<input
						className='login-form-input'
						name='password'
						autoComplete='new-password'
						type='password'
						placeholder='Пароль'
					/>
					<div className='login-error-message register-error-message hidden'>
						Длина пароля не менее 6 знаков
					</div>
				</div>
				<div className='login-form-buttons'>
					<button className='login-form-button' type='submit'>
						Зарегистрироваться
					</button>
				</div>
			</form>
		</div>
	)
}
