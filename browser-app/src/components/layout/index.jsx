import { observer } from "mobx-react"
import { useAuth } from "providers/auth"
import cn from 'classnames'

import styles from './style.module.sass'

import { MdExitToApp } from 'react-icons/md'

function Layout ({children, className}){

	const auth = useAuth()

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<h2>Мессенджер</h2>
				<div className={styles.userInfo}>
					<div>{auth.userData.login}</div>
					<button title="Выйти из аккаунта" onClick={() => auth.logout()}><MdExitToApp/></button>
				</div>
			</header>
			<div className={cn(styles.content, className)}>
				{ children }
			</div>
		</div>
	)

}

export default observer(Layout)