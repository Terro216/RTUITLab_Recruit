import './styles/main.scss'
import React from 'react'
import Ticker from 'react-ticker'
import { NavLink } from 'react-router-dom'
import * as tinder from '../../public/tinder.svg'
import * as spotify from '../../public/spotify.svg'
import * as apple from '../../public/apple-logo.svg'
import * as airbnb from '../../public/airbnb-logo.svg'
import * as batman from '../../public/batman-logo.svg'
import * as reactLogo from '../../public/react-logo.svg'
import * as mobScreen from '../../public/Pixel4_App.png'
import * as gpBadge from '../../public/Google_Play-Badge.svg'
import * as asBadge from '../../public/app-store-badge.svg'

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

function OurServices() {
	return (
		<section className='services-wrapper'>
			{
				//<h2 className='services-header'>Что мы делаем?</h2>
			}
			<span className='services-description-text'>
				Профессиональное предоставление брокерских услуг.{' '}
				{
					//Биржевой курс валют. Открытие ИИС.
				}
			</span>
		</section>
	)
}

function WhyUs() {
	return (
		<div className='whyus-wrapper'>
			<h2 className='whyus-header'>Почему мы?</h2>
			<section className='whyus-reasons'>
				<article className='whyus-reasons-card'>20 лет на рынке</article>
				<article className='whyus-reasons-card'>100+ тысяч клиентов</article>
				<article className='whyus-reasons-card withgreytext'>
					Самые низкие комиссии <br />
					<span className='greytext'>Всего 0.04% за сделку на базовом тарифе</span>
				</article>
				<article className='whyus-reasons-card withgreytext'>
					Открытие счета за 5 минут <br />
					<span className='greytext'>Или даже быстрее</span>
				</article>
				<article className='whyus-reasons-card'>Поддержка в чате 24/7</article>
				<article className='whyus-reasons-card'>Обучение торговле</article>
			</section>
		</div>
	)
}

function Principles() {
	return (
		<section className='principles-wrapper'>
			<article className='principles'>
				<h2 className='principles-header'>Наши принципы</h2>
				<span className='principles-text'>
					Выбирая нас, вы получаете по-настоящему качественные услуги, полностью покрывающие потребности как и
					частных инвесторов, так и крупных компаний с мировым именем. <br />
					<br />
					На первом месте для нас всегда стоит честность, поэтому мы никогда не отключим торги сославшись на
					технические неполадки, не сменим условия вашего тарифа без предварительного согласия, не будем
					навязывать вам огромное количество бесполезных услуг, а наоборот, будем предлагать вам более
					выгодные условия и персональные системы скидок, подходящие под ваши цели.
				</span>
			</article>
		</section>
	)
}

function Review({ author, text }) {
	return (
		<div className='review-container'>
			<div className='review-container-top'>
				<img
					className='review-avatar'
					src='https://via.placeholder.com/130'
					width='130'
					height='130'
					loading='lazy'
					alt={`Avatar of ${author}`}
				/>
				<span className='review-author'>{author}</span>
			</div>
			<div className='review-container-bottom'>
				<span className='review-text'>{text}</span>
			</div>
		</div>
	)
}

function MovingText() {
	return (
		<section className='moving-wrapper'>
			<h2 className='moving-header'>Отзывы наших клиентов:</h2>
			<Ticker direction='toRight' mode='smooth'>
				{() => (
					<div className='moving-line'>
						<Review
							author='Пол Андерсон, Творец'
							text='Это лучший брокер, с которым мне доводилось работать. 100% рекомендую'
						/>
						<Review
							author='Брайан Мэй, Музыкант'
							text='Вся работа шла как часы, никаких минусов за 2 года особо не заметил. Правда потерял около
									50% своих сбережений, но это сугубо моя вина, брокер отговаривал как мог.'
						/>
						<Review
							author='Уоррен Баффетт, Инвестор'
							text='Работаю только с этой компанией уже 5 лет, всем доволен'
						/>
						<Review
							author='Константин Николаев, Программист'
							text='Настолько удобный личный кабинет, что даже моя кошка научилась им пользоваться и уже закрыла 3 позиции в
									плюс!'
						/>
						<Review
							author='Хантер Томпсон, Журналист'
							text='В общем то деньги у меня надолго не задерживаются.. но брокер и в правду хорош'
						/>
					</div>
				)}
			</Ticker>

			<h2 className='moving-header'>Компании, с которыми мы работали:</h2>
			<Ticker direction='toLeft' mode='smooth'>
				{() => (
					<div className='moving-line logo-line'>
						<img src={apple} className='company-logo' alt='Apple logo' width='150' height='150' />
						<img src={spotify} className='company-logo' alt='Spotify logo' width='150' height='150' />
						<img src={batman} className='company-logo' alt='Batman movie logo' width='150' height='150' />
						<img src={airbnb} className='company-logo' alt='Airbnb logo' width='150' height='150' />
						<img src={reactLogo} className='company-logo' alt='React JS logo' width='150' height='150' />
						<img src={tinder} className='company-logo' alt='Tinder logo' width='150' height='150' />
					</div>
				)}
			</Ticker>
		</section>
	)
}

function MobileApp() {
	return (
		<section className='mobile-wrapper'>
			<h2 className='mobile-header'>А еще у нас есть мобильное приложение</h2>
			<article className='mobile-content'>
				<div className='mobile-content-description'>
					<h3>В нем вы можете:</h3>
					<ul className='mobile-list-wrapper'>
						<li className='mobile-list-item'>Открыть счет</li>
						<li className='mobile-list-item'>Просматривать свой портфель</li>
						<li className='mobile-list-item'>Совершать сделки</li>
						<li className='mobile-list-item'>Пользоваться помощью оператора в чате</li>
						<li className='mobile-list-item'>Следить за текущим состоянием рынка</li>
						<li className='mobile-list-item'>Общаться с другими пользователями</li>
						<li className='mobile-list-item'>Читать новости</li>

						<li className='mobile-list-item'>И многое другое</li>
					</ul>
					<div className='mobile-apps'>
						<img
							src={gpBadge}
							alt='доступно в google play'
							width='120'
							height='250'
							className='mobile-apps-badge'
						/>
						<img
							src={asBadge}
							alt='доступно в app store'
							width='120'
							height='250'
							className='mobile-apps-badge mobile-apps-badge--apple'
						/>
					</div>
				</div>
				<img
					src={mobScreen}
					alt='скриншот нашей программы на телефоне'
					className='mobile-content-img'
					width='190'
					height='380'
				/>
			</article>
		</section>
	)
}

function End() {
	return (
		<section className='end-wrapper'>
			<article className='end'>
				<h2>
					Долистал до самого конца и все еще не открыл у нас счет? <br />
					Скорее нажимай на кнопку ниже!
				</h2>
				<NavLink to='/protected/cabinet' className='end-loginButton'>
					Начать инвестировать!
				</NavLink>
				<span>P.S. это бесплатно</span>
			</article>
		</section>
	)
}

export function Main() {
	return (
		<main className='main-wrapper'>
			<WelcomeScreen />
			<OurServices />
			<WhyUs />
			<Principles />
			<MovingText />
			<MobileApp />
			<End />
		</main>
	)
}
