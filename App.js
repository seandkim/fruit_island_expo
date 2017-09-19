import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './src/reducers';
import Game from './src/components/Game';
import CameraScreen from './src/components/CameraScreen';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.sounds = this.loadSounds()
  }

  loadSounds() {
    const paths = {
      'monkey': require('./src/resources/sounds/monkey.wav'),
      'success': require('./src/resources/sounds/stage_clear.mp3'),
      'fail': require('./src/resources/sounds/stage_fail.wav'),

      'jump': require('./src/resources/sounds/jump.wav'),
      'turn_left': require('./src/resources/sounds/turn_left.mp3'),
      'turn_right': require('./src/resources/sounds/turn_right.wav'),
    }

    let sounds = {}
    for (let action in paths) {
      const soundObject = new Expo.Audio.Sound();
      try {
        // TODO change to await somehow. Currently it raises "await is a
        // reserved word" error. This works just because audio is played
        // some time after it is loaded (when commands are being executed)
        soundObject.loadAsync(paths[action]);
      } catch (error) {
      }

      sounds[action] = soundObject
    }

    return sounds
  }

  render() {
    // initial state
    const init = {
      "currentStageIdx": 0,
    }

    return (
      <Provider store={createStore(reducers, init)}>
        <View style={styles.container}>
          <Game sounds={this.sounds}/>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
