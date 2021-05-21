import { AppFastifyInstance } from '../types/fastify';
import { createWorker } from 'mediasoup'
import Room from '../room';

export default async function app (fastify: AppFastifyInstance){

	const worker = await createWorker({ logLevel: "debug"	})

	fastify.decorate("worker", worker)
	fastify.decorate("rooms", new Map())

	fastify.post("/rooms", async () => {
		const room = new Room()
		await room.init(fastify.worker)
		fastify.rooms.set(room.id, room)

		return { room_id: room.id }
	})

	fastify.post("/rooms/:room_id/users", async (request) => {
		const { room_id } = request.params as any
		const room = fastify.rooms.get(room_id)
		const userData = await room.createUser()
		return {
			routerRtpCapabilities: room.router.rtpCapabilities,
			...userData
		}
	})

	fastify.put("/rooms/:room_id/users/:user_id", async (request) => {
		const { room_id, user_id } = request.params as any
		const { dtlsParameters } = request.body as any
		const room = fastify.rooms.get(room_id)

		await room.users.get(user_id).confirmConsumeTransport({dtlsParameters})
		return { success: "success" }
	})

	fastify.post("/rooms/:room_id/users/:user_id/produce", async (request) => {
		const { room_id, user_id } = request.params as any
		const room = fastify.rooms.get(room_id)
		const user = room.users.get(user_id)

		return await user.createProduceTransport(room.router)
	})

	fastify.put("/rooms/:room_id/users/:user_id/produce", async (request) => {
		const { room_id, user_id } = request.params as any
		const { dtlsParameters } = request.body as any
		const room = fastify.rooms.get(room_id)

		await room.users.get(user_id).confirmProduceTransport({dtlsParameters})
	})


	// fastify.post("/rooms/:room_id/ts", async (request) => {
	// 	const { room_id } = request.params as any
	// 	const { incoming } = request.body as any
	// 	const room = fastify.rooms.get(room_id)

	// 	return await room.createTransport(incoming)
	// })

	// fastify.post("/rooms/:room_id/ts/:transport_id", async (request) => {
	// 	const { room_id, transport_id } = request.params as any
	// 	const { dtlsParameters } = request.body as any 
	// 	const room = fastify.rooms.get(room_id)

	// 	await room.confirmTransport(transport_id, dtlsParameters)
	// 	return { success: "success" }
	// })

	// fastify.post("/rooms/:room_id/ts/:transport_id/produce", async (request) => {
	// 	const { room_id, transport_id } = request.params as any
	// 	const { kind, rtpParameters } = request.body as any
	// 	const room = fastify.rooms.get(room_id)

	// 	return await room.createProducer(transport_id, { kind, rtpParameters })
	// })

	// fastify.post("/rooms/:room_id/ts/:transport_id/consume", async (request) => {
	// 	const { room_id, transport_id } = request.params as any
	// 	const room = fastify.rooms.get(room_id)

	// 	return await room.createConsumers(transport_id)
	// })

	// fastify.post("/rooms/:room_id/ts/:transport_id/resume", async (request) => {
	// 	const { room_id, transport_id } = request.params as any
	// 	const room = fastify.rooms.get(room_id)

	// 	await room.resumeConsume(transport_id)

	// 	return { success: "success"}
	// })
}