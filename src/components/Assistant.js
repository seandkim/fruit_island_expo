import React, { Component } from 'react';
import {
  Alert,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback } from 'react-native';
import { ImagePicker } from 'expo';
import { FontAwesome } from '@expo/vector-icons';

/**
 * This is a black sidebar displayed on the right. Controls the execution
 * of the game.
 * @type {[type]}
 */
class Assistant extends Component {
  /**
   * @param  {object} props.game Game it is running in.
   */
  constructor(props) {
    super(props)

    this.currentCommands = null // result of parsing most recent picture
  }

  runButtonPressed() {
    const commands = this.props.game.state.currentCommands
    if (!commands || commands.length == 0) {
      this.props.game.speakText("You need to take a picture first")
    } else {
      // TODO want to change to playSound('monkey') but audio gets mixed up
      this.props.game.runProgram(commands)
    }
  }

  solvePhase() {
    const commands = (this.props.game.getCurrentStage())['solution']
    this.props.game.runProgram(commands)
  }

  displayHelp() {
    // TODO should it speak instructions?
    this.props.game.setState({helpScreen: true})
  }

  render() {
    return (
      <View style={styles.wrapper} >
        <View accessible={true} accessibilityLabel={'Camera Button'}>
          <TouchableWithoutFeedback onPress={this.openCamera} >
            <FontAwesome name="camera" size={iconSize} style={{ color: 'white' }} />
          </TouchableWithoutFeedback>
        </View>
        <View accessible={true} accessibilityLabel={'Run Button'}>
          <TouchableWithoutFeedback onPress={this.runButtonPressed.bind(this)} >
            <FontAwesome name="play" size={iconSize} style={{ color: 'white' }} />
          </TouchableWithoutFeedback>
        </View>
        <View accessible={true} accessibilityLabel={'Solve Button'}>
          <TouchableWithoutFeedback onPress={this.solvePhase.bind(this)} >
            <FontAwesome name="key" size={iconSize} style={{ color: 'white' }} />
          </TouchableWithoutFeedback>
        </View>
        <View accessible={true} accessibilityLabel={'Help Button'}>
          <TouchableWithoutFeedback onPress={this.displayHelp.bind(this)} >
            <FontAwesome name="question" size={iconSize} style={{ color: 'white' }} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }

  openCamera = async () => {
      let result = await ImagePicker.launchCameraAsync({
        base64: true,
      });

      if (!result.cancelled) {
        this.props.game.setState({loading: true})
        this.props.game.speakText("Detecting fruits. Please Wait")

        console.log("sending POST call");
        var formData = new FormData();
        formData.append('file', result.base64);
        // make API call to amazon
        var root = 'http://ec2-54-165-118-145.compute-1.amazonaws.com:8080/classify/api';
        fetch(root, {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            body: formData
        })
        .then(function(responseJson) {
            console.log("Post method was successful", responseJson);
            // replace single quote to double quote to interpret as json
            const results = JSON.parse(responseJson._bodyText.replace(/\'/g, "\""))

            var fruits = []
            for (var i = 0; i < results.length; i++) {
              fruits.push(results[i]["label"])
            }

            this.props.receivedPostResult(fruits, "")
        }.bind(this))

        .catch(function(error) {
            console.log("Post method returned error", error)
            this.props.receivedPostResult([], error)
        }.bind(this));
      } else {
        // Pressed 'Cancel' at Camera Screen
      }
    };
}

const iconSize = 40;
const styles = StyleSheet.create({
  wrapper: {
    width: '20%',
    height: '100%',
    backgroundColor: "black",
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  button: {
    borderWidth: 3,
    borderColor: 'black',
    width: 50,
    height: 50,
    backgroundColor: 'gray',
  }
})

export default Assistant;
