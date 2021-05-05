import { num } from './num'

const months = [
	'января',
	'февраля',
	'марта',
	'апреля',
	'мая',
	'июня',
	'июля',
	'августа',
	'сентября',
	'октября',
	'ноября',
	'декабря',
]

function _ (i){
	if(i < 10) return '0'+i
	return i
}

//Функция для получения времени
export function getTime(time){

	const delta = Math.floor((Date.now() - time) / 60 / 1000)

	if(delta <= 0)
		return "только что"
	if(delta === 1)
		return "минуту назад"
	if(delta < 30)
		return num(delta, 'минуту', 'минуты', 'минут') + ' назад'
	
	const date = new Date(time)
	const nowDate = new Date()


	if(delta < 24 * 60 && date.getDate() === nowDate.getDate())
		return 'сегодня в ' + date.getHours() + ':' + _(date.getMinutes())

	if(delta < 24 * 2 * 60 && date.getDate() - nowDate.getDate() === 1)
		return 'вчера в ' + date.getHours() + ':' +  _(date.getMinutes())

	return date.getDate() + ' ' + months[date.getMonth()] + ' в ' + date.getHours() + ':' +  _(date.getMinutes())
}

export function time(time){
	const date = new Date(time)
	return _(date.getHours())+":"+_(date.getMinutes())
}