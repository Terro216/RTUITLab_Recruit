import './CabinetMain.scss'
import React from 'react'
import { useAuth } from '../../scripts/firebaseAuth.js'
import { useNavigate } from 'react-router-dom'

export function CabinetMain() {
	let auth = useAuth()
	let navigate = useNavigate()
	return (
		<main className='cabinetMain-wrapper'>
			welcome to the private cabinet <br />
			<button
				onClick={() => {
					auth.signOut(() => navigate('/'))
				}}>
				Sign out
			</button>
		</main>
	)
}
