import { firebase, db } from './firebaseAuth.js'
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore'

const getTimeEpoch = () => {
	return new Date().getTime().toString()
}

async function trade(user, action, name, amount, price) {
	if (action === 'buy') {
		let time = getTimeEpoch()
		const portfolioHistory = doc(db, 'users', user.id, 'portfolio/history/buys', time)
		const portfolio = doc(db, 'users', user.id, 'portfolio', 'data')

		await setDoc(portfolioHistory, {
			name: name,
			amount: amount,
			price: price,
		})
		let nameAmount = `${name}_amount`
		let currentAmount = await getDoc(portfolio)
			.then((doc) => doc.data())
			.then((data) => data[nameAmount])
			.catch(() => 0)
		console.log(currentAmount)
		await setDoc(portfolio, {
			[nameAmount]: amount + currentAmount,
		})
	}
	if (action === 'sell') {
		let time = getTimeEpoch()
		const portfolioHistory = doc(db, 'users', user.id, 'portfolio/history/sells', time)
		const portfolio = doc(db, 'users', user.id, 'portfolio', 'data')

		await setDoc(portfolioHistory, {
			name: name,
			amount: amount,
			price: price,
		})

		let nameAmount = `${name}_amount`
		let currentAmount = await getDoc(portfolio)
			.then((doc) => doc.data())
			.then((data) => data[nameAmount])
			.catch(() => 0)
		await setDoc(portfolio, {
			[nameAmount]: currentAmount - amount,
		})
	}
}

export { trade }
