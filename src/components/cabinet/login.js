import './login.scss'
import React from 'react'
import { useAuth } from '../../scripts/firebaseAuth.js'
import { useNavigate, useLocation, Link } from 'react-router-dom'

export function Login() {
	let navigate = useNavigate()
	let location = useLocation()
	let auth = useAuth()
	let from = location.state?.from?.pathname || '/'

	function handleMobile(event) {
		//и тут запись в куки
		event.preventDefault()

		let formData = new FormData(event.currentTarget)
		let mobile = formData.get('mobile')
		let correctMob = /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/.test(mobile)
		if (correctMob) {
			auth.checkMobile(mobile, (hasError, hasNum, name) => {
				if (hasError) {
					alert('Произошла ошибка. Пожалуйста, попробуйте еще раз')
					document.querySelector('.login-tel-form').reset()
					return 0
				} else if (hasNum === true) {
					document.querySelector('.login-tel-form').classList.add('hidden')
					document.querySelector('.login-password-form').classList.remove('hidden')
					document.querySelector('.login-password-form-welcome').innerText = `Рады видеть тебя, ${name}!`
				} else {
					document.querySelector('.login-tel-form').classList.add('hidden')
					document.querySelector('.tel-error-message').classList.add('hidden')
					document.querySelector('.login-register-form').classList.remove('hidden')
					document.querySelector('.registerInput').setAttribute('value', mobile)
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
		auth.signIn(pass, (hasError, correctPass) => {
			if (hasError) {
				alert('Произошла ошибка. Пожалуйста, попробуйте еще раз')
				document.querySelector('.login-password-form').reset()
			} else if (!correctPass) {
				document.querySelector('.login-password-form').reset()
				document.querySelector('.password-error-message').classList.remove('hidden')
			} else {
				document.querySelector('.password-error-message').classList.add('hidden')
				console.log(auth.user)
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
		let mobile = formData.get('number') //считывает из куки мб
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
			<Link to={from}>
				<i className='fa-solid fa-angle-left back' />
			</Link>

			<form onSubmit={handleMobile} className='login-form login-tel-form'>
				<div className='login-form-inputs'>
					<input className='login-form-input' name='mobile' type='tel' placeholder='Номер телефона' />
				</div>
				<div className='login-error-message tel-error-message hidden'>Неправильно набран номер</div>
				<div className='login-form-buttons'>
					<button className='login-form-button--submit' type='submit'>
						Продолжить
					</button>
				</div>
			</form>

			<form onSubmit={handlePass} className='login-form login-password-form hidden'>
				<div className='login-password-form-welcome'></div>
				<div className='login-form-inputs'>
					<input
						className='login-form-input'
						name='password'
						type='password'
						placeholder='Пароль'
						autoComplete='current-password'
					/>
					<div className='login-error-message password-error-message hidden'>Неверный пароль :(</div>
					<button type='button' className='login-form-button--reset'>
						Восстановить пароль
					</button>
				</div>
				<div className='login-form-buttons'>
					<button className='login-form-button--submit' type='submit'>
						Войти
					</button>
				</div>
			</form>

			<form onSubmit={handleReg} className='login-form login-register-form hidden'>
				<div className='login-password-form-welcome'>Введите имя и пароль для завершения регистрации</div>
				<div className='login-form-inputs'>
					<input className='login-form-input registerInput hidden' name='number'></input>
					<input className='login-form-input' name='name' type='text' placeholder='Имя' />
					<input
						className='login-form-input'
						name='password'
						autoComplete='current-password'
						type='password'
						placeholder='Пароль'
					/>
					<div className='login-error-message register-error-message hidden'>
						Длина пароля не менее 6 знаков
					</div>
				</div>
				<div className='login-form-buttons'>
					<button className='login-form-button--submit' type='submit'>
						Зарегистрироваться
					</button>
				</div>
			</form>
		</div>
	)
}
