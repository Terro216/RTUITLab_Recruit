import './styles/cabinetNews.scss'
import React, { useState } from 'react'
import { News } from '../helpers/news.js'
import { news } from '../../data/catalog.mjs'

export function CabinetNews() {
	const [count, setCount] = useState(2)
	return <section className='profile-news'>
		<h2 className='news-header'>Новости рынка</h2>
		<p className='demo-note'>Учебная редакция · вымышленные материалы от марта 2022 года</p>
		<div className='news-wrapper'>{news.slice(0, count).map(data => <div className='news-item' key={data.id}><News data={data} /></div>)}</div>
		{count < news.length && <button className='news-button' onClick={() => setCount(news.length)}>Загрузить еще</button>}
	</section>
}
