import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

export default class CommandPanel extends Component {
  // {-1: rotate left, 0: move forward, 1: rotate right}
  // must pass in unique key
  getIcon(command, key) {
    path = "";
    label = "";

    switch (command) {
      case -1:
        path = require('../resources/UI_Components/turn_left.png');
        label = "Turn Left";
        break;
      case 0:
        path = require('../resources/UI_Components/go.png')
        label = "Move Forward";
        break;
      case 1:
        path = require('../resources/UI_Components/turn_right.png')
        label = "Turn Right";
        break;
    }

    return <Image style={styles.icon} key={key}
      accessible={true} accessibilityLabel={label} source={path} />
  }

  render() {
    const icons = this.props.commands.map(
      (command, i) => this.getIcon(command, i)
    )

    return (
      <View style={styles.panelWrapper}>
        {icons}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  panelWrapper: {
    width: "100%",
    height: "20%",
    backgroundColor: "blue",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  icon: {
    marginLeft: 10,
    marginRight: 10,
  }
})
