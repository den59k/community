import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { useRouterStore } from 'src/providers/router'
import { useWS } from 'src/providers/ws'
import { useModal } from '../../providers/modal'
import Layout from 'src/components/layout'

import Chat from './chat'
import ChatList from './chat-list'
import AddChat from './add-chat'
import CallPage from './call'
import IncomingCallModal from 'src/components/modal-windows/incoming-call'


function getComponent (page){
	if(page === 'add')
		return <AddChat/>

	return <ChatList/>
}

function ChatPage (){

	const routerStore = useRouterStore()
	const ws = useWS()
	const modal = useModal()

	useEffect(() => {
		ws.init()
		return () => ws.dispose()
	}, [])

	
	useEffect(() => {
		const call = ({ userData, roomData }) => {

			const onAccept = () => {
				console.log(userData)
				routerStore.push({ page: "call", room_id: roomData.room_id, user_id: userData.id, incoming: true })
			}
	
			const onReject = () => {
				console.log('reject')
			}	

			modal.open(<IncomingCallModal title={"Звонок от пользователя "+userData.login} onAccept={onAccept} onReject={onReject}/>)
		}
		ws.on('call', call)
		return () => ws.off('call', call)
	}, [])

	if(routerStore.currentPage.page === 'chat')
		return <Chat/>
	if(routerStore.currentPage.page === 'call')
		return <CallPage/>

	return (
		<Layout>
			{ getComponent(routerStore.currentPage.page)}
		</Layout>
	)
}

export default observer(ChatPage)

