import React, { useState } from 'react'
import { useDemo } from '../../data/demoStore.js'
import { Modal } from './modal.js'

export function DemoNotice() {
	const { reset, storageError } = useDemo()
	const [confirm, setConfirm] = useState(false)
	const [pending, setPending] = useState(false)
	const [error, setError] = useState('')
	async function resetDemo() {
		if (pending) return
		setPending(true)
		try { await reset(); setConfirm(false); setError('') }
		catch { setConfirm(false); setError('Не удалось сбросить демо. Проверьте разрешение на локальное хранилище.') }
		setPending(false)
	}
	return <>
		<div className='demo-bar'>
			<span title='Учебный проект 2022 года. Компания, предложения, отзывы и новости — часть демонстрации.'>Демо · виртуальные средства · данные в этом браузере</span>
			<button onClick={() => setConfirm(true)}>Сбросить демо</button>
		</div>
		{(storageError || error) && <p className='demo-storage-error' role='alert'>{storageError || error}</p>}
		<Modal props={{ show: confirm, head: 'Сбросить демо?', body: 'Вернутся исходные 10 000$, акции и профиль. История операций в этом браузере будет очищена.', confirm: resetDemo, pending, callback: () => setConfirm(false) }} />
	</>
}
