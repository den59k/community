import { useRouter } from './index'

export default function Link (props){

	const routerStore = useRouter()

	const { to, level, children, ...otherProps } = props

	const onClick = (e) => {
		e.preventDefault()
		routerStore.push(to, level)
	}

	return (
		<a href={to} onClick={onClick} {...otherProps}>
			{children}
		</a>
	)
}