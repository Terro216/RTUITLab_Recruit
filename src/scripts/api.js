import { useState, useEffect } from 'react'

let ws = new WebSocket('wss://wss.tradernet.ru')

ws.onmessage = function (m) {
	const [event, data] = JSON.parse(m.data)
	console.log(data)
	if (event === 'userData') {
		//handleCatalogChange(data.m[0].s)
	}
}

function useExchangeStatus() {
	const [isWorking, changeStatus] = useState(null)

	useEffect(() => {
		function handleStatusChange(status) {
			console.log(status)
			status === 'OPEN' ? changeStatus(true) : changeStatus(false)
		}

		return () => {
			//handleStatusChange(isWorking) //ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange)
		}
	})

	return isWorking
}

function useCatalog(type) {
	const [catalog, changeCatalog] = useState(null)

	useEffect(() => {
		function handleCatalogChange(catalog) {
			console.log(catalog)
			changeCatalog(catalog)
		}

		return () => {
			//handleStatusChange(isWorking) //ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange)
		}
	})

	return catalog
}

export { ws, useExchangeStatus, useCatalog }
