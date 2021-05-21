import { Pool } from 'pg';
import Model from '../model';
import jwt from 'jsonwebtoken'

import getKeys from '../../libs/get-keys'

const sign = (info: any, key: Buffer, options: any): Promise<string> => new Promise((res, rej) => {
	jwt.sign( info, key, options, (err: any, token: string) => {
		if(err) return rej(err)
		res(token) 
	})
})

const verify = (token: string, key: Buffer): Promise<any> => new Promise((res, rej) => {
	jwt.verify( token, key, (err: any, decoded: any) => {
		if(err){
			console.log(err)
			return res(null)
		}
		res(decoded) 
	})
})

export default class TokensModel extends Model {

	publicKey: Buffer
	privateKey: Buffer

	constructor(db: Pool){
		super(db)

		const keys = getKeys()
		this.publicKey = keys.publicKey
		this.privateKey = keys.privateKey
	}

	async useJWT(token: string){

		const resp = await this.db.query('DELETE FROM refresh_tokens WHERE token=$1', [token])
		return resp.rowCount > 0
	}

	async generateJWT(userInfo: any){
		
		const refreshToken = await sign(userInfo , this.privateKey, { algorithm: 'ES256' })
		const accessToken = await sign({
			...userInfo, 
			exp: Math.floor(Date.now() / 1000) + (60 * 60),
		}, this.privateKey, { algorithm: 'ES256'})

		await this.db.query(
			`INSERT INTO refresh_tokens VALUES ($1, $2, $3)`, 
			[ userInfo.id, refreshToken, Date.now() ]
		)
			
		return { refreshToken, accessToken }
	}

	async jwt(data: any){
		const token = await sign(data , this.privateKey, { algorithm: 'ES256' })
		return token
	}

	async decodeJWT(token: string){

		if(!token) return null
		
		const decoded = await verify(token, this.publicKey)

		return decoded
	}

}