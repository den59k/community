import React, { useEffect, useState } from 'react'
import { observer } from "mobx-react";
import CallLayout from "./call-layout";
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals
} from 'react-native-webrtc';
import { useRouterStore } from 'src/providers/router'
import { useWS } from 'src/providers/ws'
import { REST } from 'src/services'

function CallPage (){

	const [ stream, setStream ] = useState()
	const routerStore = useRouterStore()
	const ws = useWS()
	const [ connection, setConnection ] = useState({})
		
	useEffect(() => {

		const pc = new RTCPeerConnection()
		pc.onaddstream = (e) => {
			console.log(JSON.stringify(e.stream._tracks))
			setStream(e.stream.toURL())
		}

		const init = async () => {
			let _room_id = routerStore.currentPage.room_id

			if(!_room_id){
				const roomData = await REST("/calls", { user_id: routerStore.user_id })
				if(roomData.error) return console.log(roomData.error)
				_room_id = roomData.room_id	
			}

			const { offer } = await REST("/calls/"+_room_id, { user_id: ws.id })
			setConnection({ room_id: _room_id, user_id: ws.id, consumePc: pc })

			if(!offer) return
		}

		init()
	}, [])

	useEffect(() => {
		const onConsume = async ({ offer, consumers }) => {
			const pc = connection.consumePc
			await pc.setRemoteDescription(offer)
			const answer = await pc.createAnswer()
			
			await pc.setLocalDescription(answer)

			const status = await REST("/calls/"+connection.room_id+"/users/"+connection.user_id, { answer }, 'PUT')
			console.log(status)
		}

		ws.on("consume", onConsume)
		return () => {
			ws.off("consume", onConsume)
		}

	}, [ connection ])

	return (
		<CallLayout>
			{stream && <RTCView objectFit="cover" style={{flex: 1}} streamURL={stream}/>}
		</CallLayout>
	)
}

export default observer(CallPage)