import cn from 'classnames'
import styles from './style.module.sass'

export default function SegmentButton({ name, onChange, value, fields, className, label, error, ...props }){

	const _onChange = (key) => {
		onChange(key, name)
	}

	return (
		<div className={cn(styles.segmentButton, className)} {...props}>
			{label && <label>{label}</label>}
			<div className={styles.buttons}>
				{Object.keys(fields).map(key => (
					<button key={key} className={cn(value === key && styles.active)} onClick={() => _onChange(key)}>
						{fields[key]}
					</button>
				))}
			</div>
		</div>
	)
}