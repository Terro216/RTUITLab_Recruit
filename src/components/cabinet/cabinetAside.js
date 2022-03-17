import './styles/cabinetAside.scss'
import React from 'react'
import { Link } from 'react-router-dom'
import { Hamburger } from '../helpers/hamburger'
import { useNavigate } from 'react-router-dom'

export function CabinetAside() {
	let navigate = useNavigate()
	const toggleHamburger = React.useRef(null)
	function handleLinkClick() {
		toggleHamburger.current()
	}
	return (
		<>
			<Hamburger from='aside' toggleHamburger={toggleHamburger} />
			<button
				className='cabinetAside-logout'
				aria-label='На главную страницу'
				title='На главную страницу'
				onClick={() => navigate('/')}>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
					<path
						fill='black'
						d='M160 416H96c-17.67 0-32-14.33-32-32V128c0-17.67 14.33-32 32-32h64c17.67 0 32-14.33 32-32S177.7 32 160 32H96C42.98 32 0 74.98 0 128v256c0 53.02 42.98 96 96 96h64c17.67 0 32-14.33 32-32S177.7 416 160 416zM502.6 233.4l-128-128c-12.51-12.51-32.76-12.49-45.25 0c-12.5 12.5-12.5 32.75 0 45.25L402.8 224H192C174.3 224 160 238.3 160 256s14.31 32 32 32h210.8l-73.38 73.38c-12.5 12.5-12.5 32.75 0 45.25s32.75 12.5 45.25 0l128-128C515.1 266.1 515.1 245.9 502.6 233.4z'
					/>
				</svg>
			</button>
			<aside className='cabinetAside-wrapper asideDisplay'>
				<nav className='cabinetAside'>
					<Link to='/protected/cabinet' className='cabinetAside-link' onClick={handleLinkClick}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 576 512'
							className='cabinetAside-icon cabinetAside-icon--home'>
							<path
								fill='white'
								d='M511.8 287.6L512.5 447.7C512.5 450.5 512.3 453.1 512 455.8V472C512 494.1 494.1 512 472 512H456C454.9 512 453.8 511.1 452.7 511.9C451.3 511.1 449.9 512 448.5 512H392C369.9 512 352 494.1 352 472V384C352 366.3 337.7 352 320 352H256C238.3 352 224 366.3 224 384V472C224 494.1 206.1 512 184 512H128.1C126.6 512 125.1 511.9 123.6 511.8C122.4 511.9 121.2 512 120 512H104C81.91 512 64 494.1 64 472V360C64 359.1 64.03 358.1 64.09 357.2V287.6H32.05C14.02 287.6 0 273.5 0 255.5C0 246.5 3.004 238.5 10.01 231.5L266.4 8.016C273.4 1.002 281.4 0 288.4 0C295.4 0 303.4 2.004 309.5 7.014L416 100.7V64C416 46.33 430.3 32 448 32H480C497.7 32 512 46.33 512 64V185L564.8 231.5C572.8 238.5 576.9 246.5 575.8 255.5C575.8 273.5 560.8 287.6 543.8 287.6L511.8 287.6z'
							/>
						</svg>
						<span className='cabinetAside-text'>Главная</span>
					</Link>

					<Link to='/protected/cabinet/profile' className='cabinetAside-link' onClick={handleLinkClick}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 448 512'
							className='cabinetAside-icon cabinetAside-icon--profile'>
							<path
								fill='white'
								d='M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z'
							/>
						</svg>
						<span className='cabinetAside-text'>Профиль</span>
					</Link>
					<Link to='/protected/cabinet/news' className='cabinetAside-link' onClick={handleLinkClick}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 512 512'
							className='cabinetAside-icon cabinetAside-icon--news'>
							<path
								fill='white'
								d='M480 32H128C110.3 32 96 46.33 96 64v336C96 408.8 88.84 416 80 416S64 408.8 64 400V96H32C14.33 96 0 110.3 0 128v288c0 35.35 28.65 64 64 64h384c35.35 0 64-28.65 64-64V64C512 46.33 497.7 32 480 32zM272 416h-96C167.2 416 160 408.8 160 400C160 391.2 167.2 384 176 384h96c8.836 0 16 7.162 16 16C288 408.8 280.8 416 272 416zM272 320h-96C167.2 320 160 312.8 160 304C160 295.2 167.2 288 176 288h96C280.8 288 288 295.2 288 304C288 312.8 280.8 320 272 320zM432 416h-96c-8.836 0-16-7.164-16-16c0-8.838 7.164-16 16-16h96c8.836 0 16 7.162 16 16C448 408.8 440.8 416 432 416zM432 320h-96C327.2 320 320 312.8 320 304C320 295.2 327.2 288 336 288h96C440.8 288 448 295.2 448 304C448 312.8 440.8 320 432 320zM448 208C448 216.8 440.8 224 432 224h-256C167.2 224 160 216.8 160 208v-96C160 103.2 167.2 96 176 96h256C440.8 96 448 103.2 448 112V208z'
							/>
						</svg>
						<span className='cabinetAside-text'>Новости</span>
					</Link>
					<Link to='/protected/cabinet/trade' className='cabinetAside-link' onClick={handleLinkClick}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 640 512'
							className='cabinetAside-icon cabinetAside-icon--trade'>
							<path
								fill='white'
								d='M0 155.2C0 147.9 2.153 140.8 6.188 134.7L81.75 21.37C90.65 8.021 105.6 0 121.7 0H518.3C534.4 0 549.3 8.021 558.2 21.37L633.8 134.7C637.8 140.8 640 147.9 640 155.2C640 175.5 623.5 192 603.2 192H36.84C16.5 192 .0003 175.5 .0003 155.2H0zM64 224H128V384H320V224H384V464C384 490.5 362.5 512 336 512H112C85.49 512 64 490.5 64 464V224zM512 224H576V480C576 497.7 561.7 512 544 512C526.3 512 512 497.7 512 480V224z'
							/>
						</svg>
						<span className='cabinetAside-text'>Торговля</span>
					</Link>
				</nav>
			</aside>
		</>
	)
}
