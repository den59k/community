import type { Pool } from 'pg'

export default class Model {
	db: Pool

	constructor(db: Pool){
		this.db = db
	}
}