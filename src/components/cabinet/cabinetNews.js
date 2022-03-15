import './styles/cabinetNews.scss'
import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import { News } from '../helpers/news.js'
import { Loader } from '../helpers/loader.js'

export function CabinetNews() {
	let [newsList, setNewsList] = useState(null)

	async function getNewsList(val = '') {
		try {
			const apiToken = 'NrSAztXgFEc3mgDn0ObtR5j1GdTa7qo22nb9kI9C' //dont steal it please
			let query = 'https://api.marketaux.com/v1/news/all?'
			if (val === 'more') {
				let start = new Date(2020, 0, 1)
				let end = new Date(2022, 0, 1)
				let randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
					.toISOString()
					.split('T')[0]
				query += `sentiment_avg_gte=0.1&language=ru&published_before=${randomDate}&api_token=${apiToken}`
			} else {
				query += `sentiment_avg_gte=0.1&language=ru&symbols=TSLA,AMZN,MSFT,AAPL&api_token=${apiToken}`
			}
			await fetch(query)
				.then((res) => res.json())
				.then((res) => {
					if (res.data === undefined) throw 'err'
					else if (res.data.length === 0) {
						getNewsList(val)
						throw 'end'
					}
					setNewsList(res.data)
				})
				.catch(() => {
					throw 'err'
				})
		} catch (e) {
			if (e === 'end') return 0
			console.info('trying get news again')
			try {
				const apiToken = 'HermQXrbr1zsGMKKqZmBkDmXz9vXpWLYVTbvYMxx' //dont steal it please //backup token
				let query = 'https://api.marketaux.com/v1/news/all?'
				if (val === 'more') {
					document.querySelector('.loader-spinner').classList.remove('hidden')
					let start = new Date(2020, 1, 1)
					let end = new Date(2022, 1, 1)
					let randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
						.toISOString()
						.split('T')[0]
					query += `sentiment_avg_gte=0.1&language=ru&published_before=${randomDate}&api_token=${apiToken}`
				} else {
					query += `sentiment_avg_gte=0.1&language=ru&symbols=TSLA,AMZN,MSFT,AAPL&api_token=${apiToken}`
				}
				await fetch(query)
					.then((res) => res.json())
					.then((res) => {
						if (res.data === undefined) throw 'err'

						setNewsList(res.data)
					})
					.catch((err) => {
						throw err
					})
			} catch {
				setNewsList('error')
			}
		}
		window.scrollTo({ top: 0, behavior: 'smooth' })
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
				'<h3>Не удалось загрузить новости :( <br/> Попробуйте позже</h3>'
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
