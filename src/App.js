import React, { useContext, createContext, useState } from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Redirect,
	useHistory,
	useLocation,
} from 'react-router-dom'
import './App.scss'
import { Header } from './components/header.js'
import { Main } from './components/main.js'
import { About } from './components/about.js'
import { Footer } from './components/footer.js'

export function App() {
	const authContext = createContext()

	function useAuth() {
		return useContext(authContext)
	}
	function PrivateRoute({ children, ...rest }) {
		let auth = useAuth()
		return (
			<Route
				{...rest}
				render={({ location }) =>
					auth.user ? (
						children
					) : (
						<Redirect
							to={{
								pathname: '/login',
								state: { from: location },
							}}
						/>
					)
				}
			/>
		)
	}
	return (
		<Router basename='/'>
			<Routes>
				<Route
					path='/'
					element={
						<div className='app-wrapper'>
							<Header />
							<Main />
							<Footer />
						</div>
					}
				/>
				<Route
					path='/about'
					element={
						<div className='app-wrapper'>
							<Header />
							<About />
							<Footer />
						</div>
					}
				/>
				<Route
					path='/login'
					element={
						<div className='login-wrapper'>
							{
								//<Login />
							}
						</div>
					}
				/>
				<Route path='/protected' />
			</Routes>
		</Router>
	)
}
