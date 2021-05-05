import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { colors } from 'src/constants'
import { Icon } from 'native-base'
import { observer } from 'mobx-react'

function ChatInput ({chatStore}){
	
	const [ value, setValue ] = useState('')

	const send = () => {
		chatStore.send(value).then(err => {
			if(err) return alert(JSON.stringify(err))
			setValue('')
		})
	}

	return (
		<View style={styles.container}>
			<TextInput 
				style={styles.input} 
				multiline={true} 
				value={value}
				onChangeText={setValue}
				placeholder="Введите сообщение..."
			/>
			<TouchableOpacity style={styles.button} onPress={send}>
				<Icon style={styles.icon} name="send"/>
			</TouchableOpacity>
		</View>
	)
}

export default observer(ChatInput)

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 15,
		paddingVertical: 10,
		flexDirection: 'row',
		alignItems: 'stretch'
	},
	input: {
		backgroundColor: colors.semiLight,
		borderRadius: 14,
		paddingLeft: 18,
		flex: 1,
		lineHeight: 22,
		fontSize: 15
	},
	button: {
		paddingLeft: 15,
		justifyContent: 'center'
	},
	icon: {
		color: colors.primary,
		fontSize: 32
	}
})