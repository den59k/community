import { useEffect, useState } from 'react'

import styles from './style.module.sass'
import { MdSend, MdCall } from 'react-icons/md'
import { useModal } from 'providers/modal-window'
import CallModalWindow from 'components/modal-windows/call'

function ChatInput ({chatStore}){

	const modal = useModal()
	const [ text, setText ] = useState("")
	const [ rows, setRows ] = useState(1)

	useEffect(() => {
		const count = Math.min((text.match(/\n/g) || []).length + 1, 10)
		setRows(count)
	}, [text])

	const onSubmit = () => {
		chatStore.send(text).then(err => {
			if(!err) setText("")
		})
	}

	const keyDown = (e) => {
		if(e.code === 'Enter' && !e.shiftKey){
			e.preventDefault()
			onSubmit()
		} 
	}

	const call = () => {
		modal.open(<CallModalWindow userData={chatStore.userData} incoming={false}/>)
	}

	return (
		<div className={styles.input}>
			<button onClick={call}>
				<MdCall/>
			</button>
			<textarea 
				rows = {rows}
				className={styles.text} 
				value={text} 
				onChange={(e) => setText(e.target.value)} 
				placeholder="Введите ваше сообщение..."
				onKeyDown={keyDown}
			/>
			<button onClick={onSubmit}>
				<MdSend/>
			</button>
		</div>
	)

}

export default ChatInput