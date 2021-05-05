import React, { createContext, useContext } from 'react'
import AuthStore from './store'

const AuthContext = createContext()

export function AuthProvider ({children}){
	
	return (
		<AuthContext.Provider value={new AuthStore()}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuthStore (){
	return useContext(AuthContext)
}