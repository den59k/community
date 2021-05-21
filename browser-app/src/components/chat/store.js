import { makeAutoObservable, runInAction } from "mobx";
import { GET, REST } from 'services'

class ChatStore {

	userData = null
	status = 'loading'
	messages = []
	toDown = false

	constructor(){
		makeAutoObservable(this)
	}

	setToDown(a){
		this.toDown = a
	}

	async send(text){
	
		const { error, message_id, user_id, conf_id } = await REST('/messages/users/'+this.userData.id, { text })
		if(error) return error
		runInAction(() => {
			this.messages.unshift({ message_id, conf_id, text, timestep: Date.now(), user_id })
			this.toDown = true
		})
	}

	recieveMessage(message){
		this.messages.unshift(message)
	}

	async init(user_id){
		this.status = 'loading'
		const { userData, messages, error } = await GET('/messages/users/'+user_id)
		if(error) return console.log(error)
		
		runInAction(() => {	
			this.messages = messages
			this.userData = userData
			this.status = 'success'
			this.toDown = true
		})
	}

}

export default ChatStore