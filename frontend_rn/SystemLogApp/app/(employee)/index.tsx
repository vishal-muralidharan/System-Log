import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function index() {
  return (
    <View style={styles.container}>
      <Text>index</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white', 
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        flex: 1
    }
})