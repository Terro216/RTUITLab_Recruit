function animateCSS(element, animation, prefix = 'animate__') {
	return new Promise((resolve) => {
		const animationName = `${prefix}${animation}`
		const node = document.querySelector(element)

		if (!node) { resolve(); return }
		node.classList.add(`${prefix}animated`, animationName)

		// after animation remove classes and resolve Promise
		function handleAnimationEnd(event) {
			event.stopPropagation()
			node.classList.remove(`${prefix}animated`, animationName)
			resolve('Animation ended')
		}

		node.addEventListener('animationend', handleAnimationEnd, { once: true })
	})
}

export { animateCSS }
