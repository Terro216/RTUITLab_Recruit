import './styles/login.scss'
import React, { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../scripts/firebaseAuth.js'
import { getCookie, setCookie } from '../../scripts/cookie.js'
import { checkMobileRegex } from '../../scripts/functions.js'

export function Login() {
	let navigate = useNavigate()
	let location = useLocation()
	let auth = useAuth()
	let from = location.state?.from?.pathname || '/'

	useEffect(() => {
		if (getCookie('logged') === 'true') {
			//возможная брешь в безопасности?
			auth.instantLogin(() => {
				navigate(from, { replace: true })
			})
		} else if (getCookie('mobile') !== undefined) {
			document.querySelector('#telInput').value = getCookie('mobile') // вставка номера если он уже вводился
		}
	}, [])

	function handleMobile(event) {
		event.preventDefault()

		let formData = new FormData(event.currentTarget)
		let mobile = formData.get('mobile')

		if (checkMobileRegex(mobile)) {
			setCookie('mobile', mobile, { secure: false, 'max-age': 3600 })
			auth.checkMobile(mobile, (hasError, hasNum, name) => {
				if (hasError) {
					alert('Произошла ошибка. Пожалуйста, попробуйте еще раз')
					document.querySelector('.login-tel-form').reset()
					return 0
				} else if (hasNum === true) {
					document.querySelector('.login-tel-form').classList.add('hidden')
					document.querySelector('.login-password-form').classList.remove('hidden')
					document.querySelector('.login-form-welcome--password').innerText = `Рады видеть тебя, ${name}!`
				} else {
					document.querySelector('.login-tel-form').classList.add('hidden')
					document.querySelector('.tel-error-message').classList.add('hidden')
					document.querySelector('.login-register-form').classList.remove('hidden')
					//document.querySelector('.registerInput').setAttribute('value', mobile)
				}
			})
		} else {
			document.querySelector('.tel-error-message').classList.remove('hidden')
		}
	}

	function handlePass(event) {
		event.preventDefault()

		let formData = new FormData(event.currentTarget)
		let pass = formData.get('password')
		let mobile = getCookie('mobile')
		auth.signIn(mobile, pass, (hasError, correctPass) => {
			if (hasError) {
				alert('Произошла ошибка. Пожалуйста, попробуйте еще раз')
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
		if (pass.length < 6) {
			document.querySelector('.register-error-message').classList.remove('hidden')
			return 0
		}
		let mobile = getCookie('mobile')
		auth.register(name, pass, mobile, (hasError) => {
			if (hasError) {
				alert('Произошла ошибка. Пожалуйста, попробуйте еще раз')
				document.querySelector('.login-register-form').reset()
			} else {
				alert('Регистрация прошла успешно! Теперь осталось только войти')
				document.querySelector('.login-tel-form').classList.remove('hidden')
				document.querySelector('.login-register-form').classList.add('hidden')
				document.querySelector('.register-error-message').classList.add('hidden')
			}
		})
	}

	return (
		<div className='login-wrapper'>
			<Link to='/'>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' className='back'>
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
				<div className='login-error-message tel-error-message hidden'>Неправильно набран номер</div>
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
