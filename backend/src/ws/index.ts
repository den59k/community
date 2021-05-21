import WebSocket from 'ws'
import { AppFastifyInstance } from '../types/fastify'

function send(ws: WebSocket, type: string, message: any){
	ws.send(JSON.stringify({ type, message }))
}	

function pong(){
	this.isAlive  = true
}

class WS {	
	
	fastify: AppFastifyInstance
	connections: Map<number, Set<WebSocket>>
	
	constructor(fastify: AppFastifyInstance){
		this.fastify = fastify
		this.connections = new Map()
		const wss = new WebSocket.Server({ server: fastify.server })
		
		wss.on('listening', () => {
			console.log("WebSocket server listening")
		})

		wss.on('connection', ws => {
			ws['isAlive'] = true
			ws.on('pong', pong)
			ws.on('message', message => {
				this.recieveMessage(message.toString(), ws)
			})
		})

		const interval = setInterval(function ping() {
			for(let ws of wss.clients){
				if(ws['isAlive'] === false) return ws.terminate()
				ws['isAlive'] = false
				ws.ping()
			}
		}, 30000);
		
		wss.on('close', () => clearInterval(interval))
	}

	addConnection(user_id: number, ws: WebSocket){

		let set = this.connections.get(user_id)

		if(!set){
			set = new Set()
			this.connections.set(user_id, set)
		}
		
		set.add(ws)
		ws.on('close', () => {
			set.delete(ws)
			if(set.size === 0) this.connections.delete(user_id)
		})
	}

	send(user_id: number, type: string, message: any){
		let set = this.connections.get(user_id)
		if(!set) return "user is not connected"
		for(let ws of set.values())
			send(ws, type, message)
	}
	
	isUserConnected(user_id: number){
		return this.connections.has(user_id)
	}

	recieveMessage (json: string, ws: WebSocket) {
		const { type, message } = JSON.parse(json)
		if(type === 'handshake'){
			this.fastify.model.tokensModel.decodeJWT(message.accessToken).then((userData) => {
				if(!userData) return send(ws, 'error', { accessToken: "wrongToken" })
				this.addConnection(userData.id, ws)
				send(ws, 'handshake', { success: "success-connected!" } )
			})
		}
	}

}

export default WS