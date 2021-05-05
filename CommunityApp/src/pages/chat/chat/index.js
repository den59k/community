import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { View, Text } from 'react-native'
import ChatStore from './store'
import { useRouterStore } from 'src/providers/router'
import { useWS } from 'src/providers/ws'

import ChatLayout from './chat-layout'
import ChatInput from './chat-input'
import MessageList from './message-list'

function Chat (){
	
	const routerStore = useRouterStore()
	const ws = useWS()
	const [ chatStore ] = useState(() => new ChatStore())

	const user_id = routerStore.currentPage.user_id
	useEffect(() => {
		chatStore.init(user_id)

		const onMessage = (message) => 	chatStore.recieveMessage(message)

		ws.on('message', onMessage)
		return () => ws.off('message', onMessage)
	}, [user_id, chatStore])

	return (
		<ChatLayout chatStore={chatStore}>
			<MessageList chatStore={chatStore}/>
			<ChatInput chatStore={chatStore}/>
		</ChatLayout>
	)
}

export default observer(Chat)