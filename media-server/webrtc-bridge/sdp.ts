import { types } from 'mediasoup'
import * as sdpTransform from 'sdp-transform';
import * as crypto from 'crypto'

interface options {
	transport: types.WebRtcTransport , 
	mediaCodecs: any[],
	incoming: boolean,
	producers?: types.Producer[]
}

const getMedia = ({ pwd, ufrag }) => [
	{
		rtp: [  
			{ payload: 109, codec: 'opus', rate: 48000, encoding: 2 },
			{ payload: 111, codec: 'opus', rate: 48000, encoding: 2 } 
		],
		fmtp: [ 
			{ payload: 109, config: 'minptime=10;useinbandfec=1' } ,
			{ payload: 111, config: 'minptime=10;useinbandfec=1' } 
		],
		type: 'audio',
		port: 9,
		protocol: 'UDP/TLS/RTP/SAVPF',
		payloads: '109 111',
		connection: { version: 4, ip: '0.0.0.0' },
		ext: [],
		icePwd: pwd,
		iceUfrag: ufrag,
		mid: '0',
		setup: 'active',
		direction: 'recvonly',
		rtcpMux: 'rtcp-mux',
	},
	{
		rtp: [  
			{ payload: 120, codec: 'VP8', rate: 90000 },
			{ payload: 96, codec: 'VP8', rate: 90000 } 
		],
		fmtp: [ ],
		type: 'video',
		port: 9,
		protocol: 'UDP/TLS/RTP/SAVPF',
		payloads: '96 120',
		connection: { version: 4, ip: '0.0.0.0' },
		ext: [],
		icePwd: pwd,
		iceUfrag: ufrag,
		setup: 'active',
		mid: '1',
		rtcpFb: [ 
			{ payload: 120, type: 'nack' },
			{ payload: 120, type: 'nack', subtype: 'pli' },
			{ payload: 120, type: 'ccm', subtype: 'fir' },
			{ payload: 120, type: 'goog-remb' },
			{ payload: 96, type: 'nack' },
			{ payload: 96, type: 'nack', subtype: 'pli' },
			{ payload: 96, type: 'ccm', subtype: 'fir' },
			{ payload: 96, type: 'goog-remb' } 
		],
		direction: 'recvonly',
		rtcpMux: 'rtcp-mux',
	},
]


const getCurrentMedia = ({ pwd, ufrag, producers }) => {
	return producers.map((producer: types.Producer, index: number) => ({
		rtp: [{ 
			payload: producer.rtpParameters.codecs[0].payloadType,
			codec: producer.rtpParameters.codecs[0].mimeType.split("/")[1],
			rate: producer.rtpParameters.codecs[0].clockRate,
			encoding: producer.rtpParameters.codecs[0].channels
		}],
		fmtp: producer.kind === 'audio'? [ 
			{ payload: producer.rtpParameters.codecs[0].payloadType, config: 'minptime=10;useinbandfec=1' } ,
		]: [

		],
		type: producer.kind,
		port: 9,
		protocol: 'UDP/TLS/RTP/SAVPF',
		payloads: producer.rtpParameters.codecs[0].payloadType.toString(),
		connection: { version: 4, ip: '0.0.0.0' },
		ext: [],
		icePwd: pwd,
		iceUfrag: ufrag,
		mid: index.toString(),
		setup: 'active',
		
		rtcpFb: producer.rtpParameters.codecs[0].rtcpFeedback.map(item => ({
			payload: producer.rtpParameters.codecs[0].payloadType,
			type: item.type,
			subtype: item.parameter
		})),
		direction: 'sendonly',
		rtcpMux: 'rtcp-mux',
		ssrcs: [
			{
				id: producer.rtpParameters.encodings[0].ssrc,
				attribute: "cname",
				value: producer.rtpParameters.rtcp.cname
			}
		]
	}))
}

export function getSDP ( { transport, mediaCodecs, incoming, producers }: options ){

	const fingerprint = transport.dtlsParameters.fingerprints.find(item => item.algorithm === 'sha-256')
	const ice = transport.iceParameters

	const pwd = ice.password
	const ufrag = ice.usernameFragment

	const candidates = transport.iceCandidates.map(candidate => {
		const { foundation, protocol, priority, ip, port, type, tcpType } = candidate
		return {
			candidate: `candidate:${foundation} 1 ${protocol} ${priority} ${ip} ${port}` +
			` typ ${type} ${tcpType?('tcptype'+tcpType): ''} ufrag ${ufrag}`,
			sdpMid: 0,
			sdpMLineIndex: 0,
			usernameFragment: ufrag
		}
	})

	if(!incoming)
		console.log(`GET ${producers.length} PRODUCERS`)

	const ssrcVideo = crypto.randomBytes(4).readUInt32BE(0);
	const ssrcAudio = crypto.randomBytes(4).readUInt32BE(0);

	const sdp: sdpTransform.SessionDescription = {
		version: 0,
		origin: {
			username: 'den',
			sessionId: '3497579305088229251',
			sessionVersion: 2,
			netType: 'IN',
			ipVer: 4,
			address: '127.0.0.1',
		},
		name: '-',
		timing: { start: 0, stop: 0 },
		groups: [ { type: 'BUNDLE', mids: incoming? '0 1': producers.map((_, index) => index).join(' ')  } ],
		fingerprint:{
			type: 'sha-256',
			hash: fingerprint.value
		},

		iceOptions: 'trickle',
		msidSemantic: { semantic: 'WMS', token: '*' },
		media: incoming? getMedia({ ufrag, pwd }): getCurrentMedia({ ufrag, pwd, producers })
	}
	

	return {
		id: transport.id,
		candidates,
		answer: { 
			sdp: sdpTransform.write(sdp),
			type: "answer"
		}
	}
}