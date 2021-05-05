import React, { useEffect } from 'react'
import { useRouterStore } from 'src/providers/router'
import { useAuthStore } from '../providers/auth'
import { observer } from 'mobx-react'
import { View, Text, BackHandler } from 'react-native'
import { GET } from 'src/services'

import LoginPage from './login'
import RegisterPage from './register'
import ChatPage from './chat'

function AppPages (){

	const routerStore = useRouterStore()
	const authStore = useAuthStore()

	useEffect(() => {

		authStore.init()
		const back = () => {
			if(routerStore.currentPage.page === null)
				return false
			routerStore.pop()
			return true
		}

		BackHandler.addEventListener('hardwareBackPress', back)
		return () => {
			BackHandler.removeEventListener('hardwareBackPress', back)
		}
	}, [])

	if(authStore.status === 'not-authorized')
		if(routerStore.currentPage !== 'register')
			return <LoginPage/>
		else
			return <RegisterPage/>

	if(authStore.status === 'authorized')
		return <ChatPage/>

	return <View><Text>Загрузка...</Text></View>
}

export default observer(AppPages)