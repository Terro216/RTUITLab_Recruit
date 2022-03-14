import React, { useEffect } from 'react'
import './hamburger.scss'

export function Hamburger(props) {
	function toggleState() {
		document.querySelector('.hamburger-icon').classList.toggle('openHamburger')
		if (props.from == 'header') {
			document.querySelector('.header-links').classList.toggle('showLinks')
			//document.querySelector('.header-links').style.display = 'flex'
			//animateCSS('.sidebar-wrapper', 'slideInDown')
		} else {
			document.querySelector('.cabinetAside-wrapper').classList.toggle('asideDisplay')
		}
	}

	useEffect(() => {
		//console.log(props.toggleHamburger.current)
		//props.toggleHamburger.current = toggleState //?
	}, [props.toggleHamburger])

	return (
		<div
			aria-label='Открыть/закрыть меню'
			title='Открыть/закрыть меню'
			className={props.from == 'header' ? 'header-hamburger' : 'aside-hamburger'}
			onClick={toggleState}>
			<div className='hamburger-icon'>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>
	)
}
