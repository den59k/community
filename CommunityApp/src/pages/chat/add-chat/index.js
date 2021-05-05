import React from 'react'
import { observer } from 'mobx-react'
import { Text, TouchableHighlight, StyleSheet, FlatList, View } from 'react-native'
import AnimatedView from 'src/components/animated'
import { getTime } from 'src/statics/months'
import { colors } from 'src/constants'
import { useRouterStore } from 'src/providers/router'
import useSWR from 'swr'
import { GET } from 'src/services'

const data = [
	{ id: 1, login: "Denis", last_login_time: Date.now() },
	{ id: 2, login: "Den59k", last_login_time: Date.now() }
]

function Item ({id, login, last_login_time}){
	
	const router = useRouterStore()

	const onPress = () => {
		router.push({ page: "chat", user_id: id })
	}

	return (
		<TouchableHighlight onPress={onPress} underlayColor={colors.lightGray}>
			<View style={styles.profile}>
				<Text style={styles.name}>{login}</Text>
				<Text style={styles.sub}>Последняя активность: {getTime(last_login_time)}</Text>
			</View>
		</TouchableHighlight>
	)
}

function AddChat (){

	const { data } = useSWR('/messages/users', GET)

	return (
		<AnimatedView style={styles.container}>
			<FlatList
        data={data}
        renderItem={({ item }) => <Item {...item} />}
        keyExtractor={item => item.id}
				ListHeaderComponent={<Text style={styles.h1}>Все пользователи:</Text>}
      >
			</FlatList>
		</AnimatedView>
	)
}

export default observer(AddChat)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10
	},
	h1: {
		fontSize: 20,
		marginVertical: 5,
		fontWeight: '700'
	},
	profile: {
		height: 70,
		borderBottomColor: colors.lightGray,
		borderBottomWidth: 1,
		flexDirection: 'column',
		justifyContent: 'center'
	},
	name: {
		fontSize: 18
	},
	sub: {
		color: colors.gray
	}
})