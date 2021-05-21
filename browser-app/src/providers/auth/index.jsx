import { createContext, useContext } from 'react'
import { observer } from "mobx-react-lite";
import AuthStore from './store';

const AuthContext = createContext()

export const AuthProvider = observer(
	function AuthProvider ({children}){

		return(
			<AuthContext.Provider value={new AuthStore()}>
				{children}
			</AuthContext.Provider>
		)
	}
)


export function useAuth (){
	const auth = useContext(AuthContext)

	return auth
}