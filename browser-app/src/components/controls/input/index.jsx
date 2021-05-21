import cn from 'classnames'
import styles from './style.module.sass'

export default function Input({ name, onChange, value, className, label, error, icon, ...props }){

	const _onChange = (e) => {
		onChange(e.target.value, name)
	}

	return (
		<div className={cn(styles.input, className)}>
			{label && ( <label>{label}</label> )}
			<input name={name} onChange={_onChange} value={value || ""} {...props}/>
			{ icon }
			{ error && <div className={styles.error}>{error}</div> }
		</div>
	)
}