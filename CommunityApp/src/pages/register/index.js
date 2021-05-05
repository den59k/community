import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Input, Button } from 'src/components/controls'
import { colors } from 'src/constants'
import { useAuthStore } from 'src/providers/auth'
import { useRouterStore } from 'src/providers/router'
import AnimatedView from 'src/components/animated'

export default function LoginPage (){

	const [ login, setLogin ] = useState()
	const [ password, setPassword ] = useState()
	const [ confirmPassword, setConfirmPassword ] = useState()

	const authStore = useAuthStore()
	const routerStore = useRouterStore()

  const onSubmit = async () => {
    if(!login) return alert ("Введите своё имя!")
		if(password !== confirmPassword) return alert ("Пароли не совпдают")
    authStore.register(login, password).then(err => {
			if(err) return alert(JSON.stringify(err))
			routerStore.clear()
		})
  }


	return (
		<AnimatedView style={{flex: 1}} mode="scale">
			<ScrollView contentContainerStyle={styles.container}>
		
					<Text style={[styles.title, styles.element]}>Регистрация аккаунта</Text>
					<Input 
						style={styles.element} 
						value={login} 
						onChangeText={setLogin} 
						label="Логин" 
						placeholder="Как бы вы себя назвали?"
					/>
					<Input 
						style={styles.element} 
						value={password} 
						onChangeText={setPassword} 
						label="Пароль" 
						placeholder="Придумайте свой пароль"
						secureTextEntry={true}
					/>
					<Input 
						style={styles.element} 
						value={confirmPassword} 
						onChangeText={setConfirmPassword} 
						label="Повтор пароля" 
						placeholder="Зачем-то введите его еще раз"
						secureTextEntry={true}
					/>
					<Button title="Создать аккаунт" onPress={onSubmit} style={styles.element}/>
					<View style={styles.line}/>

					<TouchableOpacity>
						<Text style={styles.flatButton} onPress={() => routerStore.pop()}>
							Вернуться назад
						</Text>
					</TouchableOpacity>

			</ScrollView>
		</AnimatedView>
	)
}


const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
   paddingHorizontal: 20,
	 flexDirection: 'column'
  },
  title: {
    fontSize: 26,
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