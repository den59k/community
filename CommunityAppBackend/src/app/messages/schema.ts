import getSchema from "../../libs/schema";

export const userParamsSchema = getSchema({
	properties: {
		user_id: { type: 'integer' },
	},
	required: [ 'user_id' ]
}, 'params')

export const confParamsSchema = getSchema({
	properties: {
		conf_id: { type: 'integer' },
	},
	required: [ 'conf_id' ]
}, 'params')

export const messageSchema = getSchema({
	properties: {
		text: { type: 'string' },
	},
	required: [ 'text' ]
})