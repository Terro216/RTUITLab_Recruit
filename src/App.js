import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import './App.scss'

import { Header } from './components/header.js'
import { Main } from './components/main.js'
import { About } from './components/about.js'
import { Footer } from './components/footer.js'
import { Tariffs } from './components/tariffs.js'
import { Error404 } from './components/404.js'

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
			<Routes path='/'>
				<Route
					path='/'
					element={
						<div className='site-wrapper'>
							<Header />
							<Outlet />
							<Footer />
						</div>
					}>
					<Route index element={<Main />} />
					<Route path='about' element={<About />} />
					<Route path='tariffs' element={<Tariffs />} />
				</Route>
				<Route path='/protected/'>
					<Route index element={<Login />} />
					<Route
						path='cabinet/'
						element={
							<RequireAuth>
								<div className='cabinet-wrapper'>
									<CabinetAside />
									<Outlet />
								</div>
							</RequireAuth>
						}>
						<Route index element={<CabinetMain />} />
						<Route path='profile' element={<CabinetProfile />} />
						<Route path='news' element={<CabinetNews />} />
						<Route path='trade' element={<CabinetTrade />} />
					</Route>
				</Route>
				<Route path='*' element={<Error404 />} />
			</Routes>
		</AuthProvider>
	)
}
