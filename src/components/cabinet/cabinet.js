import './styles/cabinet.scss'
import React from 'react'
import { useAuth } from '../../scripts/firebaseAuth.js'
import { useNavigate } from 'react-router-dom'
import { CabinetAside } from './cabinetAside.js'
import { CabinetMain } from './cabinetMain'

export function Cabinet() {
	let auth = useAuth()
	let navigate = useNavigate()
	return (
		<div className='cabinet-wrapper'>
			<CabinetAside />
			<CabinetMain />
			<button
				onClick={() => {
					auth.signOut(() => navigate('/'))
				}}>
				Sign out
			</button>
		</div>
	)
}
