import type { UserFastifyRequest, AppFastifyInstance } from "../../types/fastify"
import { callSchema, roomParamsSchema, userParamsSchema, transportSchema } from './schema'

export default async function calls (fastify: AppFastifyInstance){

	fastify.addHook('onRequest', async (request: UserFastifyRequest, reply) => {
		if(!request.userData)
			return reply.code(401).send({error: { access_token: "wrong token" }})
	})

	fastify.post("/", { schema: callSchema }, async (request: UserFastifyRequest) => {
		const { user_id } = request.body as any
		const userData = await fastify.model.usersModel.getUserData(request.userData.id) 
		console.log(user_id)
		if(!fastify.ws.connections.has(user_id)) return { error: { user_id: "Пользователь не в сети" }}
		
		const roomData = await fastify.mediaSoup.createRoom()

		fastify.ws.send(user_id, "call", { roomData, userData });

		return roomData
	})

	fastify.post("/:room_id", { schema: roomParamsSchema }, async (request: UserFastifyRequest) => {
		const { room_id } = request.params as any
		const { user_id } = request.body as any
			
		const userData = await fastify.mediaSoup.addUser(room_id, user_id)
		fastify.ws.send(user_id, "call", { userData, room_id })

		return userData
	})

	fastify.put("/:room_id/users/:user_id", { schema: userParamsSchema }, async (request: UserFastifyRequest) => {
		const { room_id, user_id } = request.params as any
		const { answer } = request.body as any 

		const status = await fastify.mediaSoup.consume(room_id, user_id, answer)
		return status
	})

	fastify.post("/:room_id/users/:user_id/produce", { schema: userParamsSchema }, async (request: UserFastifyRequest) => {
		const { room_id, user_id } = request.params as any
		const { offer } = request.body as any
		console.log(room_id)
		const { answer, outbound } = await fastify.mediaSoup.produce(room_id, user_id, offer)

		for(let item of outbound){
			fastify.ws.sendSocket(item.id, "consume", item)
		}
		return { answer }
	})

	// fastify.post("/:user_id", { schema: { ...userParamsSchema, ...callSchema } }, async (request: UserFastifyRequest) => {
	// 	const { user_id } = request.params as any
	// 	const { incoming, room_id } = request.body as any

	// 	const userData = await fastify.model.usersModel.getUserData(request.userData.id)

	// 	if(!incoming){
	// 		const { room_id } = await fastify.mediaSoup.createRoom()
	// 		const { transportData, routerRtpCapabilities } = await fastify.mediaSoup.createTransport(room_id, { incoming: true })

	// 		fastify.ws.send(user_id, "call", { userData, room_id })
	// 		return { room_id, transportData, routerRtpCapabilities }
	// 	}else{
	// 		const { transportData, routerRtpCapabilities } = await fastify.mediaSoup.createTransport(room_id, { incoing: false })
	// 		return { room_id, transportData, routerRtpCapabilities }
	// 	}
	// })

	// fastify.post("/confirm/:room_id/:transport_id", { schema: transportSchema }, async (request) => {
	// 	const { room_id, transport_id } = request.params as any
	// 	const { candidates, offer, incoming } = request.body as any

	// 	const res = await fastify.mediaSoup.confirmTransport (room_id, { transport_id, candidates, offer, incoming: !incoming })

	// 	return res
	// })

}