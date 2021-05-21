import { observer } from "mobx-react";
import { useAuth } from "providers/auth";
import { useEffect } from "react";
import { useWS } from "providers/ws";

import AuthPage from 'pages/auth'
import ChatPage from 'pages/chat'

function App() {

	const authStore = useAuth()
	const wsStore = useWS()

	useEffect(() => {
		authStore.init()
	}, [ authStore ])

	const status = authStore.status
	useEffect(() => {
		if(status === 'authorized'){
			wsStore.init()
			return () => wsStore.dispose()
		}
	}, [ status ])


	if (authStore.status === 'not-authorized')
		return <AuthPage/>

	if(authStore.status === 'authorized')
		return <ChatPage/>

	return <div>Загрузка...</div>
}

export default observer(App);
