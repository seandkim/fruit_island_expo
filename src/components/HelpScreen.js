import React, { Component } from 'react';
import {
  Button,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback } from 'react-native';
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
        {/* Close Button at top left */}
        <View style={styles.closeWrapper}>
          <View style={styles.closeButton} accessible={true} accessibilityLabel={"Close Button for Help"}>
            <TouchableWithoutFeedback accessible={false} style={{backgroundColor: 'yellow'}} onPress={this.props.close}>
              <FontAwesome name="close" size={iconSize} style={{ color: 'white' }} />
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.wing} accessible={true}
            accessibilityLabel={"Banana is for moving forward, Orange is for rotating counter-clockwise, Apple is for rotating clockwise."}>
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
          <View style={styles.wing} accessible={true}
            accessibilityLabel={"1. Arrange fruits. 2. Take a picture of the fruits. 3. Run the program."}>
              <View style={styles.row}>
                <Text style={styles.text}>1. Arrange fruits </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.text}>2. Take a picture </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.text}>3. Run the program </Text>
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

  text: {
    fontSize: 20,
    color: 'white',
    textAlign: 'left',
  },

  closeWrapper: {
    zIndex: 10,
    width: '70%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  closeButton: {
    width: iconSize*1.3,
    height: iconSize*1.3,
    borderRadius: iconSize*1.3/2,
    position: 'absolute',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    // to place on the corner
    transform: [
      { translateX: -iconSize/3 },
      { translateY: -iconSize/3 }
    ],

    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowColor: 'black',
    shadowRadius: 2,
  }
})
