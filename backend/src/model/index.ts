import type { Pool } from 'pg'
import initDB from '../libs/init-db'
import MessagesModel from './messages'

import TokensModel from './tokens'
import UsersModel from './users'


export default class AppModel {

	db: Pool
	tokensModel: TokensModel
	usersModel: UsersModel
	messagesModel: MessagesModel

	constructor(){
	}

	async init (){
		this.db = initDB()
		this.tokensModel = new TokensModel(this.db)
		this.usersModel = new UsersModel(this.db)
		this.messagesModel = new MessagesModel(this.db)
	}
}