import { useState, useMemo, useCallback } from "react";

export { default as Input } from './input'
export { default as Button } from './button'
export { default as SegmentButton } from './segment-button'
export { default as CheckBox } from './checkbox'
export { default as DropDown } from './dropdown'

export function useForm(defaultValues, _onChange){

	const [ formData, setFormData ] = useState(defaultValues || {})
	const [ errors, setErrors ] = useState({})

	const onChange = useMemo(() => (value, key) => {
		
		setErrors(errors => {
			if(key in errors){
				const err = Object.assign({}, errors)
				delete err[key]
				return err
			}else{
				return errors
			}
		})

		if(_onChange) _onChange(value, key)
		
		setFormData(formData => ({ ...formData, [key]: value }))
	}, [ setFormData, setErrors, _onChange ])

	const clear = useCallback(() => {
		setFormData({})
	}, [ setFormData ])

	const get = (key) => formData[key]

	return { formData, get, onChange, clear, errors, setErrors }

}

export function getProps(name, form){
	return {
		name,
		onChange: form.onChange,
		value: form.formData[name],
		error: form.errors[name]
	}
}