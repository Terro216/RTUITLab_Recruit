import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.scss'
import { Header } from './components/header.js'
import { Main } from './components/main.js'
import { About } from './components/about.js'
import { Footer } from './components/footer.js'
import { Login } from './components/cabinet/login.js'
import { CabinetMain } from './components/cabinet/cabinetMain.js'
import { AuthProvider, RequireAuth } from './scripts/firebaseAuth.js'

export default function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path='/'>
					<Route
						index
						element={
							<div className='app-wrapper'>
								<Header />
								<Main />
								<Footer />
							</div>
						}
					/>
					<Route
						path='about'
						element={
							<div className='app-wrapper'>
								<Header />
								<About />
								<Footer />
							</div>
						}
					/>
					<Route path='protected/'>
						<Route path='login' element={<Login />} />
						<Route
							path='cabinet'
							element={
								<RequireAuth>
									<CabinetMain />
								</RequireAuth>
							}
						/>
					</Route>
					<Route
						path='*'
						element={
							<>there will be 404 page</> //<NoMatch />
						}
					/>
				</Route>
			</Routes>
		</AuthProvider>
	)
}
