import './styles/about.scss'
import React from 'react'

export function About() {
	return (
		<section className='about-wrapper'>
			<article className='history-wrapper'>
				<h2 className='history-header'>Краткая история</h2>
				<span className='history-text'>
					Наша компания была основана в 2002 году тремя предпринимателями, уставшими от несправедливости,
					творившейся вокруг. Они подумали и решили сделать то, чего до этого не делал почти никто - честный
					продукт, компанию, которой люди смогут по-настоящему доверять. И они основали &quot;Honest
					Broker&quot; (честный брокер). И вот, теперь мы имеем тысячи довольных клиентов, офисы по всему миру
					и одни из лучших условий на рынке инвестиций.
					<br /> Надеемся, что и вы пополните ряды наших довольных клиентов :)
				</span>
			</article>
			<article className='contact-wrapper'>
				<h2 className='contact-header'>Контакты и адрес:</h2>
				<div className='contact-content'>
					<div>
						<h3 className='contact-content-header'>Как с нами связаться?</h3>
						<ul className='contact-content-list'>
							<li className='contact-content-item'>
								<a href='tel:+7(999)666-77-88'>+7(999)666-77-88</a>
							</li>
							<li className='contact-content-item'>
								<a href='mailto:me@ilyamed.site'>me@ilyamed.site</a>
							</li>
							<li className='contact-content-item'>
								<a href='https://vk.com/ilya_med' target='_blank' rel='noreferrer'>
									Вконтакте
								</a>
							</li>
							<li className='contact-content-item'>
								<a href='https://t.me/Terroo' target='_blank' rel='noreferrer'>
									Телеграм
								</a>
							</li>
							<li className='contact-content-item'>
								<a href='https://www.instagram.com/ilyamed216/' target='_blank' rel='noreferrer'>
									Инстаграм
								</a>
							</li>
						</ul>
					</div>
					<iframe
						src='https://yandex.ru/map-widget/v1/?um=constructor%3A3a459fe2019e715ae2dd98794082dcd7cd057517f33bc3db51024dc1777da71f&amp;source=constructor'
						width='500'
						height='400'
						frameBorder='0'
						title='карта с расположением нашего офиса'
						className='contact-content-map'></iframe>
				</div>
			</article>
		</section>
	)
}
