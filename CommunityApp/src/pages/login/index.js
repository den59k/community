import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Input, Button } from 'src/components/controls'
import { colors } from 'src/constants'
import { useAuthStore } from 'src/providers/auth'
import { useRouterStore } from 'src/providers/router'

export default function LoginPage (){

	const [ login, setLogin ] = useState()
	const [ password, setPassword ] = useState()
	const authStore = useAuthStore()
	const routerStore = useRouterStore()

  const onLogin = async () => {
    if(!login) return alert ("Введите своё имя!")
    authStore.login(login, password).then(err => {
			if(err) return alert(JSON.stringify(err))
			routerStore.clear()
		})
  }

	return (
		<View style={styles.container}>
			<Text style={[styles.title, styles.element]}>#Вход_в_аккаунт</Text>
			<Input 
				style={styles.element} 
				value={login} 
				onChangeText={setLogin} 
				label="Логин" 
				placeholder="Ваш логин"
			/>
			<Input 
				style={styles.element} 
				value={password} 
				onChangeText={setPassword} 
				label="Пароль" 
				placeholder="Ваш пароль"
				secureTextEntry={true}
			/>
      <Button title="Войти" onPress={onLogin} style={styles.element}/>
			<View style={styles.line}/>
			<Text style={styles.text}>Ещё нет аккаунта?</Text>
			<TouchableOpacity>
				<Text style={styles.flatButton} onPress={() => routerStore.push('register')}>
					Создать аккаунт
				</Text>
			</TouchableOpacity>
		</View>
	)
}


const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
   paddingHorizontal: 20
  },
  title: {
    fontSize: 30,
		marginTop: 50,
    color: '#F63986',
    fontWeight: '700',
    textAlign: 'center'
  },
  element: {
    marginVertical: 15
  },
	line: {
		marginVertical: 30,
		width: 100,
		height: 2,
		alignSelf: 'center',
		backgroundColor: colors.lightGray
	},
	text: {
		color: colors.gray,
		textAlign: 'center'
	},
	flatButton: {
		color: colors.primary,
		textAlign: 'center',
		fontWeight: '700',
		paddingVertical: 10
	}
});