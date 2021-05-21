import { createContext, useContext } from 'react'

import RouterStore from "./store"

export { default as Link } from './link'

const RouterContext = createContext()
export function RouterProvider ({ children }){
	return (
		<RouterContext.Provider value={new RouterStore()}>
			{children}
		</RouterContext.Provider>
	)
}

export function useRouter(){
	const routerStore = useContext(RouterContext)
	
	return routerStore
}
