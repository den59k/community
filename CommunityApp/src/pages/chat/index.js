import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { useRouterStore } from 'src/providers/router'
import { useWS } from 'src/providers/ws'
import Layout from 'src/components/layout'

import Chat from './chat'
import ChatList from './chat-list'
import AddChat from './add-chat'

function getComponent (page){
	if(page === 'add')
		return <AddChat/>

	return <ChatList/>
}

function ChatPage (){

	const routerStore = useRouterStore()
	const ws = useWS()

	useEffect(() => {
		ws.init()
		return () => ws.dispose()
	}, [])

	if(routerStore.currentPage.page === 'chat')
		return <Chat/>

	return (
		<Layout>
			{ getComponent(routerStore.currentPage.page)}
		</Layout>
	)
}

export default observer(ChatPage)

