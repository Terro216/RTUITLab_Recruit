import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore'
import { deleteCookie, getCookie, setCookie } from './cookie'

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
const analytics = getAnalytics(firebase)
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
					new RegExp(`${doc.data().mobile.slice(3 - doc.data().mobile.length)}`).test(+mobile)
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
						new RegExp(`${doc.data().mobile.slice(3 - doc.data().mobile.length)}`).test(mobile)) &&
					doc.data().password === pass
				) {
					truePass = true
					console.table(doc.data())
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

	function handleChange(state, user = null) {
		if (state === 'out') {
			setUser(null)
			deleteCookie('password')
			deleteCookie('name')
			deleteCookie('balance')
			setCookie('logged', false, { secure: false, 'max-age': 3600 })
		} else {
			setUser(user)
			setCookie('password', user?.password, { secure: false, 'max-age': 3600 })
			setCookie('name', user?.name, { secure: false, 'max-age': 3600 })
			setCookie('balance', user?.balance, { secure: false, 'max-age': 3600 })
			setCookie('id', user?.id, { secure: false, 'max-age': 3600 })
			setCookie('logged', true, { secure: false, 'max-age': 3600 })
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
			setCookie('mobile', '', { secure: false, 'max-age': 3600 })
			callback()
		})
	}

	let instantLogin = (callback) => {
		return authProvider.instantLogin((user) => {
			handleChange('in', user)
			callback()
		})
	}

	let value = { user, checkMobile, signIn, register, signOut, instantLogin }

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function RequireAuth({ children }) {
	let auth = useAuth()
	let location = useLocation()

	if (!auth.user) {
		// Redirect to the /login page, but save the current location
		return <Navigate to='/protected/login' state={{ from: location }} replace />
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
