import { observer } from "mobx-react";
import { useRouter } from "providers/router";
import { useEffect, useState } from "react";
import cn from 'classnames'
import ChatStore from './store'
import { time } from "statics/months";

import styles from './style.module.sass'
import { toJS } from "mobx";
import ChatInput from './input'
import { useAuth } from "providers/auth";
import { useWS } from "providers/ws";

function Message ({ my, data, lastData }){
	
	const hideHeader = (lastData && lastData.user_id === data.user_id && data.timestep < lastData.timestep + 5 * 60 * 1000)

	return (
		<div className={cn(styles.message, my && styles.my)}>
			<div className={cn(styles.messageHeader, hideHeader && styles.hide)}>
				<div className={styles.name}>{my?"Вы": data.login}</div>
				<div>{time(data.timestep)}</div>
			</div>
			<div className={styles.content}>
				{data.text}
			</div>
		</div>
	)
}

function Chat (){

	const router = useRouter()
	const authStore = useAuth()
	const ws = useWS()
	const [ chatStore ] = useState(() => new ChatStore())
	const user_id = router.get(1)
	
	useEffect(() => {
		const onMessage = (message) => 	chatStore.recieveMessage(message)

		ws.on('message', onMessage)
		return () => ws.off('message', onMessage)
		
	}, [ chatStore, ws ])

	useEffect(() => {
		if(user_id) chatStore.init(user_id)
	}, [user_id])

	if(router.get(0) !== 'im' || !user_id){
		return <div className={styles.chat}>Выберите чат слева</div>
	}
	
	return (
		<div className={styles.container}>
			<div className={styles.messages}>
				{chatStore.messages.map((message, index) => (
					<Message 
						my={authStore.userData.id === message.user_id}
						key={message.message_id} 
						data={message} 
						lastData={index < chatStore.messages.length-1 && chatStore.messages[index+1]}
					/>
				))}
			</div>
			<ChatInput chatStore={chatStore}/>
		</div>
	)
}

export default observer(Chat)