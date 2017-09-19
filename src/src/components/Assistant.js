import React, { Component } from 'react';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback } from 'react-native';
// import Camera from 'react-native-camera'; TODO

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
          onPress={this.openCamera.bind(this)} >
          <View style={styles.button}>
            <Text>Camera</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          accessibilityLabel={'Run Button'}
          onPress={this.props.game.runProgram.bind(this.props.game)} >
          <View style={styles.button}>
            <Text>Run</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: '20%',
    height: '100%',
    // backgroundColor: "#ffeb3b", // yellow
    backgroundColor: "#677fe3", // for debugging
    zIndex: 10, //display assistant on the background
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
