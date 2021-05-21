import { types } from 'mediasoup'

const transportOptions = {
	listenIps : [ { ip: "0.0.0.0", announcedIp: "192.168.0.100" } ],
	enableUdp : true,
	enableTcp : true,
	preferUdp : true
}

class User {

	id: string
	produceTransport: types.WebRtcTransport
	consumeTransport: types.WebRtcTransport
	producers: types.Producer[]
	consumers: types.Consumer[]

	async init(router: types.Router){
		this.consumeTransport = await router.createWebRtcTransport(transportOptions)
		this.consumeTransport.on("icestatechange", state => console.log("receiver ICE state changed to "+state))
		const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } = this.consumeTransport
		this.id = id

		return {
			id: this.id,
			consumeTransport: { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters }
		}
	}

	async confirmConsumeTransport ({dtlsParameters}){
		await this.consumeTransport.connect({ dtlsParameters })
	}

	async confirmProduceTransport ({dtlsParameters}){
		await this.produceTransport.connect({dtlsParameters})
	}

	async createProduceTransport (router: types.Router){
		this.produceTransport = await router.createWebRtcTransport(transportOptions)
		this.consumeTransport.on("icestatechange", state => console.log("sender ICE state changed to "+state))
		const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } = this.consumeTransport

		return {
			produceTransport: { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters }
		}
	}

}

export default User