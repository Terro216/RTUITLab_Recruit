import React, { useState } from 'react'
import './news.scss'
const image = new URL('../../../public/heart.svg', import.meta.url).href
export function News({ data }) {
	const [expanded, setExpanded] = useState(false)
	return <article className='news'>
		<img className='news-image demo-news-image' src={image} width='100' height='100' alt='Честный брокер · учебная редакция' />
		<h3 className='news-head'>{data.title}</h3>
		<time dateTime={data.date}>{new Date(data.date + 'T12:00:00Z').toLocaleDateString('ru-RU', { timeZone: 'UTC' })} · Демо</time>
		<div className='news-content'>{data.snippet}</div>
		{expanded && <div className='news-content'>{data.body}</div>}
		<button className='news-link' aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Свернуть' : 'Читать подробнее'}</button>
	</article>
}
