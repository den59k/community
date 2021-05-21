import { useEffect, useRef, useState } from "react"
import { GET, REST } from "services"
import ModalWindow from ".."
import * as sdpTransform from 'sdp-transform'
import * as mediasoupClient from "mediasoup-client";
import { useWS } from "providers/ws";

import styles from './style.module.sass'
import { IoIosVideocam, IoMdMic } from 'react-icons/io'

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
	
	const videoRef = useRef()
	
	useEffect(() => {

		// const init2 = async () => {
			
		// 	const { room_id: _room_id, transportData, routerRtpCapabilities } = await REST("/calls/"+userData.id, { incoming, room_id })

		// 	const device = new mediasoupClient.Device();
		// 	await device.load({routerRtpCapabilities})

		// 	const transport = incoming?(
		// 		device.createRecvTransport( transportData )
		// 	): (
		// 		device.createSendTransport( transportData )
		// 	)

		// 	const url = "http://localhost:5000/rooms/"+_room_id+"/ts/"+transportData.id
		// 	transport.on("connect", async ({ dtlsParameters }, callback) => {
		// 		const res = await REST(url, { dtlsParameters }, 'POST', false)
		// 		callback()
		// 	})

		// 	if(!incoming){
		// 		//Если звонок исходящий
		// 		const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
		// 		videoRef.current.srcObject = stream
				
		// 		transport.on("produce", async (parameters, callback) => {
		// 			console.log(parameters)
		// 			const { kind, rtpParameters } = parameters
		// 			const data = await REST(url+"/produce", { kind, rtpParameters }, 'POST', false)
		// 			const { id } = data
		// 			callback({ id })
		// 		})

		// 		for(let track of stream.getTracks())
		// 			await transport.produce ({ track })
				
		// 	}else{
		// 		await delay(2000)
				
		// 		const consumersData = await REST(url+"/consume", {}, 'POST', false) 
		// 		console.log(consumersData)
		// 		const tracks = []
		// 		for(let consumer of consumersData){
		// 			const { track } = await transport.consume(consumer)
		// 			tracks.push(track)
		// 		}
		// 		videoRef.current.srcObject = new MediaStream(tracks)
		// 		await REST(url+"/resume", {}, 'POST', false)
		// 	}	
		// }

		const init3 = async () => {
			let _room_id = room_id

			if(!_room_id){
				const roomData = await REST("/calls", { user_id: userData.id })
				_room_id = roomData.room_id	
			}
			
			const { routerRtpCapabilities, id, consumeTransport } = await REST("/calls/"+_room_id, {})
			const device = new mediasoupClient.Device()
			await device.load({routerRtpCapabilities})
			const recvTransport = device.createRecvTransport(consumeTransport)
			
			const url = "http://localhost:5000/rooms/"+_room_id+"/users/"+id

			recvTransport.on("connect", async ({ dtlsParameters }, callback) => {
				const res = await REST(url, { dtlsParameters }, 'PUT', false)
				callback()
			})

			setConnection({ device, recvTransport, room_id: _room_id, user_id: id })
		}

		init3()
	}, [])

	const toggleVideo = async () => {
		const device = connection.device
		if(!connection.sendTransport){
			const url = "http://localhost:5000/rooms/"+connection.room_id+"/users/"+connection.user_id
			const { produceTransport } = await REST(url+"/produce")
			const sendTransport = device.createSendTransport(produceTransport)


		}
	}

	return (
		<ModalWindow title={incoming? `Звонок от пользователя ${userData.login}`: `Звонок пользователю ${userData.login}`}>
			<video autoPlay={true} muted={true} playsInline={true} ref={videoRef}></video>
			{connection.device && (
				<div className={styles.buttons}>
					<button onClick={toggleVideo}><IoIosVideocam/></button>
				</div>
			)}
		</ModalWindow>
	)
}

export default CallModalWindow