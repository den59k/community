import React, { useEffect, useRef } from 'react'
import { View,  StyleSheet, Text, FlatList } from 'react-native'
import { observer } from 'mobx-react'
import { useAuthStore } from 'src/providers/auth'
import { time } from 'src/statics/months'
import { colors } from 'src/constants'
import { toJS } from 'mobx'

function _Message ({lastData, data}){
	
	const userStore = useAuthStore()

	const my = userStore.userData.id === data.user_id
	const showHeader = !lastData || lastData.user_id !== data.user_id || data.timestep > lastData.timestep+60*3000

	return (
		<View style={[styles.message, my? styles.my: {}]}>
			<View style={[styles.messageHeader, showHeader? {}: {display: 'none'} ]}>
				<Text style={[styles.sub, my? styles.mySub: {}]}>{my?"Вы": data.login}</Text>
				<Text style={styles.sub}>{time(data.timestep)}</Text>
			</View>
			<Text style={styles.messageText}>{data.text}</Text>
		</View>
	)
}

const Message = observer(_Message)

function MessageList ({chatStore}){
	
	const listRef = useRef()
	const messages = toJS(chatStore.messages)

	const toDown = chatStore.toDown
	useEffect(() => {
		if(toDown){
			listRef.current.scrollToOffset({offset: 0, animated: true})
			chatStore.setToDown(false)
		}
	}, [toDown])

	return (
		<View style={styles.container}>
			<FlatList
				inverted={true}
				ref={listRef}
				data={messages}
				renderItem={({item, index}) => <Message lastData={messages[index+1]} data={item} />}
				keyExtractor={item => item.message_id}
			/>
		</View>
	)
}

export default observer(MessageList)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 10
	},
	message: {
		marginBottom: 8,
		alignSelf: 'flex-start'
	},
	my: {
		alignSelf: 'flex-end'
	},
	messageText: {
		fontSize: 16,
		backgroundColor: 'white',
		paddingHorizontal: 20,
		paddingVertical: 14,
		lineHeight: 22,
		borderRadius: 16,
		maxWidth: "92%"
	},
	messageHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 15,
		marginTop: 10
	},
	sub: {
		color: colors.gray,
		fontSize: 12,
		marginBottom: 2,
		marginHorizontal: 5
	},
	mySub: {
		color: colors.primary
	}
})