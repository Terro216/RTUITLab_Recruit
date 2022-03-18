import React from 'react'
import './news.scss'
export function News({ data }) {
	return (
		<article className='news'>
			<img className='news-image' src={data.image_url} width='100' height='100' />
			<h3 className='news-head'>{data.title}</h3>
			<div className='news-content'>{data.snippet}</div>
			<a href={data.url} className='news-link' target='_blank' rel='noreferrer'>
				Читать подробнее
			</a>
		</article>
	)
}
