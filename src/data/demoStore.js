import React, { useContext, useEffect, useState } from 'react'
import { STORAGE_KEY, initialState, decodeState, applyCommand } from './model.mjs'

const Context = React.createContext(null)
export const operationId = () => crypto.randomUUID()

export function DemoProvider({ children }) {
	const [state, setState] = useState(initialState)
	const [storageError, setStorageError] = useState('')
	function read() {
		const raw = localStorage.getItem(STORAGE_KEY)
		return raw === null ? initialState() : decodeState(raw)
	}
	useEffect(() => {
		function refresh() {
			try { setState(read()); setStorageError('') }
			catch (error) { setStorageError(error.message || 'Хранилище браузера недоступно') }
		}
		refresh()
		const sync = event => { if (event.key === STORAGE_KEY || event.key === null) refresh() }
		window.addEventListener('storage', sync)
		return () => window.removeEventListener('storage', sync)
	}, [])

	async function locked(action) {
		// Web Locks serialize read/modify/write across tabs of this browser profile.
		if (navigator.locks) return navigator.locks.request(STORAGE_KEY, action)
		throw new Error('Для сохранения операций нужен современный браузер с поддержкой Web Locks и HTTPS.')
	}
	async function dispatch(command) {
		return locked(() => {
			const current = read()
			const next = applyCommand(current, command)
			try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) }
			catch { setStorageError('Не удалось сохранить демо. Разрешите локальное хранилище или освободите место.'); throw new Error('Операция не сохранена и не выполнена') }
			setState(next)
			setStorageError('')
			return next
		})
	}
	async function reset() {
		return locked(() => {
			const next = initialState()
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
			setState(next)
			setStorageError('')
		})
	}
	return <Context.Provider value={{ state, dispatch, reset, storageError }}>{children}</Context.Provider>
}

export const useDemo = () => useContext(Context)
