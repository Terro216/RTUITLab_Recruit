function checkMobileRegex(number) {
	return /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/gm.test(number)
}

function checkMail(mail) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gm.test(
		mail
	)
}

async function getInfo(ticker) {
	let params = {
		cmd: 'getStockData',
		params: {
			ticker,
			lang: 'ru',
		},
	}

	let apiElem = await fetch(`https://tradernet.ru/api/?q=${JSON.stringify(params)}`)
		.then((response) => response.json())
		.then((data) => data)
		.catch((error) => console.error('error:', error))
	return apiElem
}

function getTimeEpoch() {
	return new Date().getTime().toString()
}

export { checkMobileRegex, checkMail, getInfo, getTimeEpoch }
