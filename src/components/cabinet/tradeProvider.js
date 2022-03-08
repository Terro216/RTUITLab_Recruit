import React from 'react'

let TradeContext = React.createContext(null)

function useTrade() {
	return React.useContext(TradeContext)
}

const tradeProvider = {
	isAuthenticated: false,
	async checkStatus(name, callback) {},
}

function TradeProvider({ children }) {
	let [exchangeStatus, setExchangeStatus] = React.useState(null)

	function handleExchangeStatus(newStatus) {
		setExchangeStatus(newStatus)
	}

	let checkStatus = (name, callback) => {
		return tradeProvider.checkStatus(name, (status) => {
			handleExchangeStatus(status)
			callback()
		})
	}

	let value = { exchangeStatus }

	return <TradeContext.Provider value={value}>{children}</TradeContext.Provider>
}

/*function AuthStatus() {
        let auth = useAuth()
        let navigate = useNavigate()
    
        if (!auth.user) {
            return <p>You are not logged in.</p>
        }
    
        return <p></p>
    }*/

export { TradeProvider, tradeProvider, useTrade } //{ authProvider, AuthProvider, useAuth, RequireAuth, firebase, db }
