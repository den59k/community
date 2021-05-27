import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { colors } from 'src/constants.json'
import AnimatedView from 'src/components/animated'

function ModalWindow ({title, children}){
  return (
    <AnimatedView style={styles.modal}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>
        {children}
      </View>
    </AnimatedView>
  )
}

export default ModalWindow

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    borderRadius: 16
  },
  title: {
    textAlign: "center",
    lineHeight: 35,
    fontWeight: '700',
    backgroundColor: colors.semiLight,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  content: {
    paddingVertical: 15,
    paddingHorizontal: 20
  }
})