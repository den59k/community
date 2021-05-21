const baseUrl = "/api"
let accessToken = ''

export function setAccessToken (token){
	accessToken = token
}

export const getAccessToken = () => accessToken

export const GET = async(url, useBaseUrl = true) => {

	const response = await fetch((useBaseUrl? baseUrl: "") + url, {
		method: 'GET',
		headers: {
			'access-token': accessToken,
			"Access-Control-Request-Headers": "*"
		}
	});
	const json = await response.json();

	return json;
}


export const REST = async (url, body, method, useBaseUrl = true) => {

	const response = await fetch((useBaseUrl? baseUrl: "") + url, {
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