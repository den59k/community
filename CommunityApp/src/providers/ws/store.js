import { wsURL } from 'src/constants'
import { makeObservable, observable } from "mobx";
import { getAccessToken } from 'src/services'
import EventEmitter from 'events'

class RouterStore {

	status = 'not-connected'

	constructor(){
		makeObservable(this, {
			status: observable
		})
		this.emitter = new EventEmitter()
		this.on('handshake', ({error, id}) => {
			if(error) return console.log(error)
			this.setId(id)
		})
	}

	setId(id){
		this.id = id
	}

	send(type, message){
		if(!this.status) return console.log("Socket is not connected")
		this.socket.send(JSON.stringify({ type, message }))
	}

	onOpen(){
		this.status = 'connected'
		console.log('WebSocket connected!')
		const accessToken = getAccessToken()
		this.send('handshake', { accessToken })
		if(this.reconectInterval) clearInterval(this.reconectInterval)

		this.socket.addEventListener('message', (e) => {
			const { type, message } = JSON.parse(e.data)
			this.emitter.emit(type, message)
		})
	}

	on(type, callback){
		this.emitter.on(type, callback)
		return callback
	}

	off(type, callback){
		this.emitter.off(type, callback)
	}

	onClose(){
		if(this.status === 'closed') return
		this.status = 'lost-connection'
		if(!this.reconectInterval)
			this.reconectInterval = setInterval(() => this.init(), 5000)
	}

	init(){
		this.socket = new WebSocket(wsURL);
		console.log('Try connect to websocket...')
		this.socket.addEventListener('open', () => this.onOpen())
		this.socket.addEventListener('close', () => this.onClose())
	}

	dispose(){
		this.status = 'closed'
		this.socket.close(1000)
	}

}

export default RouterStore