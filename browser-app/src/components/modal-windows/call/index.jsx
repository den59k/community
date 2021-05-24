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
			//videoRef.current.srcObject = e.streams[0]
		}

		const init = async () => {
			let _room_id = room_id

			if(!_room_id){
				const roomData = await REST("/calls", { user_id: userData.id })
				if(roomData.error) return console.log(roomData.error)
				_room_id = roomData.room_id	
			}

			const { offer, transport, routerRtpCapabilities } = await REST("/calls/"+_room_id, { user_id: ws.id })

			const device = new mediasoupClient.Device();
			await device.load({routerRtpCapabilities})

			const recvTransport = device.createRecvTransport(transport)

			recvTransport.on("connect", async ({ dtlsParameters }, callback) => {
				const url = "http://localhost:5000/rooms/"+_room_id+"/users/"+ws.id+"/_consume"
				const res = await REST(url, { dtlsParameters }, 'POST', false)
				callback()
			})
			
			setConnection({ room_id: _room_id, user_id: ws.id, consumePc: pc, recvTransport })

			if(!offer) return 

			await pc.setRemoteDescription(offer)
			const answer = await pc.createAnswer()
		}

		init()

		console.log(sdpTransform.parse(`
		type: offer, sdp: v=0
o=mediasoup-client 10000 2 IN IP4 0.0.0.0
s=-
t=0 0
a=ice-lite
a=fingerprint:sha-512 51:07:B6:4E:B2:A3:D8:1D:87:97:83:C2:3E:BD:71:1B:D6:D2:16:BF:F5:E7:FE:89:EC:5B:05:E3:6B:76:99:02:61:3A:B9:58:39:FC:25:DB:A0:FD:2A:31:3C:45:6E:09:8F:75:06:CB:64:27:53:22:01:77:4E:BC:6A:56:E3:9E
a=msid-semantic: WMS *
a=group:BUNDLE 0 1
m=audio 7 UDP/TLS/RTP/SAVPF 100
c=IN IP4 127.0.0.1
a=rtpmap:100 opus/48000/2
a=fmtp:100 maxplaybackrate=48000;stereo=1;useinbandfec=1
a=extmap:1 urn:ietf:params:rtp-hdrext:sdes:mid
a=extmap:4 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
a=extmap:10 urn:ietf:params:rtp-hdrext:ssrc-audio-level
a=setup:actpass
a=mid:0
a=msid:{099fc326-57ea-4f1a-bbe5-ee1edf2ae9f7} bfcd00c3-4739-4170-bc69-95b0c84960a7
a=sendonly
a=ice-ufrag:z6l78u4yd234v7fq
a=ice-pwd:d4v5e4mo341a55hwq5cu3dj9kxaryu6x
a=candidate:udpcandidate 1 udp 1076558079 192.168.0.100 56433 typ host
a=candidate:tcpcandidate 1 tcp 1076302079 192.168.0.100 47068 typ host tcptype passive
a=end-of-candidates
a=ice-options:renomination
a=ssrc:939503186 cname:{099fc326-57ea-4f1a-bbe5-ee1edf2ae9f7}
a=rtcp-mux
a=rtcp-rsize
m=video 7 UDP/TLS/RTP/SAVPF 101 102
c=IN IP4 127.0.0.1
a=rtpmap:101 VP8/90000
a=rtpmap:102 rtx/90000
a=fmtp:101 profile-level-id=42;level-asymmetry-allowed=1;packetization-mode=1
a=fmtp:102 apt=101
a=rtcp-fb:101 nack 
a=rtcp-fb:101 nack pli
a=rtcp-fb:101 ccm fir
a=rtcp-fb:101 transport-cc 
a=extmap:1 urn:ietf:params:rtp-hdrext:sdes:mid
a=extmap:4 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
a=extmap:5 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01
a=extmap:6 http://tools.ietf.org/html/draft-ietf-avtext-framemarking-07
a=extmap:7 urn:ietf:params:rtp-hdrext:framemarking
a=extmap:11 urn:3gpp:video-orientation
a=extmap:12 urn:ietf:params:rtp-hdrext:toffset
a=setup:actpass
a=mid:1
a=msid:{099fc326-57ea-4f1a-bbe5-ee1edf2ae9f7} 1b6ef047-cdf1-47be-b0fb-0f9c87447bf1
a=sendonly
a=ice-ufrag:z6l78u4yd234v7fq
a=ice-pwd:d4v5e4mo341a55hwq5cu3dj9kxaryu6x
a=candidate:udpcandidate 1 udp 1076558079 192.168.0.100 56433 typ host
a=candidate:tcpcandidate 1 tcp 1076302079 192.168.0.100 47068 typ host tcptype passive
a=end-of-candidates
a=ice-options:renomination
a=ssrc:665943757 cname:{099fc326-57ea-4f1a-bbe5-ee1edf2ae9f7}
a=ssrc:665943758 cname:{099fc326-57ea-4f1a-bbe5-ee1edf2ae9f7}
a=ssrc-group:FID 665943757 665943758
a=rtcp-mux
a=rtcp-rsize`))
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