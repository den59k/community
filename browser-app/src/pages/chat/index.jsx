import Layout from 'components/layout'

import styles from './style.module.sass'

import ListMessages from './list-messages'
import Chat from 'components/chat'
import { useWS } from 'providers/ws'
import { useEffect } from 'react'
import { useModal } from 'providers/modal-window'
import CallModalWindow from 'components/modal-windows/call'

function ChatPage (){

	const ws = useWS()
	const modal = useModal()

	useEffect(() => {
		const call = ({ userData, room_id }) => {
			modal.open(<CallModalWindow userData={userData} incoming={true} room_id={room_id}/>)
		}
		ws.on('call', call)
		return () => ws.off('call', call)
	}, [ ws, modal ])

	return (
		<Layout className={styles.container}>
			<ListMessages/>
			<Chat/>
			
		</Layout>
	)
}

export default ChatPage