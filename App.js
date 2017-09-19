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
  }

  render() {
    // initial state
    const init = {
      "currentStageIdx": 0,
    }

    return (
      // <Provider store={createStore(reducers, init)}>
      //   <View style={styles.container}>
      //     <Game/>
      //   </View>
      // </Provider>
      <CameraScreen />
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
