function getCookie(name) {
	let matches = document.cookie.match(
		new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
	)
	return matches ? decodeURIComponent(matches[1]) : undefined
}

function setCookie(name, value, options = {}) {
	options = {
		path: '/',
		// значения по умолчанию
		...options,
	}

	if (options.expires instanceof Date) {
		options.expires = options.expires.toUTCString()
	}

	let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value)

	for (let optionKey in options) {
		updatedCookie += '; ' + optionKey
		let optionValue = options[optionKey]
		if (optionValue !== true) {
			updatedCookie += '=' + optionValue
		}
	}

	document.cookie = updatedCookie
}

function deleteCookie(name) {
	setCookie(name, '', {
		secure: false,
		'max-age': 0,
	})
}

function deleteAllCookies() {
	//not working in logout
	document.cookie.split(';').forEach(function (c) {
		c = c.split('=')[0]
		deleteCookie(c)
	})
}

export { getCookie, setCookie, deleteCookie, deleteAllCookies }
