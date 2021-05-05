import Model from "../model"
import WS from '../ws'
import userPlugin from './plugins/user' 

import auth from './auth'
import messages from './messages'
import { AppFastifyInstance } from "../types/fastify"



//Здесь осуществляются все привязки к моделям, а также к остальным роутам
export default async function app (fastify: AppFastifyInstance){
	
	const model = new Model()
	await model.init() 
	fastify.decorate('model', model)

	const ws = new WS(fastify)
	fastify.decorate('ws', ws)

	//Вот здесь проводится аутентификация токена
	fastify.register(userPlugin)

	fastify.register(auth, { prefix: "auth" })
	fastify.register(messages, { prefix: "messages"})

	fastify.get('/', async () => {
		return { word: "Hello world!" }
	})

	fastify.get('/info', async () => {
		const object = {}
		for(let [ key, value ] of fastify.ws.connections)
			object[key] = value.size
			
		return object
	})

	fastify.setErrorHandler(function (error, _request, reply) {
		console.log(error)
		reply.status(500).send({ error: 'Ошибка сервера' })
	})
	
}