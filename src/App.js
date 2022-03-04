import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.scss'

import { Header } from './components/header.js'
import { Main } from './components/main.js'
import { About } from './components/about.js'
import { Footer } from './components/footer.js'

import { Login } from './components/cabinet/login.js'
import { CabinetAside } from './components/cabinet/cabinetAside.js'
import { CabinetMain } from './components/cabinet/cabinetMain.js'
import { CabinetProfile } from './components/cabinet/cabinetProfile.js'
import { CabinetNews } from './components/cabinet/cabinetNews.js'
import { CabinetTrade } from './components/cabinet/cabinetTrade.js'

import { AuthProvider, RequireAuth } from './scripts/firebaseAuth.js'

export default function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path='/'>
					<Route
						index
						element={
							<div className='site-wrapper'>
								<Header />
								<Main />
								<Footer />
							</div>
						}
					/>
					<Route
						path='about'
						element={
							<div className='site-wrapper'>
								<Header />
								<About />
								<Footer />
							</div>
						}
					/>
					<Route path='protected/'>
						<Route path='login' element={<Login />} />
						<Route path='cabinet/'>
							<Route
								index
								element={
									<RequireAuth>
										<div className='cabinet-wrapper'>
											<CabinetAside />
											<CabinetMain />
										</div>
									</RequireAuth>
								}
							/>
							<Route
								path='profile'
								element={
									<RequireAuth>
										<div className='cabinet-wrapper'>
											<CabinetAside />
											<CabinetProfile />
										</div>
									</RequireAuth>
								}
							/>
							<Route
								path='news'
								element={
									<RequireAuth>
										<div className='cabinet-wrapper'>
											<CabinetAside />
											<CabinetNews />
										</div>
									</RequireAuth>
								}
							/>
							<Route
								path='trade'
								element={
									<RequireAuth>
										<div className='cabinet-wrapper'>
											<CabinetAside />
											<CabinetTrade />
										</div>
									</RequireAuth>
								}
							/>
						</Route>
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
