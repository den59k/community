import { FastifyReply } from "fastify";
import type { AppFastifyInstance } from "../../types/fastify";
import { registerSchema, loginSchema, tokenSchema } from './schema'

export interface TokenFastifyReply extends FastifyReply{
	sendToken: (user_id: number) => Promise<FastifyReply>
}

export default async function auth (fastify: AppFastifyInstance){

	//Здесь мы объявляем функцию отправки новых токенов и данные пользователя
	fastify.decorateReply('sendToken', async function(user_id: number){
		const userData = await fastify.model.usersModel.getUserData(user_id)
		await fastify.model.usersModel.updateLastLoginTime(user_id)
		
		const data = {
			id: userData.id
		}

		const { refreshToken, accessToken } = await fastify.model.tokensModel.generateJWT(data)

		this.send({refreshToken, accessToken, userData})
		return this
	})

	//Здесь происходит аутентификация по токену
	fastify.post('/', { schema: tokenSchema }, async (request, reply: TokenFastifyReply) => {
		const { refreshToken } = request.body as any

		const userData = await fastify.model.tokensModel.decodeJWT(refreshToken)
		if(!userData) return reply.status(403).send({error: { token: "wrong token"}} )

		const success = await fastify.model.tokensModel.useJWT(refreshToken)
		if(!success) return reply.status(403).send({error: { token: "unknown token"}} )
			
		return reply.sendToken(userData.id)
	})

	//Здесь происходит регистрация
	fastify.post('/register', { schema: registerSchema }, async (request, reply: TokenFastifyReply) => {
		const { login, password } = request.body as any

		const userData = await fastify.model.usersModel.addUser({login, password})
		
		return reply.sendToken(userData.id)
	})

	//А здесь авторизация по логину и паролю
	fastify.post('/login', { schema: loginSchema }, async (request, reply: TokenFastifyReply) => {
		const { login, password } = request.body as any

		const userData = await fastify.model.usersModel.authenticate({login, password})

		if(!userData) return reply.status(403).send({error: { login: "Неверный логин" }})
		if(!userData.true_password) reply.status(403).send({error: { password: "Неверный пароль" }})

		return reply.sendToken(userData.id)
	})

	fastify.delete('/', { schema: tokenSchema }, async (request) => {
		const { refreshToken } = request.body as any
		const success = await fastify.model.tokensModel.useJWT(refreshToken)
		return { success }
	})

}
