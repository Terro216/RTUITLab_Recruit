import React from 'react'
import './hamburger.scss'
import { animateCSS } from '../../scripts/functions.js'

export function Hamburger(props) {
	function toggleState() {
		let burger = document.querySelector('.hamburger-icon')
		burger.classList.toggle('openHamburger')
		if (props.from == 'header') {
			let links = document.querySelector('.header-links')

			if (links.classList.contains('showLinks')) {
				animateCSS('.header-links', 'fadeOut').then(() => {
					links.classList.toggle('showLinks')
				})
			} else {
				links.classList.toggle('showLinks')
				animateCSS('.header-links', 'fadeIn')
			}
			//animateCSS('.header-links', 'backInDown') //too much...
		} else if (props.from == 'aside') {
			let aside = document.querySelector('.cabinetAside-wrapper')

			if (aside.classList.contains('asideDisplay')) {
				aside.classList.toggle('asideDisplay')
				animateCSS('.cabinetAside-wrapper', 'slideInLeft')
			} else {
				animateCSS('.cabinetAside-wrapper', 'slideOutLeft').then(() => {
					aside.classList.toggle('asideDisplay')
				})
			}
		}
	}

	return (
		<button
			title='Открыть/закрыть меню'
			className={props.from == 'header' ? 'header-hamburger' : 'aside-hamburger'}
			onClick={toggleState}>
			<div className='hamburger-icon'>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</button>
	)
}
