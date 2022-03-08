import './styles/footer.scss'
import React from 'react'

export function Footer() {
	return (
		<footer className='footer-wrapper'>
			<span>&copy;Честный брокер 2002-2022</span>
			<span>All rights reserved</span>
			<button
				onClick={() => {
					window.scrollTo({
						top: 0,
						behavior: 'smooth',
					})
				}}
				className='toTop'>
				Кнопка, возвращающая наверх
			</button>
		</footer>
	)
}
