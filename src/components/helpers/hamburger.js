import React, { useCallback, useEffect, useRef } from 'react'
import './hamburger.scss'
import { animateCSS } from '../../scripts/functions.js'

export function Hamburger({ from, toggleHamburger }) {
	const root = useRef(null)
	const toggleState = useCallback(() => {
		let burger = root.current.querySelector('.hamburger-icon')
		burger.classList.toggle('openHamburger')
		if (from == 'header') {
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
		} else if (from == 'aside') {
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
	}, [from])
	useEffect(() => {
		toggleHamburger.current = () => {
			if (root.current?.querySelector('.openHamburger')) toggleState()
		}
		return () => { toggleHamburger.current = null }
	}, [toggleHamburger, toggleState])

	return (
		<button ref={root}
			title='Открыть/закрыть меню'
			className={from == 'header' ? 'header-hamburger' : 'aside-hamburger'}
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
