import React, { useEffect } from 'react'
import { View, Text, TouchableHighlight, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { observer } from 'mobx-react'
import { Icon } from 'native-base'
import { useRouterStore } from 'src/providers/router'
import { useAuthStore } from 'src/providers/auth'
import { useWS } from 'src/providers/ws'
import useSWR, { mutate } from 'swr'	
import { GET } from 'src/services'
import { colors } from 'src/constants'
import { time } from 'src/statics/months'

function Item ({data, user_id}) {

	const routerStore = useRouterStore()

	const onPress = () => {
		if(data.user_id)
			routerStore.push({page: "chat", user_id: data.user_id })
	}

	const unread = data.messages_count-data.last_message_readed

	return (
		<TouchableHighlight underlayColor={colors.lightGray} onPress={onPress}>
			<View style={styles.conf}>
				<View style={styles.confHeader}>
					<Text style={styles.name}>{data.user_login}</Text>
					<Text style={styles.time}>{time(data.timestep)}</Text>
				</View>
				<View style={styles.info}>
					<Text numberOfLines={2} style={styles.text}>
						<Text style={styles.inlineName}>
							{data.message_user_id === user_id? "Вы": data.message_user_login}{": "}
						</Text>
						{data.text}
						</Text>
					<Text style={[styles.unread, unread>0?{}: {display: 'none'}]}>{unread}</Text>
				</View>
			</View>
		</TouchableHighlight>
	)
}

function ChatList (){

	const routerStore = useRouterStore()
	const authStore = useAuthStore()
	const ws = useWS()
	const { data: chatList } = useSWR('/messages', GET)

	useEffect(() => {
		const onMessage = (message) => {

			const messageData = {
				id: message.conf_id, 
				last_message_readed: 0, 
				message_user_id: message.user_id,
				message_user_login: message.login,
				messages_count: 1,
				text: message.text,
				timestep: message.timestep,
				user_id: message.user_id,
				user_login: message.login
			}

			mutate('/messages', data => {

				const conf = data.find(item => item.id === messageData.id)
				if(!conf)
					return [ messageData, ...data ]
				
				messageData.last_message_readed = conf.last_message_readed
				messageData.messages_count = conf.messages_count+1

				return [ messageData, ...data.filter(item => item.id !== messageData.id) ]
			}, false)
		}
		ws.on('message', onMessage)
		return () => ws.off('message', onMessage)
	}, [])

	return (
		<View style={styles.view}>
			<FlatList
				data={chatList}
				renderItem={({ item }) => <Item data={item} user_id={authStore.userData.id} />}
				keyExtractor={item => item.id}
			/>
			<TouchableOpacity style={styles.floatButton} activeOpacity={0.5} onPress={() => routerStore.push({page: 'add'})}>
				<Icon name="paper-plane" style={styles.floatButtonIcon}/>
			</TouchableOpacity>
		</View>
	)

}

export default observer(ChatList)

const styles = StyleSheet.create({
	view: {
		flex: 1
	},
	conf: {
		height: 85,
		flexDirection: 'column',
		justifyContent: 'center',
		paddingHorizontal: 15,
		borderBottomColor: colors.lightGray,
		borderBottomWidth: 1
	},
	name: {
		fontSize: 18,
		fontWeight: '700'
	},
	text: {
		fontSize: 15,
		color: "gray"
	},
	time: {
		color: colors.gray
	},
	confHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 3
	},
	info: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	inlineName: {
		color: colors.primary
	},
	unread: {
		backgroundColor: colors.primary,
		width: 24,
		height: 24,
		textAlign: 'center',
		lineHeight: 24,
		color: 'white',
		fontWeight: '700',
		borderRadius: 12
	},
	floatButton: {
		backgroundColor: colors.primary,
		width: 68,
		height: 68,
		borderRadius: 40,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		right: 20,
		bottom: 20,
		shadowColor: colors.darkPrimary,
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.29,
		shadowRadius: 4.65,

		elevation: 7,
	},
	floatButtonIcon: {
		color: "white",
		fontSize: 30
	}
})
