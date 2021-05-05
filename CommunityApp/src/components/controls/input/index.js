import React from 'react';
import { Text, StyleSheet, View, TextInput } from 'react-native';

import { colors } from 'src/constants'

export default function Input ({label, style, ...props}){

	return (
		<View style={style}>
			<Text style={styles.label}>{label}</Text>
			<TextInput style={styles.input} {...props}/>
		</View>
	)
}

const styles = StyleSheet.create({
	label: {
		color: colors.primary,
		paddingLeft: 24,
		fontSize: 12,
		fontWeight: '700'
	},
	input: {
		backgroundColor: colors.light,
		paddingLeft: 24,
		borderRadius: 14,
		fontFamily: 'sans-serif'
  }
})