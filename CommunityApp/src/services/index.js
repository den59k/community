import { url as baseUrl } from '../constants.json'

let accessToken = ''

export function setAccessToken (token){
	accessToken = token
}

export const getAccessToken = () => accessToken

export const GET = async(url) => {

	const response = await fetch(baseUrl + url, {
		method: 'GET',
		headers: {
			'access-token': accessToken
		}
	});
	const json = await response.json();

	return json;
}


export const REST = async (url, body, method) => {

	const response = await fetch(baseUrl + url, {
		method: method || 'POST',
		body: JSON.stringify(body),
		headers: {
		 'Content-Type': 'application/json;charset=utf-8',
		 'access-token': accessToken
		}
	});

	try{
		const json = await response.json();
		return json;
	}catch(e){
	
		return { error: "Response is not a valid JSON" }
	}
}