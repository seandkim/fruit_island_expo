import React, { Component } from 'react';
import {
  Alert,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback } from 'react-native';
import {
  ImagePicker,
  Speech,
} from 'expo';
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

  speakText(text) {
    Speech.speak(text)
  }

  openCamera() {
    this.props.game.setState({cameraOn: true})
  }

  displayHelp() {

  }

  render() {
    return (
      <View style={styles.wrapper} accessibilityLabel={'Voice Assistant'}>
        <TouchableWithoutFeedback
          accessibilityLabel={'Camera Button'}
          onPress={this.openCamera} >
          {/* TODO change to font awesome icon */}
          <FontAwesome name="camera" size={iconStyle} style={{ color: 'white' }} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          accessibilityLabel={'Run Button'}
          onPress={this.props.game.runProgram.bind(this.props.game)} >
          <FontAwesome name="play" size={iconStyle} style={{ color: 'white' }} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          accessibilityLabel={'Help Button'}
          onPress={this.displayHelp} >
          <FontAwesome name="question" size={iconStyle} style={{ color: 'white' }} />
        </TouchableWithoutFeedback>
      </View>
    )
  }

  openCamera = async () => {
      this.speakText("Opening Camera.")

      let result = await ImagePicker.launchCameraAsync({
        base64: true,
      });

      if (!result.cancelled) {
        this.props.game.setState({loading: true})
        this.speakText("Detecting fruits. Please Wait")

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
        this.speakText("Cancelled.")
      }
    };
}

const iconStyle = 40;
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
