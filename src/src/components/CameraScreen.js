import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View } from 'react-native';
import Camera from 'react-native-camera';

/**
 * Code derived from <https://github.com/lwansbrough/react-native-camera>
 * TODO add cancel button
 */
export default class CameraScreen extends React.Component {
  /**
   * @param  {function} props.tookPicture callback function that is called when
   *                                      picture is being taken
   */
  constructor(props) {
    super(props)
  }

  /**
   * Function that is called when picture is taken.
   * https://www.sitepoint.com/bind-javascripts-this-keyword-react/
   * ^avoid async call bug
   *
   * @param  {Function} callback callback function that is called when picture
   *                             is taken.
   */
  capture() {
    console.log("capture start");
    const options = {};
    //options.location = ...
    this.camera.capture({metadata: options})
      .then(response => this.props.tookPicture(response.data))
      .catch(err => console.error(err)); // TODO display error message
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          captureTarget={Camera.constants.CaptureTarget.memory}
          aspect={Camera.constants.Aspect.fill}>

          {/* <Text style={styles.capture} onPress={this.capture.bind(this)}>
            [CAPTURE]
          </Text> */}
          <TouchableHighlight onPress={this.capture.bind(this)}>
            <Image source={require('../resources/UI_Components/camera.png')}
              style={styles.capture} />
          </TouchableHighlight>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    padding: 10,
    margin: 40,
  }
});
