import React, { useEffect, useRef } from 'react'
import './modal.scss'

export function Modal({ props }) {
	const button = useRef(null)
	const callback = useRef(props.callback)
	callback.current = props.callback
	const { show, pending } = props
	useEffect(() => {
		if (!show) return
		const previous = document.activeElement
		button.current?.focus()
		const key = event => {
			if (event.key === 'Escape' && !pending) callback.current?.()
			if (event.key === 'Tab') {
				const buttons = button.current?.parentElement.querySelectorAll('button:not(:disabled)')
				const first = buttons?.[0], last = buttons?.[buttons.length - 1]
				if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
				else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
			}
		}
		window.addEventListener('keydown', key)
		return () => { window.removeEventListener('keydown', key); previous?.focus() }
	}, [show, pending])
	return props.show ? (
		<div className='modal-wrapper' role='dialog' aria-modal='true' aria-label={props.head}>
			<div className='modal-window'>
				<h2 className='modal-header'>{props.head}</h2>
				{props.body ? <div className='modal-body'>{props.body}</div> : null}
				{props.confirm && <button className='demo-cancel' disabled={props.pending} onClick={props.callback}>Отмена</button>}
				<button ref={button} className='modal-ok' disabled={props.pending} onClick={props.confirm || props.callback}>
					{props.pending ? 'Сохранение…' : props.confirm ? 'Подтвердить' : 'OK'}
				</button>
			</div>
		</div>
	) : null
}
