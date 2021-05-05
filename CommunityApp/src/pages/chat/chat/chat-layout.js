import React from 'react'
import { observer } from "mobx-react";
import { StyleSheet } from 'react-native'
import { colors } from 'src/constants'
import { useAuthStore } from 'src/providers/auth'
import { useRouterStore } from 'src/providers/router'
import { Container, Header, Left, Body, Right, Button, Icon, Title, Subtitle } from 'native-base';
import { getTime } from 'src/statics/months'

const CustomBody = observer(({chatStore}) => {
	if(chatStore.status !== 'success')
		return (
			<Body style={styles.body}>
				<Title>Загрузка...</Title>
			</Body>
		)

	return (
		<Body style={styles.body}>
			<Title>{chatStore.userData.login}</Title>
			<Subtitle>В сети: {getTime(chatStore.userData.last_login_time)}</Subtitle>
		</Body>
	)
})

function Layout ({children, chatStore}){

	const authStore = useAuthStore()
	const routerStore = useRouterStore()

	return (
		<Container style={styles.container}>
			<Header style={styles.header} androidStatusBarColor={colors.darkPrimary}>
				<Left style={!routerStore.currentPage.page? {display: 'none'}: {}} >
					<Button transparent onPress={() => routerStore.pop()}>
						<Icon name='arrow-back' />
					</Button>
				</Left>
				<CustomBody chatStore={chatStore}/>
			</Header>
			{children}
		</Container>
	)
}

export default observer(Layout)

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.light
	},
	header: {
		height: 65,
		backgroundColor: colors.primary
	},
	body: {
		flex: 2
	}
})