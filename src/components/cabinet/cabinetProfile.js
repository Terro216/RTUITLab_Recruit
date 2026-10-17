import './styles/cabinetProfile.scss'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDemo, operationId } from '../../data/demoStore.js'
import { Modal } from '../helpers/modal.js'

export function CabinetProfile() {
	const { state, dispatch } = useDemo()
	const [editing, setEditing] = useState(false)
	const [profile, setProfile] = useState(state.profile)
	const [notice, setNotice] = useState(null)
	const [pending, setPending] = useState(false)
	async function save(event) {
		event.preventDefault()
		if (pending) return
		setPending(true)
		try {
			await dispatch({ id: operationId(), type: 'profile', profile })
			setEditing(false)
			setNotice({ head: 'Успех!', body: 'Данные сохранены в этом браузере.' })
		} catch (error) { setNotice({ head: 'Проверьте данные', body: error.message }) }
		setPending(false)
	}
	return <section className='profile-wrapper'>
		<Modal props={{ show: !!notice, ...notice, callback: () => setNotice(null) }} />
		<h2 className='profile-welcome'>Здравствуйте, {state.profile.name}</h2>
			<div className='profile-avatar'>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'>
					<path
						fill='black'
						d='M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z'
					/>
				</svg>
			</div>
		<form className='profile-data' onSubmit={save}>
			<h3>Ваши данные:</h3>
			<p className='demo-note'>Локальный демопрофиль. Можно использовать вымышленные данные.</p>
			{[['name', 'Ваше имя:', 'text'], ['mobile', 'Ваш номер телефона:', 'tel'], ['mail', 'Ваш почтовый адрес:', 'email']].map(([key, label, type]) => <label key={key}>{label}<br /><input type={type} maxLength={key === 'name' ? 80 : key === 'mobile' ? 40 : 120} value={(editing ? profile : state.profile)[key]} onChange={e => setProfile({ ...profile, [key]: e.target.value })} disabled={!editing} required autoComplete='off' /></label>)}
			<div className='profile-buttons'>
				{editing ? <button className='profile-button' disabled={pending} type='submit'>Сохранить</button> : <button className='profile-button' type='button' onClick={event => { event.preventDefault(); setProfile(state.profile); setEditing(true) }}>Поменять данные</button>}
				{editing ? <button className='profile-button profile-button--exit' type='button' onClick={() => setEditing(false)}>Отмена</button> : <Link className='profile-button profile-button--exit' to='/'>На главную</Link>}
			</div>
		</form>
	</section>
}
