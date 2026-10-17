import './styles/login.scss'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDemo } from '../../data/demoStore.js'
import { animateCSS } from '../../scripts/functions.js'

export function Login() {
	const { state } = useDemo()
	const navigate = useNavigate()
	useEffect(() => { animateCSS('.login-form', 'fadeIn') }, [])
	return <div className='login-wrapper'>
		<Link to='/' className='back' aria-label='На главную'>←</Link>
		<form className='login-form' onSubmit={event => { event.preventDefault(); navigate('/protected/cabinet') }}>
			<div className='login-form-welcome'>Рады видеть вас, {state.profile.name}!</div>
			<div className='login-form-inputs'><input className='login-form-input' aria-label='Демонстрационный пользователь' value='demo@example.com' readOnly /></div>
			<p className='demo-note'>Пользователь уже готов. Вход без пароля.<br />Виртуальные деньги, профиль и история — только в этом браузере.</p>
			<div className='login-form-buttons'><button className='login-form-button' type='submit'>Войти в демо</button></div>
		</form>
	</div>
}
