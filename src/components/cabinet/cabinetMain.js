import './CabinetMain.scss'
import React from 'react'
import { useAuth } from '../../scripts/fakeAuth.js'
import { useNavigate } from 'react-router-dom'

export function CabinetMain() {
	let auth = useAuth()
	let navigate = useNavigate()
	return (
		<main className='cabinetMain-wrapper'>
			welcome to the private cabinet <br />
			<button
				onClick={() => {
					auth.signout(() => navigate('/'))
				}}>
				Sign out
			</button>
		</main>
	)
}
