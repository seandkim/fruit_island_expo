import React from 'react';
import { Button, Image, View } from 'react-native';
import { ImagePicker } from 'expo';

export default class CameraScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      imageURI: null,
    };
  }

  render() {
    console.log("render start", this.state)
    var root = 'http://ec2-54-165-118-145.compute-1.amazonaws.com:8080/classify/api';
    let { imageURI } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Pick an image from camera roll1"
          onPress={this._pickImage}
        />
        {imageURI &&
          <Image source={{ uri: imageURI }} style={{ width: 200, height: 200 }} />}
      </View>
    );
  }

  _pickImage = async () => {
    console.log("pickImage start")
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
              console.log("SUCCESS!!!", responseJson);
          }.bind(this))
          .catch(function(error) {
              console.log("ERROR!!!", error)
          }.bind(this));

          console.log("end of pickImage")
          this.setState({ imageURI: result.uri});
      }
    };
}
