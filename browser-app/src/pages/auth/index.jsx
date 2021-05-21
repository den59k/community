import { useForm, getProps, Input, Button } from "components/controls"
import { useAuth } from "providers/auth"

import styles from './style.module.sass'

function AuthPage (){

	const auth = useAuth()
	const form = useForm()

	const onSubmit = () => {
		const { login, password } = form.formData
		auth.login(login, password).then(err => {
			if(err) console.log(err)
		})
	}

	return (
		<div className={styles.form}>
			<h2>Вход в аккаунт</h2>
			<Input {...getProps("login", form)} placeholder="Имя пользователя" />
			<Input {...getProps("password", form)} placeholder="Пароль" type="password"/>
			<Button onClick={onSubmit}>Войти</Button>
		</div>
	)

}


export default AuthPage