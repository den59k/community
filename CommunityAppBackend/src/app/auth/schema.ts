import getSchema from "../../libs/schema";

export const loginSchema = getSchema({
	properties: {
		login: { type: 'string' },
		password: { type: 'string' }
	},
	required: [ 'login', 'password' ]
})

export const registerSchema = getSchema({
	properties: {
		login: { type: 'string' },
		password: { type: 'string' }
	},
	required: [ 'login', 'password' ]
})

export const tokenSchema = getSchema({
	properties: {
		refreshToken: { type: 'string' },
	},
	required: [ 'refreshToken' ]
})