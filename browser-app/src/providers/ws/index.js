import React, { createContext, useContext } from 'react'
import WsStore from './store'

const WsContext = createContext()

export function WsProvider ({children}){
	
	return (
		<WsContext.Provider value={new WsStore()}>
			{children}
		</WsContext.Provider>
	)
}

export function useWS (){
	return useContext(WsContext)
}