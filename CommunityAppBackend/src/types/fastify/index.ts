import type { FastifyInstance, FastifyRequest } from "fastify"
import type Model from "../../model";
import WS from "../../ws";

export interface UserFastifyRequest extends FastifyRequest{
	userData: {
		id: number
	}
}

export interface AppFastifyInstance extends FastifyInstance {
	model: Model,
	ws: WS
}