import Model from "../model";

export default class UsersModel extends Model {

	async checkUser (id: number){

	}

	async getUserData(user_id: number){
		const resp = await this.db.query(
			`SELECT id, login, last_login_time FROM users WHERE id=$1`,
			[ user_id ]
		)
		return resp.rows[0]
	}

	async addUser({login, password}){

		const resp = await this.db.query(
			`INSERT INTO users (login, password) VALUES ($1, digest($2, 'sha1')) RETURNING id, login`,
			[ login, password ]
		)
		return resp.rows[0]
	}

	async authenticate({login, password}){
		const resp = await this.db.query(
			`SELECT password = digest($2, 'sha1') true_password, id, login FROM users WHERE lower(login)=lower($1)`,
			[ login, password ]
		)
		return resp.rows[0]
	}

	async updateLastLoginTime(user_id: number){
		const resp = await this.db.query(`UPDATE users SET last_login_time=$2 WHERE id = $1`, [user_id, Date.now()])
		return resp.rowCount
	}

	async getAnotherUserList(user_id: number){
		const resp = await this.db.query(`
			SELECT id, login, last_login_time FROM users WHERE id != $1
		`, [ user_id ])

		return resp.rows
	}

}