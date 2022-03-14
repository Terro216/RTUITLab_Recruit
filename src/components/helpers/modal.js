import React, { useState, useEffect } from 'react'
import './modal.scss'

export function Modal({ props }) {
	let [state, changeState] = useState(false)

	function toggleModal() {
		changeState(!state)
	}

	function handleClick() {
		toggleModal()
		if (props?.afterClose === 'reloadPage') {
			props.callback()
			window.location.reload()
		} else if (props?.afterClose === 'notFound') {
			props.callback('notFound')
		} else {
			props?.callback()
		}
	}

	useEffect(() => {
		if (props?.show === true) {
			toggleModal()
		}
	}, [props.show])

	return state ? (
		<div className='modal-wrapper'>
			<div className='modal-window'>
				<h2 className='modal-header'>{props.head}</h2>
				{props.body.length !== 0 ? <div className='modal-body'>{props.body}</div> : <></>}
				<button className='modal-ok' onClick={handleClick}>
					OK
				</button>
			</div>
		</div>
	) : null
}
