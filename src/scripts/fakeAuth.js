import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'

const fakeAuthProvider = {
	isAuthenticated: false,
	signin(callback) {
		fakeAuthProvider.isAuthenticated = true
		setTimeout(callback, 100) // fake async
	},
	signout(callback) {
		fakeAuthProvider.isAuthenticated = false
		setTimeout(callback, 100)
	},
}

let AuthContext = React.createContext(null)

function useAuth() {
	return React.useContext(AuthContext)
}

function AuthProvider({ children }) {
	let [user, setUser] = React.useState(null)

	let signin = (newUser, callback) => {
		return fakeAuthProvider.signin(() => {
			setUser(newUser)
			callback()
		})
	}

	let signout = (callback) => {
		return fakeAuthProvider.signout(() => {
			setUser(null)
			callback()
		})
	}

	let value = { user, signin, signout }

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

export { fakeAuthProvider, AuthProvider, useAuth, RequireAuth }
