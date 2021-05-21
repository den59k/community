import Model from "../model";

function getId(user_id: number, user2_id: number){
	if(user_id < user2_id)
		return (user_id << 16) + user2_id
	else
		return (user2_id << 16) + user_id
}

class MessagesModel extends Model {
	async getConfs (user_id: number){
		const resp = await this.db.query(`
			SELECT 
				confs.id, messages_count, last_message_readed, c.user_id user_id, c.login user_login,
				m.user_id message_user_id, m.login message_user_login, timestep, text 
			FROM confs
			LEFT JOIN users_confs ON confs.id = users_confs.conf_id
			LEFT JOIN (
				SELECT confs.id, login, users.id user_id FROM confs
				LEFT JOIN users_confs ON confs.id = users_confs.conf_id
				LEFT JOIN users ON users_confs.user_id = users.id
				WHERE users.id != $1
			) c ON c.id = confs.id
			LEFT JOIN
			(
				SELECT DISTINCT ON (conf_id) conf_id, login, user_id, timestep, text 
				FROM messages 
				LEFT JOIN users ON users.id=user_id
				ORDER BY conf_id, timestep DESC
			) m ON m.conf_id = confs.id
			WHERE users_confs.user_id = $1
			ORDER BY timestep DESC
		`, [ user_id ])

		return resp.rows
	}

	async getConf(user_id: number, user2_id: number){
		const conf_id = getId(user_id, user2_id)

		const resp = await this.db.query('SELECT id FROM confs WHERE id=$1', [conf_id])
		return resp.rows[0]
	}

	async getMessages (conf_id: number){
		const resp = await this.db.query(`
			SELECT message_id, timestep, text, user_id, login
			FROM messages
			LEFT JOIN users ON messages.user_id = users.id
			WHERE conf_id=$1
			ORDER BY timestep DESC
		`, [conf_id])

		return resp.rows
	}

	async markMessageReaded (user_id: number, conf_id: number){
		const resp = await this.db.query(`
			UPDATE users_confs SET last_message_readed=confs.messages_count FROM confs
			WHERE users_confs.user_id = $1 AND conf_id = $2 AND confs.id = $2
		`, [ user_id, conf_id ])
		return resp.rowCount
	}

	async createConf (user_id: number, user2_id: number){

		const client = await this.db.connect()
		try{
			const conf_id = getId(user_id, user2_id)
			await client.query('BEGIN')
			await client.query(`
				INSERT INTO confs (id, messages_count) VALUES ($1, 0) RETURNING id
			`, [conf_id])
			await client.query(`
				INSERT INTO users_confs VALUES ($1, $2, 0)
			`, [user_id, conf_id])

			await client.query(`
				INSERT INTO users_confs VALUES ($1, $2, 0)
			`, [user2_id, conf_id])

			await client.query('COMMIT')
			
			return { id: conf_id }
		}catch(e){
			await client.query('ROLLBACK')
			throw e
		} finally {
			client.release(true)
		} 
	}

	async existUserInConf (user_id: number, conf_id: number){
		const res = await this.db.query(
			'SELECT COUNT(*) FROM users_confs WHERE user_id=$1 AND conf_id=$2',
			[ user_id, conf_id ]
		)
		return res.rows[0].count
	}

	async writeMessage(from_user_id: number, conf_id: number, text: string){
		const client = await this.db.connect()
		try{
			const res = await client.query(
				'UPDATE confs SET messages_count = messages_count+1 WHERE id=$1 RETURNING messages_count',
				[ conf_id ]
			) 
			const message_id = res.rows[0].messages_count

			const mesasageData = await client.query(`
				INSERT INTO messages VALUES ($1, $2, $3, $4, $5) RETURNING message_id, conf_id, timestep, user_id, text
			`, [ message_id, conf_id, Date.now(), from_user_id, text ])
			
			await client.query(`
				UPDATE users_confs SET last_message_readed=$3 WHERE user_id=$1 AND conf_id=$2
			`, [ from_user_id, conf_id, message_id ])

			await client.query('COMMIT')
			return mesasageData.rows[0]
		}catch(e){
			await client.query('ROLLBACK')
			throw e
		} finally {
			client.release()
		}
	}
}

export default MessagesModel