import fp from 'fastify-plugin'
import { UserFastifyRequest, AppFastifyInstance } from '../../../types/fastify'

async function userPlugin (fastify: AppFastifyInstance){
	fastify.decorateRequest('userData', null)
	
	fastify.addHook('onRequest', async (request: UserFastifyRequest, _reply) => {
		
		const access_token = request.headers['access-token']

		const userData = await fastify.model.tokensModel.decodeJWT(access_token as string)
		request.userData = userData
		return
	})
}

export default fp(userPlugin)