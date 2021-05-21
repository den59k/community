import Model from "../model"
import WS from '../ws'
import MediaSoup from "../mediasoup"
import userPlugin from './plugins/user' 

import auth from './auth'
import messages from './messages'
import { AppFastifyInstance } from "../types/fastify"
import calls from "./call"

//Здесь осуществляются все привязки к моделям, а также к остальным роутам
export default async function app (fastify: AppFastifyInstance){
	
	const model = new Model()
	await model.init() 
	fastify.decorate('model', model)

	const ws = new WS(fastify)
	fastify.decorate('ws', ws)

	const mediaSoup = new MediaSoup()
	fastify.decorate('mediaSoup', mediaSoup)

	//Вот здесь проводится аутентификация токена
	fastify.register(userPlugin)

	fastify.register(auth, { prefix: "auth" })
	fastify.register(messages, { prefix: "messages"})
	fastify.register(calls, { prefix: "calls" })

	fastify.get('/', async () => {
		return { word: "Hello world!" }
	})

	fastify.get('/info', async () => {
		const object = {}
		for(let [ key, value ] of fastify.ws.connections)
			object[key] = value.size
		object["dbData"] = { 
			totalCount: fastify.model.db.totalCount, 
			idleCount: fastify.model.db.idleCount,
			waitingCount: fastify.model.db.waitingCount
		}
		return object
	})

	fastify.setErrorHandler(function (error, _request, reply) {
		console.log(error)
		reply.status(500).send({ error: 'Ошибка сервера' })
	})
	
}