import cn from 'classnames'

import styles from './modal-window.module.sass'

import { IoIosClose } from 'react-icons/io'
import { useModal } from 'providers/modal-window'

export default function ModalWindow ({ children, title, className, style }){

	const modal = useModal() 

	return (
		<div className={cn(styles.modal, className)} style={style}>
			<div className={styles.header}>
				<h3>{ title }</h3>
				<button className={styles.closeButton} onClick={() => modal.close()}> 
					<IoIosClose/> 
				</button>
			</div>
			<div className={styles.content}>
				{children}
			</div>
		</div>
	)

}