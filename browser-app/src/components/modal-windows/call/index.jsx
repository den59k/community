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
	const sourceVideoRef = useRef()
	
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

		const pc = new RTCPeerConnection()
		pc.ontrack = (e) => {
			console.log(e)
			videoRef.current.srcObject = e.streams[0]
		}

		const init = async () => {
			let _room_id = room_id

			if(!_room_id){
				const roomData = await REST("/calls", { user_id: userData.id })
				if(roomData.error) return console.log(roomData.error)
				_room_id = roomData.room_id	
			}

			const { offer, transport, routerRtpCapabilities } = await REST("/calls/"+_room_id, { user_id: ws.id })

			// console.log(transport)

			// const device = new mediasoupClient.Device();
			// await device.load({routerRtpCapabilities})

			// const recvTransport = device.createRecvTransport(transport)

			// recvTransport.on("connect", async ({ dtlsParameters }, callback) => {
			// 	console.log(dtlsParameters)
			// 	const url = "http://localhost:5000/rooms/"+_room_id+"/users/"+ws.id+"/_consume"
			// 	const res = await REST(url, { dtlsParameters }, 'POST', false)
			// 	callback()
			// })
			
			setConnection({ room_id: _room_id, user_id: ws.id, consumePc: pc })

			if(!offer) return 

			await pc.setRemoteDescription(offer)
			const answer = await pc.createAnswer()
		}

		init()
		
	}, [])


	useEffect(() => {
		const onConsume = async ({ offer, consumers }) => {
			// console.log(consumers)
			// const tracks = []
			// for(let consumer of consumers){
			// 	const _consumer = await connection.recvTransport.consume(consumer)
			// 	console.log(_consumer)
				
			// 	tracks.push(_consumer.track)
			// }

			// videoRef.current.srcObject = new MediaStream(tracks);

			// const url = "http://localhost:5000/rooms/"+connection.room_id+"/users/"+connection.user_id+"/_consume"
			// await REST(url, {}, 'PUT', false)

			console.log(offer)

			const pc = connection.consumePc
			await pc.setRemoteDescription(offer)
			const answer = await pc.createAnswer()
			await pc.setLocalDescription(answer)
 
			console.log(answer)

			const status = await REST("/calls/"+connection.room_id+"/users/"+connection.user_id, { answer }, 'PUT')
			console.log(status)
		}

		ws.on("consume", onConsume)
		return () => {
			ws.off("consume", onConsume)
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