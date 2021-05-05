import React from 'react'
import { observer } from "mobx-react";
import { StyleSheet } from 'react-native'
import { colors } from 'src/constants'
import { useAuthStore } from 'src/providers/auth'
import { useRouterStore } from 'src/providers/router'
import { Container, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';

function Layout ({children}){

	const authStore = useAuthStore()
	const routerStore = useRouterStore()

	return (
		<Container>
			<Header style={styles.header} androidStatusBarColor={colors.darkPrimary}>
				<Left style={!routerStore.currentPage.page? {display: 'none'}: {}} >
					<Button transparent onPress={() => routerStore.pop()}>
						<Icon name='arrow-back' />
					</Button>
				</Left>
				<Body>
					<Title>{authStore.userData.login}</Title>
				</Body>
				<Right>
					<Button transparent onPress={() => authStore.logout()}>
						<Icon name="exit"/>
					</Button>
				</Right>
			</Header>
			{children}
		</Container>
	)
}

export default observer(Layout)

const styles = StyleSheet.create({
	header: {
		height: 65,
		backgroundColor: colors.primary
	}
})