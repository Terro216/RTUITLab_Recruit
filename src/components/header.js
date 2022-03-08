import { NavLink } from 'react-router-dom'
import './styles/header.scss'
import * as Heart from '../../public/heart.svg'
import React from 'react'
import { Hamburger } from './helpers/hamburger.js'

export function Header() {
	const toggleHamburger = React.useRef(null)
	return (
		<header className='header-wrapper'>
			<NavLink to='/' onClick={() => toggleHamburger.current()} className='header-logo'>
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
					onClick={() => toggleHamburger.current()}
					className={({ isActive }) => (isActive ? 'header-link header-link--active' : 'header-link')}>
					О нас
				</NavLink>
				<NavLink
					to='/tariffs'
					onClick={() => toggleHamburger.current()}
					className={({ isActive }) => (isActive ? 'header-link header-link--active' : 'header-link')}>
					Тарифы
				</NavLink>
				<NavLink
					to='/business'
					onClick={() => toggleHamburger.current()}
					className={({ isActive }) => (isActive ? 'header-link header-link--active' : 'header-link')}>
					Бизнесу
				</NavLink>
				<NavLink
					to='/learning'
					onClick={() => toggleHamburger.current()}
					className={({ isActive }) => (isActive ? 'header-link header-link--active' : 'header-link')}>
					Обучение
				</NavLink>
				<NavLink
					to='/protected/cabinet'
					onClick={() => toggleHamburger.current()}
					className='header-loginButton'>
					Открыть счёт
				</NavLink>
			</nav>
			<Hamburger from='header' toggleHamburger={toggleHamburger} />
		</header>
	)
}
