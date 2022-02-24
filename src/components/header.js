import { NavLink } from 'react-router-dom'
import './header.scss'
import * as Heart from '../../public/heart.svg'

function Hamburger() {
	function toggleState() {
		document.querySelector('.hamburger-icon').classList.toggle('openHamburger')
		document.querySelector('.header-links').classList.toggle('showLinks')
		//document.querySelector('.header-links').style.display = 'flex'
		//animateCSS('.sidebar-wrapper', 'slideInDown')
	}

	return (
		<div className='header-hamburger'>
			<div className='hamburger-icon' onClick={toggleState}>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
			{
				//<div className='hamburger-links'></div>
			}
		</div>
	)
}

export function Header() {
	return (
		<header className='header-wrapper'>
			<div className='header-logo'>
				<span className='header-logo-top'>Честный бро</span>

				<div className='header-logo-bottom'>
					<img className='header-logo-icon' src={Heart} alt='red heart logo icon'></img>
					<span className='header-logo-ker'>кер</span>
				</div>
			</div>
			<nav className='header-links'>
				<NavLink to='/about' className={({ isActive }) => (isActive ? activeClassName : 'header-link')}>
					О&nbsp;нас
				</NavLink>
				<NavLink to='/business' className={({ isActive }) => (isActive ? activeClassName : 'header-link')}>
					Бизнесу
				</NavLink>
				<NavLink to='/learning' className={({ isActive }) => (isActive ? activeClassName : 'header-link')}>
					Обучение
				</NavLink>
				<button className='header-loginButton'>Стать клиентом!</button>
			</nav>
			<Hamburger />
		</header>
	)
}
