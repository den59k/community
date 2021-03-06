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

	async consume(room_id: string, user_id: string, answer: any){
		const response = await axios.post(this.url+"/rooms/"+room_id+"/users/"+user_id+"/consume", { answer })
		return response.data
	}

	async getUsers(room_id: string){
		const response = await axios.get(this.url+"/rooms/"+room_id)
		return response.data
	}
}

export default MediaSoup