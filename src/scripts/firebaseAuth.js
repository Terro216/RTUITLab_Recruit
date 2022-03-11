import React from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, setDoc, updateDoc, doc } from 'firebase/firestore'
import { getCookie, setCookie, deleteAllCookies } from './cookie.js'

const firebaseConfig = {
	apiKey: 'AIzaSyC-kBpUNGn5AqUM9iDmVUIaEOxrnLbZz54', //please dont steal it
	authDomain: 'honestbroker-pibibi.firebaseapp.com',
	projectId: 'honestbroker-pibibi',
	storageBucket: 'honestbroker-pibibi.appspot.com',
	messagingSenderId: '767000905435',
	appId: '1:767000905435:web:ab81dccc8f1688dc5beefe',
	measurementId: 'G-X0CDRQR9N6',
}

// Initialize Firebase
const firebase = initializeApp(firebaseConfig)
const db = getFirestore(firebase)

const authProvider = {
	isAuthenticated: false,
	async checkMobile(mobile, callback) {
		try {
			const querySnapshot = await getDocs(collection(db, 'users'))
			let hasNum = false
			let name = ''
			querySnapshot.forEach((doc) => {
				if (
					doc.data().mobile == mobile ||
					new RegExp(`${doc.data().mobile.slice(6 - doc.data().mobile.length)}`).test(mobile) //упрощенная проверка на совпадение последних символов
				) {
					hasNum = true
					name = doc.data().name
				}
			})
			callback(false, hasNum, name)
		} catch (e) {
			console.error('Error reading document: ', e)
			callback(true, false)
		}
	},
	async signIn(mobile, pass, callback) {
		try {
			const querySnapshot = await getDocs(collection(db, 'users'))
			let truePass = false
			let user = {}
			querySnapshot.forEach((doc) => {
				if (
					(doc.data().mobile == mobile ||
						new RegExp(`${doc.data().mobile.slice(6 - doc.data().mobile.length)}`).test(mobile)) &&
					doc.data().password === pass
				) {
					truePass = true
					console.table(doc.data()) //debug
					user = {
						name: doc.data().name,
						mobile: doc.data().mobile,
						password: doc.data().password,
						balance: doc.data().balance,
						id: doc.id,
					}
				}
			})
			if (truePass) {
				//this.instantLogin(callback, user, false, true)
				authProvider.isAuthenticated = true
				callback(false, true, user)
			} else {
				callback(false, false, user)
			}
		} catch (e) {
			console.error('Error reading document: ', e)
			callback(true, false, {})
		}
	},
	async register(name, pass, mobile, callback) {
		try {
			const docRef = await addDoc(collection(db, 'users'), {
				name: name,
				password: pass,
				mobile: mobile,
				balance: '1000',
			})
			console.log('Document written with ID: ', docRef.id)
			await setDoc(doc(db, 'users', docRef.id, 'portfolio', 'data'), {})
			callback(false)
		} catch (e) {
			console.error('Error writing document: ', e)
			callback(true)
		}
	},
	signOut(callback) {
		authProvider.isAuthenticated = false
		callback()
	},
	instantLogin(callback, user = null) {
		if (user == null)
			user = {
				name: getCookie('name'),
				password: getCookie('password'),
				mobile: getCookie('mobile'),
				balance: getCookie('balance'),
				id: getCookie('id'),
			}
		authProvider.isAuthenticated = true
		callback(user)
	},
}

let AuthContext = React.createContext(null)

function useAuth() {
	return React.useContext(AuthContext)
}

function AuthProvider({ children }) {
	let [user, setUser] = React.useState(null)
	let navigate = useNavigate()

	function handleChange(state, newUser = null) {
		if (state === 'updateProfileData') {
			updateDoc(doc(db, 'users', newUser?.id), {
				name: newUser?.name,
				password: newUser?.password,
				mobile: newUser?.mobile,
				mail: newUser?.mail,
			})
			deleteAllCookies()
			setCookie('mobile', newUser?.password, { secure: false, 'max-age': 3600 })
		}
		if (state === 'out') {
			setUser(null)
			deleteAllCookies() //deleting mobile (maaybe save for future)?
			setCookie('logged', false, { secure: false, 'max-age': 3600 })
		} else if (newUser !== null) {
			setCookie('password', newUser?.password, { secure: false, 'max-age': 3600 })
			setCookie('name', newUser?.name, { secure: false, 'max-age': 3600 })
			//console.log(newUser, newUser.balance)
			updateDoc(doc(db, 'users', newUser.id), {
				balance: newUser.balance,
			})
			setCookie('mail', newUser?.mail, { secure: false, 'max-age': 3600 })
			setCookie('balance', newUser?.balance, { secure: false, 'max-age': 3600 })
			setCookie('id', newUser?.id, { secure: false, 'max-age': 3600 })
			setCookie('logged', true, { secure: false, 'max-age': 3600 })
			setUser(newUser)
		} else {
			alert('Произошла непредвиденная ошибка')
			navigate('/')
		}
	}

	let checkMobile = (mobile, callback) => {
		return authProvider.checkMobile(mobile, (hasError, hasNum, name = '') => {
			handleChange('out')
			callback(hasError, hasNum, name)
		})
	}

	let signIn = (mobile, pass, callback) => {
		return authProvider.signIn(mobile, pass, (hasError, correctPass, user) => {
			if (!hasError && correctPass) {
				handleChange('in', user)
			}
			callback(hasError, correctPass)
		})
	}

	let register = (name, pass, mobile, callback) => {
		return authProvider.register(name, pass, mobile, (success) => {
			handleChange('out')
			callback(success)
		})
	}

	let signOut = (callback) => {
		return authProvider.signOut(() => {
			handleChange('out')
			callback()
		})
	}

	let instantLogin = (callback) => {
		return authProvider.instantLogin((user) => {
			handleChange('in', user)
			callback()
		})
	}

	let changeBalance = (newBalance) => {
		let userWithNewBalance = {}
		Object.assign(userWithNewBalance, user)
		userWithNewBalance.balance = newBalance.toFixed(2)
		handleChange('in', userWithNewBalance)
	}

	let updateProfileData = (newUser) => {
		handleChange('updateProfileData', newUser)
	}

	let value = { user, checkMobile, signIn, register, signOut, instantLogin, changeBalance, updateProfileData }

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function RequireAuth({ children }) {
	let auth = useAuth()
	let location = useLocation()

	if (!auth.user) {
		// Redirect to the /login page, but save the current location
		return <Navigate to='/protected' state={{ from: location }} replace />
	}

	return children
}

/*function AuthStatus() {
	let auth = useAuth()
	let navigate = useNavigate()

	if (!auth.user) {
		return <p>You are not logged in.</p>
	}

	return <p></p>
}*/

export { authProvider, AuthProvider, useAuth, RequireAuth, firebase, db }
