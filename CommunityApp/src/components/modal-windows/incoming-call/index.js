import React, { useRef } from 'react'
import ModalWindow from ".."
import { View, StyleSheet, Animated, TouchableWithoutFeedback, PanResponder } from 'react-native'
import { Icon } from 'native-base'
import { colors } from 'src/constants'
import { PanGestureHandler, FlingGestureHandler, Directions } from 'react-native-gesture-handler'
import { useModal } from '../../../providers/modal'

const options = {
  inputRange: [-80, 0, 80],
  extrapolate: "clamp"
}

function IncomingCallModal ({ title, onAccept, onReject }){

  const modal = useModal()

  const _touchX = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(1)).current

  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([ null, { dx: _touchX } ], { useNativeDriver: false }),
    onPanResponderRelease: (e, gestureState) => {
      if(gestureState.dx < -50){
        if(onReject) onReject()
        return modal.close()
      }

      if(gestureState.dx > 50){
        if(onAccept) onAccept()
        return modal.close()
      }

      Animated.timing(_touchX, { toValue: 0, duration: 300, useNativeDriver: true }).start()
    } 
  })).current;

  return (
    <ModalWindow title={title || "Входящий вызов"}>

      <View style={styles.container}>
        <Icon name="arrow-back" style={[styles.subIcon, { opacity: 0.3 }]}/>
          
            <Animated.View  {...panResponder.panHandlers} style={[styles.button, {
              transform: [
                { translateX: _touchX.interpolate({...options, outputRange: [-80, 0, 80] }) },
                { scale: _touchX.interpolate({...options, outputRange: [ 0.4, 0.9, 1.1 ] }) }, 
              ] }]}>
              <Icon name="call" style={styles.icon}/>
            </Animated.View>

        <Icon name="arrow-forward" style={styles.subIcon}/>
      </View>

    </ModalWindow>
  )
}

export default IncomingCallModal

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  button: {
    width: 70,
    height: 70,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    zIndex: 2
  },
  icon: {
    color: 'white',
  },
  subIcon: {
    color: colors.primary,
    marginHorizontal: 20
  }
})