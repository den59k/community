import type { UserFastifyRequest, AppFastifyInstance } from "../../types/fastify"
import { callSchema, roomParamsSchema, userParamsSchema, transportSchema } from './schema'

export default async function calls (fastify: AppFastifyInstance){

	fastify.addHook('onRequest', async (request: UserFastifyRequest, reply) => {
		if(!request.userData)
			return reply.code(401).send({error: { access_token: "wrong token" }})
	})

	//Звонок от одного пользователя другому
	fastify.post("/", { schema: callSchema }, async (request: UserFastifyRequest) => {
		const { user_id, callee } = request.body as any
		const userData = await fastify.model.usersModel.getUserData(request.userData.id) 

		if(!fastify.ws.connections.has(callee)) return { error: { callee: "Пользователь не в сети" }}
		
		const roomData = await fastify.mediaSoup.createRoom()

		fastify.ws.send(callee, "call", { roomData, userData });
		
		const connectionData = await fastify.mediaSoup.addUser(roomData.room_id, user_id)

		return { roomData, connectionData }
	})

	fastify.post("/:room_id/reject", { schema: roomParamsSchema }, async (request: UserFastifyRequest) => {
		const { room_id } = request.params as any
		const { user_id } = request.body as any
		
		console.log("REJECTED" + room_id)
		
		const users = await fastify.mediaSoup.getUsers(room_id)
		for(let user of users)
			fastify.ws.sendSocket(user.id, "reject-call", { room_id })
		
		return { status: "rejected" }
	})

	fastify.post("/:room_id", { schema: roomParamsSchema }, async (request: UserFastifyRequest) => {
		const { room_id } = request.params as any
		const { user_id } = request.body as any
			
		const connectionData = await fastify.mediaSoup.addUser(room_id, user_id)

		return connectionData
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