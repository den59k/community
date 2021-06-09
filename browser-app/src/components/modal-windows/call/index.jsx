import { useEffect, useRef, useState } from "react"
import { GET, REST } from "services"
import ModalWindow from ".."
import * as sdpTransform from 'sdp-transform'
import * as mediasoupClient from "mediasoup-client";
import { useWS } from "providers/ws";

import styles from './style.module.sass'
import { IoIosVideocam, IoMdMic } from 'react-icons/io'
import { useModal } from "providers/modal-window";

const delay = (seconds) => new Promise(res => setTimeout(res, seconds))

const getIceCandidates = (pc) => new Promise(_res => {
	const candidates = []

	let resolved = false
	const res = (args) => {
		if(resolved) return
		resolved = true
		_res(args)
	}

	setTimeout(() => res(candidates), 500)
	pc.onicecandidate = e => {
		if(e.candidate === null) return res(candidates)
		
		candidates.push(e.candidate)
	}
})

function CallModalWindow ({ userData, incoming, room_id }){
	
	const [ stream, setStream ] = useState()
	const [ connection, setConnection ] = useState({})

	const ws = useWS()
	const modal = useModal()

	const videoRef = useRef()
	const sourceVideoRef = useRef()
	
	useEffect(() => {

		const pc = new RTCPeerConnection()
		pc.ontrack = (e) => {
			console.log(e)
			videoRef.current.srcObject = e.streams[0]
		}

		const connect = async (offer) => {
			if(!offer) return
		}

		const init = async () => {
			
			if(!room_id){
				const { roomData, connectionData } = await REST("/calls", { callee: userData.id, user_id: ws.id })
				
				const { offer } = connectionData

				setConnection({ room_id: roomData.room_id, user_id: ws.id, consumePc: pc })
				connect(offer)
			}else{
				const { offer } = await REST("/calls/"+room_id, { user_id: ws.id })
			
				setConnection({ room_id, user_id: ws.id, consumePc: pc })
				connect(offer)
			}
		}

		init()
		
	}, [])


	useEffect(() => {
		const onConsume = async ({ offer, consumers }) => {
			console.log(consumers)
			console.log(offer)
			const pc = connection.consumePc
			await pc.setRemoteDescription(offer)
			const answer = await pc.createAnswer()
			await pc.setLocalDescription(answer)
 
			console.log(answer)

			const status = await REST("/calls/"+connection.room_id+"/users/"+connection.user_id, { answer }, 'PUT')
			console.log(status)
		}

		const onReject = ({ room_id }) => {
			if(room_id === connection.room_id)
				modal.close()
		}

		ws.on("consume", onConsume)
		ws.on("reject-call", onReject)
		
		return () => {
			ws.off("consume", onConsume)
			ws.off("reject-call", onReject)
		}
	}, [ connection ])

	const toggleVideo = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});

		if(!stream) return console.error("Веб-камера недоступна")

		const pc = new RTCPeerConnection()
		for(let track of stream.getTracks())
			pc.addTrack(track)

		const offer = await pc.createOffer()
		await pc.setLocalDescription(offer)
		console.log(offer)

		const { answer } = await REST("/calls/"+connection.room_id+"/users/"+connection.user_id+"/produce", { offer })

		await pc.setRemoteDescription(answer)
		console.log(answer)
		
		sourceVideoRef.current.srcObject = stream
	}

	return (
		<ModalWindow title={incoming? `Звонок от пользователя ${userData.login}`: `Звонок пользователю ${userData.login}`}>
			<video className={styles.source} autoPlay={true} muted={true} playsInline={true} ref={sourceVideoRef}></video>
			<video autoPlay={true} muted={true} playsInline={true} ref={videoRef}></video>
			{(
				<div className={styles.buttons}>
					<button onClick={toggleVideo}><IoIosVideocam/></button>
				</div>
			)}
		</ModalWindow>
	)
}

export default CallModalWindow