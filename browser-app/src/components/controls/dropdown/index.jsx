import { useEffect, useState } from 'react'
import cn from 'classnames'
import styles from './style.module.sass'

import { MdKeyboardArrowDown } from 'react-icons/md'

export default function DropDown({ name, onChange, fields, value, className, label, error, icon, ...props }){

	const [ opened, setOpened ] = useState(false)
	
	useEffect(() => {

		if(opened){
			const click = () => {
				setOpened(false)
			}

			document.addEventListener("click", click)
			document.addEventListener("keydown", click)

			return () => {
				document.removeEventListener("click", click)
				document.removeEventListener("keydown", click)
			}
		}

	}, [ opened ])

	return (
		<div className={cn(styles.container, className)}>
			<button className={cn(styles.button, opened && styles.opened)} onClick={() => setOpened(true)}>
				{fields[value]}
				<MdKeyboardArrowDown/>
			</button>
			<div className={cn(styles.menu, !opened && styles.closed)}>
				{ Object.keys(fields).map(key => (
					<button key={key} onClick={() => onChange(key)}>{fields[key]}</button>
				))}
			</div>
		</div>
	)
}