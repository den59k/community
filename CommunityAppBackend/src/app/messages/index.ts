import type { UserFastifyRequest, AppFastifyInstance } from "../../types/fastify"
import { userParamsSchema, messageSchema, confParamsSchema } from "./schema"

export default async function messages (fastify: AppFastifyInstance){

	fastify.addHook('onRequest', async (request: UserFastifyRequest, reply) => {
		if(!request.userData)
			return reply.code(401).send({error: { access_token: "wrong token" }})
	})

	fastify.get('/', async (request: UserFastifyRequest) => {
		const messages = await fastify.model.messagesModel.getConfs(request.userData.id)
		return messages
	})

	fastify.get('/users', async (request: UserFastifyRequest) => {
		const users = await fastify.model.usersModel.getAnotherUserList(request.userData.id)
		return users
	}) 

	fastify.get('/users/:user_id', { schema: userParamsSchema }, async (request: UserFastifyRequest, reply) => {
		const { user_id } = request.params as any
		const userData = await fastify.model.usersModel.getUserData(user_id)
		if(!userData) return reply.code(403).send({error: { user_id: "Не существует такого пользователя" } })

		const conf = await fastify.model.messagesModel.getConf(user_id, request.userData.id)
		if(!conf) return { userData, messages: [] }
		
		const messages = await fastify.model.messagesModel.getMessages(conf.id)

		await fastify.model.messagesModel.markMessageReaded(request.userData.id, conf.id)
		return { userData, messages }
	})

	//Отправка сообщения через ID пользователя
	fastify.post('/users/:user_id', { schema: {...userParamsSchema, ...messageSchema }}, async(request: UserFastifyRequest) => {
		const { user_id } = request.params as any
		const { text } = request.body as any
	
		let conf = await fastify.model.messagesModel.getConf(user_id, request.userData.id)
		if(!conf)
		conf = await fastify.model.messagesModel.createConf(user_id, request.userData.id)

		const messageData = await fastify.model.messagesModel.writeMessage(request.userData.id, conf.id, text)
		if(fastify.ws.isUserConnected(user_id)){
			const userData = await fastify.model.usersModel.getUserData(request.userData.id)
			fastify.ws.send(user_id, 'message', { ...messageData, login: userData.login } )
		}

		return messageData
	})

	fastify.post('/:conf_id', { schema: {...confParamsSchema, ...messageSchema}}, async(request: UserFastifyRequest, reply) => {
		const { conf_id } = request.params as any
		const { text } = request.body as any 

		const userInConf = await fastify.model.messagesModel.existUserInConf(request.userData.id, conf_id)
		if(!userInConf)
			return reply.code(403).send({error: { conf_id: "Пользователя нет в конференции" }})

		const message_id = await fastify.model.messagesModel.writeMessage(request.userData.id, conf_id, text)
		return { conf_id, message_id }
	})
}