import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore'

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
const db = getFirestore()

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
			callback(true, false, '')
		}
	},
	async signIn(pass, callback) {
		try {
			const querySnapshot = await getDocs(collection(db, 'users'))
			let truePass = false
			let user = {}
			querySnapshot.forEach((doc) => {
				console.log(pass, doc.data().password)
				if (doc.data().password === pass) {
					truePass = true
					user = { name: doc.data().name, mobile: doc.data().mobile, password: doc.data().password }
				}
			})
			if (truePass) {
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
}

let AuthContext = React.createContext(null)

function useAuth() {
	return React.useContext(AuthContext)
}

function AuthProvider({ children }) {
	let [user, setUser] = React.useState(null)

	let checkMobile = (mobile, callback) => {
		return authProvider.checkMobile(mobile, (hasError, hasNum, name) => {
			callback(hasError, hasNum, name)
		})
	}

	let signIn = (pass, callback) => {
		return authProvider.signIn(pass, (hasError, correctPass, user) => {
			setUser(user)
			callback(hasError, correctPass)
		})
	}

	let register = (name, pass, mobile, callback) => {
		return authProvider.register(name, pass, mobile, (success) => {
			callback(success)
		})
	}

	let signOut = (callback) => {
		return authProvider.signOut(() => {
			setUser(null)
			callback()
		})
	}

	let value = { user, checkMobile, signIn, register, signOut }

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

export { authProvider, AuthProvider, useAuth, RequireAuth, firebase }
