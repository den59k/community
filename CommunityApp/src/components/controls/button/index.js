import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from 'src/constants'

export default function Button ({title, style, ...props}){
	return (
		<TouchableOpacity
			activeOpacity={0.6}
			style={[styles.button, style]}
			{...props}
		>
			<Text style={styles.buttonText}>{title}</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	button: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 25,
    alignSelf: 'center',
    paddingHorizontal: 50
  },
  buttonText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    height: '100%',
    color: 'white',
    fontWeight: '700',
  }
})