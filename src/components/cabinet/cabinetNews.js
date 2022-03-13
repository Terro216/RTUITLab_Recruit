import './styles/cabinetNews.scss'
import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import { News } from '../helpers/news.js'

export function CabinetNews() {
	let [newsList, setNewsList] = useState(null)

	async function getNewsList() {
		const apiToken = 'HermQXrbr1zsGMKKqZmBkDmXz9vXpWLYVTbvYMxx'

		await fetch(`https://api.marketaux.com/v1/news/all?api_token=${apiToken}&language=ru&sentiment_gte=0.5`)
			.then((res) => res.json())
			.then((res) => {
				setNewsList(res.data)
			})
			.catch((err) => {
				console.error(err)
				alert('Произошла ошибка приполучении новостей. обновите страницу')
				setNewsList('error')
			})
	}

	function addNews() {
		newsList.forEach((elem) => {
			let item = document.createElement('div')
			item.classList.add('news-item')
			ReactDom.render(<News data={elem} />, item)
			document.querySelector('.news-wrapper').appendChild(item)
		})
	}

	useEffect(() => {
		document.querySelector('.news-wrapper').innerHTML = ''
		if (newsList === null) {
			getNewsList()
			return
		}
		addNews()
	}, [newsList])

	return (
		<section className='profile-news'>
			<h2 className='news-header'>Новости рынка</h2> <div className='news-wrapper'></div>
		</section>
	)
}
