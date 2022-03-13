import { db } from './firebaseAuth.js'
import { doc, setDoc, updateDoc, getDoc, deleteField } from 'firebase/firestore'
import { getTimeEpoch } from './functions.js'

async function trade(auth, action, name, amount, price) {
	let [ticker, exchange] = name.split('.')
	let time = getTimeEpoch()
	let user = auth.user
	if (action === 'buy') {
		const portfolioHistory = doc(db, 'users', user.id, 'portfolio/history/buys', time)
		const portfolio = doc(db, 'users', user.id, 'portfolio', 'data')

		await setDoc(portfolioHistory, {
			name,
			amount,
			price,
		})
		let currentAmount =
			(await getDoc(portfolio)
				.then((doc) => doc.data())
				.then((data) => +data[ticker][exchange])
				.catch(() => 0)) || 0
		await updateDoc(portfolio, {
			[name]: currentAmount + amount,
		})
		await auth.changeBalance(+user.balance - price * amount)
	} else if (action === 'sell') {
		const portfolioHistory = doc(db, 'users', user.id, 'portfolio/history/sells', time)
		const portfolio = doc(db, 'users', user.id, 'portfolio', 'data')

		await setDoc(portfolioHistory, {
			name,
			amount,
			price,
		})

		await updateDoc(portfolio, {
			[name]: deleteField(), //currentAmount - amount,
		})
		auth.changeBalance(+user.balance + price)
	}
}

export { trade }
