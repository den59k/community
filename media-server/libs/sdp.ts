import { types } from 'mediasoup'
import sdpTransform, { MediaAttributes } from 'sdp-transform'
import { MediaDescription } from 'sdp-transform'

interface Description extends MediaDescription {
	type: string;
	port: number;
	protocol: string;
	payloads?: string;
}

function getRTCPFeedback (codecs: types.RtpCodecParameters[]){
	const arr = []
	for(let codec of codecs){
		arr.push(...codec.rtcpFeedback.map(rtcp => ({
			payload: codec.payloadType,
			type: rtcp.type,
			subtype: rtcp.parameter
		})))
	}

	return arr
}

function producerToMedia(transport: types.WebRtcTransport, producer: types.Producer | types.Consumer): Description {
	return ({
			rtp: producer.rtpParameters.codecs.map(codec => ({
				payload: codec.payloadType,
				codec: codec.mimeType.split("/")[1],
				rate: codec.clockRate,
				encoding: codec.channels
			})),
			fmtp: producer.rtpParameters.codecs.map(codec => ({
				payload: codec.payloadType,
				config: codec.parameters.length > 0?codec.parameters.map(param => param.type+"="+param.parameter).join(";"): ''
			})).filter(item => item.config !== ''),
			type: producer.kind,
			port: 9,
			protocol: 'UDP/TLS/RTP/SAVPF',
			payloads: producer.rtpParameters.codecs.map(codec => codec.payloadType).join(" "),
			connection: { version: 4, ip: '0.0.0.0' },
			ext: [],
			iceUfrag: transport.iceParameters.usernameFragment,
			icePwd: transport.iceParameters.password,
			mid: producer.rtpParameters.mid,
			setup: transport.dtlsParameters.role === 'client'? 'active': 'actpass',
			direction: 'recvonly',
			rtcpMux: 'rtcp-mux',
			rtcpFb: getRTCPFeedback(producer.rtpParameters.codecs),
			ssrcs: [
				{
					id: producer.rtpParameters.encodings[0].ssrc,
					attribute: "cname",
					value: producer.rtpParameters.rtcp.cname
				}
			],
			candidates: transport.iceCandidates.map(candidate => ({
				foundation: candidate.foundation,
				component: 1,
				transport: candidate.protocol,
				priority: candidate.priority,
				ip: candidate.ip,
				port: candidate.port,
				type: candidate.type,
				tcptype: candidate.tcpType,
			})),
			endOfCandidates: "end-of-candidates",
			
		}) 
}

export function generateOffer (transport: types.WebRtcTransport, consumers: types.Consumer[]){
	
	return sdpTransform.write({
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
		groups: [ { type: 'BUNDLE', mids: consumers.map((_, index) => index).join(' ')  } ],
		fingerprint:{
			type: transport.dtlsParameters.fingerprints[0].algorithm,
			hash: transport.dtlsParameters.fingerprints[0].value
		},
		setup: transport.dtlsParameters.role === 'client'? 'active': 'actpass',
		iceOptions: 'renomination',
		icelite: 'ice-lite',
		msidSemantic: { semantic: 'WMS', token: '*' },
		direction: "sendonly",
		media: consumers.map(consumer => producerToMedia(transport, consumer)),
	})

}


export function generateAnswer (transport: types.WebRtcTransport, producers: types.Producer[]){
	return sdpTransform.write({
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
		groups: [ { type: 'BUNDLE', mids: producers.map((_, index) => index).join(' ')  } ],
		fingerprint:{
			type: transport.dtlsParameters.fingerprints[0].algorithm,
			hash: transport.dtlsParameters.fingerprints[0].value
		},
		setup: transport.dtlsParameters.role === 'client'? 'active': 'actpass',
		iceOptions: 'renomination',
		icelite: 'ice-lite',
		msidSemantic: { semantic: 'WMS', token: '*' },
		direction: "recvonly",
		media: producers.map(producer => producerToMedia(transport, producer)),
	})
}