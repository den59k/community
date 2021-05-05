import { Pool, types } from 'pg'

//Здесь мы должны указать парсинг bigint, иначе у нас вечно будут проблемы
types.setTypeParser(20, function(val) {
  return parseInt(val)
});

export default function initDB(){
		//Данные для подключения берутся из .env файла
	const pool = new Pool();

	//Мы просто извлекаем единственный пул, чтобы потом через него делать запросы
	return pool;
}