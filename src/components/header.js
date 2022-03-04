import { NavLink } from 'react-router-dom'
import './styles/header.scss'
import * as Heart from '../../public/heart.svg'
import React from 'react'
import { Hamburger } from './helpers/hamburger.js'

export function Header() {
	return (
		<header className='header-wrapper'>
			<NavLink to='/' className='header-logo'>
				<span className='header-logo-top'>Честный бро</span>

				<div className='header-logo-bottom'>
					<img
						className='header-logo-icon'
						src={Heart}
						width='36px'
						height='36px'
						alt='red heart logo icon'></img>
					<span className='header-logo-ker'>кер</span>
				</div>
			</NavLink>
			<nav className='header-links'>
				<NavLink
					to='/about'
					className={({ isActive }) => (isActive ? 'header-link header-link--active' : 'header-link')}>
					О&nbsp;нас
				</NavLink>
				<NavLink
					to='/tariff'
					className={({ isActive }) => (isActive ? 'header-link header-link--active' : 'header-link')}>
					Тарифы
				</NavLink>
				<NavLink
					to='/business'
					className={({ isActive }) => (isActive ? 'header-link header-link--active' : 'header-link')}>
					Бизнесу
				</NavLink>
				<NavLink
					to='/learning'
					className={({ isActive }) => (isActive ? 'header-link header-link--active' : 'header-link')}>
					Обучение
				</NavLink>
				<NavLink to='/protected/cabinet' className='header-loginButton'>
					Стать клиентом
				</NavLink>
			</nav>
			<Hamburger from='header' toggleHamburger='' />
		</header>
	)
}
