import './main.scss'
import React from 'react'
import Ticker from 'react-ticker'

function WelcomeScreen() {
	return (
		<section className='welcome-screen'>
			<div className='welcome-screen-allText'>
				<h1 className='welcome-screen-header'>Всегда играй честно, если все козыри у тебя на руках</h1>
				<span className='welcome-screen-bonus'>В наших договорах нет текста, набранного мелким шрифтом</span>
			</div>
			<div className='welcome-redblop'>
				<svg viewBox='0 0 900 600' width='900' height='600' xmlns='http://www.w3.org/2000/svg' version='1.1'>
					<g transform='translate(469 270)'>
						<path
							d='M112.9 -103.9C155 -70.7 204 -35.4 213.3 9.3C222.6 54 192.3 108 150.1 158C108 208 54 254 0.8 253.2C-52.3 252.3 -104.7 204.7 -152.7 154.7C-200.7 104.7 -244.3 52.3 -251.9 -7.5C-259.4 -67.4 -230.8 -134.8 -182.8 -168C-134.8 -201.2 -67.4 -200.1 -16 -184.1C35.4 -168 70.7 -137 112.9 -103.9'
							fill='#E8244F'></path>
					</g>
				</svg>
			</div>
			<div className='welcome-blueblop'>
				<svg viewBox='0 0 900 600' width='900' height='600' xmlns='http://www.w3.org/2000/svg' version='1.1'>
					<defs>
						<linearGradient id='grad1' gradientUnits='objectBoundingBox'>
							<stop offset='0%' style={{ stopColor: 'rgba(22, 74, 228, 0.7)' }} />
							<stop offset='100%' style={{ stopColor: 'rgba(22,74,228, 1)' }} />
						</linearGradient>
					</defs>
					<g transform='translate(562 303)'>
						<path
							d='M75 -1.5C75 106.3 37.5 212.7 -56.2 212.7C-150 212.7 -300 106.3 -300 -1.5C-300 -109.3 -150 -218.7 -56.2 -218.7C37.5 -218.7 75 -109.3 75 -1.5'
							fill='url(#grad1)'></path>
					</g>
				</svg>
			</div>
		</section>
	)
}

function WhyUs() {
	return (
		<section className='whyus-wrapper'>
			<h2 className='whyus-header'>Почему мы?</h2>
			<div className='whyus-reasons'>
				<div className='whyus-reasons-card'>20 лет на рынке</div>
				<div className='whyus-reasons-card'>100+ тысяч клиентов</div>
				<div className='whyus-reasons-card withgreytext'>
					Самые низкие комиссии <br />
					<span className='greytext'>от 0.04% за сделку</span>
				</div>
				<div className='whyus-reasons-card'>Открытие счета за 5 минут</div>
				<div className='whyus-reasons-card'>Поддержка в чате 24/7</div>
				<div className='whyus-reasons-card'>Советы по выбору акций</div>
			</div>
		</section>
	)
}

function B() {
	return (
		<section>
			<article className='block'>
				<h1 className='blockx'>xsxs</h1>
			</article>
			<article className='block'>
				<h1 className='blockx'>xsxs</h1>
			</article>
			<article className='block'>
				<h1 className='blockx'>xsxs</h1>
			</article>
			<article className='block'>
				<h1 className='blockx'>xsxs</h1>
			</article>
			<article className='block'>
				<h1 className='blockx'>xsxs</h1>
			</article>
			<article className='block'>
				<h1 className='blockx'>xsxs</h1>
			</article>
		</section>
	)
}

function MovingText() {
	return (
		<section className='moving-wrapper'>
			<h2>Отзывы о нас (или может компании-партнеры)</h2>
			<Ticker direction='toRight' mode='smooth'>
				{() => (
					<div className='moving-line'>
						<h1>This is the Headline!</h1>
					</div>
				)}
			</Ticker>
			<Ticker direction='toLeft' mode='smooth'>
				{() => (
					<div className='moving-line'>
						<h1>This is the Headline!</h1>
					</div>
				)}
			</Ticker>
		</section>
	)
}

export function Main() {
	return (
		<main className='main-wrapper'>
			<WelcomeScreen />
			<WhyUs />
			<B />
			<MovingText />
		</main>
	)
}
