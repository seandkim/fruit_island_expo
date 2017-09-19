import React from 'react';
import { Button, Image, Text, View } from 'react-native';
import { ImagePicker } from 'expo';

export default class CameraScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fruits: "hi",
    }
  }

  render() {
    console.log("render start", this.state)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Pick an image from camera roll1"
          onPress={this._pickImage}
        />
        <Text>{this.state.fruits}</Text>
      </View>
    );
  }

  _pickImage = async () => {
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
              console.log("SUCCESS!!!", responseJson);
              // replace single quote to double quote to interpret as json
              const results = JSON.parse(responseJson._bodyText.replace(/\'/g, "\""))

              var fruits = []
              for (var i = 0; i < results.length; i++) {
                fruits.push(results[i]["label"])
              }
              console.log(fruits)

              this.setState({ 'fruits' : fruits })
          }.bind(this))

          .catch(function(error) {
              console.log("ERROR!!!", error)
          }.bind(this));
      }
    };
}
