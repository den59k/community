CREATE EXTENSION pgcrypto;

CREATE TABLE users (
	id serial PRIMARY KEY,
	login text,
	password bytea,
	last_login_time bigint
);

CREATE UNIQUE INDEX ON users (lower(login));

CREATE TABLE refresh_tokens (
	user_id int,
	token text PRIMARY KEY,
	timestamp bigint
);

-- Сообщения
CREATE TABLE users_confs (
	user_id int,
	conf_id bigint,
	last_message_readed bigint,
	PRIMARY KEY (user_id, conf_id)
);

CREATE TABLE confs (
	id bigserial PRIMARY KEY,
	messages_count bigint
);

CREATE TABLE messages (
	message_id bigint,
	conf_id bigint,
	timestep bigint,
	user_id int,
	text text
);