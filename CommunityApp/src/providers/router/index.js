import React, { createContext, useContext } from 'react'
import RouterStore from './store'

const RouterContext = createContext()

export function RouterProvider ({children}){
	
	return (
		<RouterContext.Provider value={new RouterStore()}>
			{children}
		</RouterContext.Provider>
	)
}

export function useRouterStore (){
	return useContext(RouterContext)
}