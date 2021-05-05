import React, { useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'

const values = {
	toTop: { start: 120, end: 0 },
	scale: { start: 0.9, end: 1 }
}

function getAnimOptions (mode, duration=140){
	return {
		toValue: values[mode]? values[mode].end: 1,
		easing: Easing.out(Easing.quad),
		duration,
		useNativeDriver: true
	}
}

function getStyle(mode, fadeAnim){
	if(mode === 'toTop')
		return {transform: [{ translateY: fadeAnim }]}

	return {transform: [{ scale: fadeAnim }]}
}

export default function AnimatedView ({children, style, mode}){

	const fadeAnim = useRef(new Animated.Value(values[mode]? values[mode].start: 0.8)).current
	useEffect(() => {
    Animated.timing(fadeAnim, getAnimOptions(mode)).start();
  }, [fadeAnim])

	return (
		<Animated.View style={[style, getStyle(mode, fadeAnim)] }>
			{children}
		</Animated.View>
	)
}