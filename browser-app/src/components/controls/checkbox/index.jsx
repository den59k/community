import cn from 'classnames'

import styles from './style.module.sass'
import { MdCheck } from 'react-icons/md'

function CheckBox ({ label, onChange, value, name, className }){

	const onClick = () => {
		onChange(!value, name)
	}

	return (
		<button className={cn(styles.container, className, value===true && styles.active)} onClick={onClick}>
			<div className={styles.checkbox}>
				<MdCheck/>
			</div>
			{ label && <label>{label}</label> }
		</button>
	)
}

export default CheckBox