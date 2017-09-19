import React, { Component } from 'react';
import { Alert, StyleSheet, View, Image, findNodeHandle } from 'react-native';

/**
 * Class that represents a dot in a map.
 */
class Dot extends Component {
  /**
   * Creates a dot
   * @param {string} props.type [empty, filled, monkey, apple]
   * @param {function} props.onDotLayout callback function called when dot is
   *                                     rendered. Used to find out position of
   *                                     the dot that contains monkey.
   */
  constructor(props) {
    super(props)

    this.state = {
      accessible: true
    }
  }

  /**
   * @return {Boolean} return true if monkey can jump to this dot.
   */
  isJumpable() {
    return this.props.type !== 'empty';
  }

  isApple() {
    return this.props.type === 'apple';
  }

  setAccessibility(bool) {
    this.setState({'accessible': bool})
  }

  render() {
    let style = [];

    switch (this.props.type) {
      case 'apple':
        return (
          <View style={styles.dot} accessible={true} accessibilityLabel={'Apple'}>
            <Image style={styles.image} source={require('../resources/icons/apple.png')} />
          </View>
        )
      case 'monkey': //draw filled dot (monkey will be drawn on top by Game class)
      case 'filled':
        style = [styles.dot, styles.filledDot];
        return <View ref={(comp) => this.root = comp} style={style}
          accessible={this.state.accessible} accessibilityLabel={'Filled Dot'} />
      default: //empty case
        style = [styles.dot, styles.emptyDot];
        return <View style={style} accessible={true} accessibilityLabel={'Empty Dot'} />
    }
  }
}

const radius = 18;

const styles = StyleSheet.create({
  dot: {
    width: radius*2,
    height: radius*2,
  },

  emptyDot: {
    borderRadius: radius,
    borderWidth: radius/4,
    backgroundColor: 'transparent',
    borderColor: 'white',
  },

  filledDot: {
    borderRadius: radius,
    borderWidth: radius/4,
    backgroundColor: 'white',
    borderColor: 'black',
  },

  image: {
    flex: 1,
    width: null,
    height: null,
  },
})


export default Dot;
