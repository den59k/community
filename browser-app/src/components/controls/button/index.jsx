import cn from 'classnames'
import styles from './style.module.sass'

export default function Button({ children, className, ...props }){

	return (
		<button className={cn(className, styles.button)} {...props}>
			{children}
		</button>
	)
}