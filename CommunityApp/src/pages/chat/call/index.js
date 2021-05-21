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

function CallPage (){

	const [ stream, setStream ] = useState()

	useEffect(() => {
		let isFront = true;
		mediaDevices.enumerateDevices().then(sourceInfos => {
			
			let videoSourceId;
			for (let i = 0; i < sourceInfos.length; i++) {
				const sourceInfo = sourceInfos[i];
				if(sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
					videoSourceId = sourceInfo.deviceId;
					console.log(sourceInfo)
				}
			}
			mediaDevices.getUserMedia({
				audio: true,
				video: {
					frameRate: 30,
					facingMode: (isFront ? "user" : "environment"),
					deviceId: videoSourceId
				}
			})
			.then(stream => {
				setStream(stream.toURL())
			})
			.catch(error => {
				console.log(error)
				// Log error
			});
		});
	}, [])
	console.log(stream)
	return (
		<CallLayout>
			{stream && <RTCView objectFit="cover" style={{flex: 1}} streamURL={stream}/>}
		</CallLayout>
	)
}

export default observer(CallPage)