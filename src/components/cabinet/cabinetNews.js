import './styles/cabinetNews.scss'
import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import { News } from '../helpers/news.js'
import { Loader } from '../helpers/loader.js'

export function CabinetNews() {
	let [newsList, setNewsList] = useState(null)

	function getNewsList() {
		// This historical integration exposed provider credentials in the browser.
		// The deployed standalone demo supplies local news without an API token.
		setNewsList('error')
	}

	function addNews() {
		newsList.forEach((elem) => {
			let item = document.createElement('div')
			item.classList.add('news-item')
			ReactDom.render(<News data={elem} />, item)
			document.querySelector('.news-wrapper').appendChild(item)
		})
		document.querySelector('.loader-spinner').classList.add('hidden')
	}

	useEffect(() => {
		document.querySelector('.news-wrapper').innerHTML = ''

		if (newsList === null) {
			getNewsList()
			return
		} else if (newsList == 'error') {
			document.querySelector('.loader-spinner').classList.add('hidden')
			document.querySelector('.news-button').classList.add('hidden')
			document.querySelector('.news-wrapper').innerHTML =
				'<h3>Новости отключены в архивной версии. Актуальное демо использует локальные новости.</h3>'
			return
		} else {
			addNews()
		}
	}, [newsList])

	return (
		<section className='profile-news'>
			<Loader />
			<h2 className='news-header'>Новости рынка</h2>
			<div className='news-wrapper'></div>
			<button className='news-button' onClick={() => getNewsList('more')}>
				Загрузить еще
			</button>
		</section>
	)
}
