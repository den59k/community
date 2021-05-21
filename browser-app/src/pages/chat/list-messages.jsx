import { observer } from "mobx-react";
import { useMemo } from "react";
import { GET } from "services";
import { time } from "statics/months";
import { Link, useRouter } from 'providers/router'
import useSWR from "swr";
import styles from './style.module.sass'
import { useAuth } from "providers/auth";
import cn from 'classnames'

function ListMessages (){

	const { data } = useSWR("/messages", GET)
	const authStore = useAuth()
	const routerStore = useRouter()
	const user_id = parseInt(routerStore.get(1))

	const array = useMemo(() => data?data: [], [ data ])


	return (
		<div className={styles.listMessages}>
			{array.map(item => (
				<Link to={"/im/"+item.user_id} key={item.id} className={cn(styles.conf, item.user_id === user_id && styles.active)}>
					<div className={styles.confHeader}>
						<div className={styles.name}>{item.user_login}</div>
						<div className={styles.time}>{ time(item.timestep) }</div>
					</div>
					<div className={styles.confText}>
						<span>{ item.message_user_id === authStore.userData.id?"Вы": item.message_user_login }: </span>
						{ item.text }
					</div>
				</Link>
			))}
		</div>
	)

}

export default observer(ListMessages)