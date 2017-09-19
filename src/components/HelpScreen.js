import React, { Component } from 'react';
import {
  Button,
  Image,
  Text,
  View,
  StyleSheet, } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

/**
 * This is a black sidebar displayed on the right. Controls the execution
 * of the game.
 * @type {[type]}
 */
export default class HelpScreen extends Component {
  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.panel}>
          <View style={styles.wing}>
            <View style={styles.row}>
              <Image style={styles.image} source={require('../resources/icons/banana.png')} />
              <Text style={styles.equal}>=</Text>
              <FontAwesome name="arrow-right" size={iconSize} style={{ color: 'white' }} />
            </View>
            <View style={styles.row}>
              <Image style={styles.image} source={require('../resources/icons/orange.png')} />
              <Text style={styles.equal}>=</Text>
              <FontAwesome name="rotate-left" size={iconSize} style={{ color: 'white' }} />

              {/* <Image style={styles.image} source={require('../resources/UI_Components/turn_left.png')} /> */}
            </View>
            <View style={styles.row}>
              <Image style={styles.image} source={require('../resources/icons/apple.png')} />
              <Text style={styles.equal}>=</Text>
              <FontAwesome name="rotate-right" size={iconSize} style={{ color: 'white' }} />
            </View>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.wing}>
              <View style={styles.row}>
                <Text style={styles.text}>1. Arrange fruits </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.text}>2. Take a picture </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.text}>3. Run the program </Text>
              </View>
              <View style={[styles.row, {justifyContent: "flex-end"}]}>
                <View style={styles.buttonWrapper}>
                  <Button
                    onPress={() => {}}
                    title="Resume"
                    color="blue"
                    accessibilityLabel="Resume Button"
                  />
                </View>
              </View>
            </View>
        </View>
      </View>
    )
  }
}

const iconSize = 40;
const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  panel: {
    width: "70%",
    height: "70%",
    backgroundColor: "blue",
    borderColor: 'white',
    borderWidth: 5,
    borderRadius: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 1,
    shadowColor: 'black',
  },

  wing: {
    flexDirection: "column",
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'gray',
    width: "50%",
    height: "90%",
  },

  row: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },

  divider: {
    borderWidth: 2,
    borderColor: 'white',
    height: '80%',
  },

  image: {
    width: 50,
    height: 50,
  },

  equal: {
    fontSize: iconSize,
    color: 'white',
  },

  buttonWrapper: {
    backgroundColor: 'white',
    borderRadius: 10,
  },

  text: {
    fontSize: 20,
    color: 'white',
    textAlign: 'left',
  }
})
