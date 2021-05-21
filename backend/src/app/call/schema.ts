import getSchema from "../../libs/schema";

export const roomParamsSchema = getSchema({
	properties: {
		room_id: { type: 'string' },
	},
	required: [ 'room_id' ]
}, 'params')

export const callSchema = getSchema({
	properties: {
		user_id: { type: 'string' }
	}, 
	required: [ "user_id" ]
})

export const transportSchema = getSchema ({
	properties: {
		room_id: { type: 'string' },
		transport_id: { type: 'string' },
	},
	required: [ 'transport_id', 'room_id' ]
}, 'params')