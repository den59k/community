import { makeAutoObservable, runInAction } from "mobx"
import { REST, setAccessToken } from 'src/services'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mutate, cache } from 'swr'

class AuthStore {

	status = ""
	userData = null

	constructor(){
		makeAutoObservable(this)
	}

	async authorize ({refreshToken, accessToken, userData}){
		setAccessToken(accessToken)
		await AsyncStorage.setItem('refreshToken', refreshToken)
		runInAction(() => {
			this.userData = userData
			this.status = "authorized"
		})
	}

	async init(){
		const oldRefreshToken = await AsyncStorage.getItem('refreshToken')
		if(oldRefreshToken){
			const { userData, refreshToken, accessToken, error } = await REST('/auth', { refreshToken: oldRefreshToken }, 'POST')
			if(error) 
				return runInAction(() => this.status = 'not-authorized')
			
			this.authorize({refreshToken, accessToken, userData})
		}else
			runInAction(() => this.status = 'not-authorized' )
	}

	async login(login, password){
		const { userData, accessToken, refreshToken, error } = await REST('/auth/login', { login, password }, 'POST')
		
		if(error) return error

		await this.authorize({refreshToken, accessToken, userData})
	}

	async register(login, password){
		const { userData, accessToken, refreshToken, error } = await REST('/auth/register', { login, password }, 'POST')

		if(error) return error

		await this.authorize({refreshToken, accessToken, userData})
	}

	async logout (){
		const oldRefreshToken = await AsyncStorage.getItem('refreshToken')
		const { error, success } = await REST('/auth', { refreshToken: oldRefreshToken }, 'DELETE')
		
		runInAction(() => {
			this.status = 'not-authorized'
			this.userData = null
			cache.clear()
		})
	}
}

export default AuthStore