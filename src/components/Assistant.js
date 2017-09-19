import React, { Component } from 'react';
import {
  Alert,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback } from 'react-native';
import { ImagePicker } from 'expo';

class Assistant extends Component {
  /**
   * Creates voice assistant that executes the game.
   * @param  {object} props.game Game it is running in.
   */
  constructor(props) {
    super(props)

    this.currentCommands = null // result of parsing most recent picture
  }

  ask(s) {
    // TODO case on s
    this.speakText("What can I help you with?")
    const response = this.listenForSpeech()
    return response
  }

  speakText(s) {
    // TODO need to eject for speech to work?
    // https://github.com/naoufal/react-native-speech
    console.log("Spoke", s)

  }

  // TODO is this necessary?
  speakError(s) {
    Alert.alert(s)
  }

  listenForSpeech(s) {
    Alert.alert(
      null,
      "What can I help you with?",
      [
        {text: 'Take Picture', onPress: this.props.takePhoto},
        {text: 'Run Program', onPress: this.props.runProgram},
        {text: 'Cancel'},
      ],
      { cancelable: false }
    )

    return null
  }

  // Activate voice assistant when screen pressed during the game
  startVoiceAssistant() {
    const response = this.ask("What can I help you with?")
    // TODO currently below is NOT executed. Alert was async so i passed in
    // callback function. When changing to real voice assistant, make sure it works
    if (response === "take picture") {
      this.props.game.takePicture()
    } else if (response === "run program") {
      this.props.game.runProgram()
    }
  }

  openCamera() {
    this.props.game.setState({cameraOn: true})
  }

  render() {
    return (
      <View style={styles.wrapper} accessibilityLabel={'Voice Assistant'}>
        <TouchableWithoutFeedback
          accessibilityLabel={'Camera Button'}
          onPress={this.openCamera} >
          <Image source={require('../resources/UI_Components/camera.png')}/>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          accessibilityLabel={'Run Button'}
          onPress={this.props.game.runProgram.bind(this.props.game)} >
          <Image source={require('../resources/UI_Components/play_white.png')}/>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  openCamera = async () => {
    console.log("Opened Camera")
      let result = await ImagePicker.launchCameraAsync({
        base64: true,
      });

      if (!result.cancelled) {
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
      }
    };
}

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
