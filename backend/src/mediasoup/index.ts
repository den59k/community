import axios from 'axios'

class MediaSoup {

	url = 'http://localhost:5000'

	async createRoom (){
		const response = await axios.post(this.url+'/rooms', {})
		return response.data
	}

	async addUser(room_id: string, user_id: string){
		const response = await axios.post(this.url+'/rooms/'+room_id+'/users/'+user_id, {})
		return response.data	
	}

	async produce(room_id: string, user_id: string, offer: any){
		const response = await axios.post(this.url+"/rooms/"+room_id+"/users/"+user_id+"/produce", { offer })
		return response.data
	}




	async createTransport (room_id: string, options: any){
		const response = await axios.post(this.url+'/rooms/'+room_id+'/ts', options)
		return response.data
	}
		
	async createReceiveTransport(room_id: string){
		const response = await axios.post(this.url+'/create-transport/'+room_id, { incoming: true })
		return response.data
	}

	async createSendTransport(room_id: string){
		const response = await axios.post(this.url+'/create-transport/'+room_id, { incoming: false })
		return response.data
	}

	async confirmTransport (room_id: string, data: any){
		const response = await axios.post(this.url+'/confirm/'+room_id, data)
		return response.data
	}
}

export default MediaSoup