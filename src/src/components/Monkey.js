import React, { Component } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';

/**
 * Class that represents Monkey
 *
 * TODO animate arrow
 * TODO play audio when moving
 * https://facebook.github.io/react-native/docs/animations.html
 */
class Monkey extends Component {
  /**
   * Creates monkey and arrow.
   * direction, left, top, radius are saved as state so that it re-renders every
   * time monkey needs to move or change direction. Thus, one should access these
   * fields through state NOT props
   * @param  {string} props.direction ['up', 'down', 'left', 'right']; arrow is
   *                                  rendered according to the specified direction.
   * @param  {number} props.left x position of the dot monkey is placed on
   * @param  {number} props.top y position of the dot monkey is placed on
   * @param  {number} props.radius width of the dot monkey is placed on
   */
  constructor(props) {
    super(props)

    this.dirOrder = ['up', 'right', 'down', 'left']

    this.state = {
      direction: this.props.direction,
      left: null,
      top: null,
      radius: this.props.radius,
    }
  }

  getDirection() {
    return this.state.direction
  }

  moveTo(left, top) {
    const duration = 500
    if (this.state.left == null && this.state.top == null) {
      this.setState({
        left: new Animated.Value(left),
        top: new Animated.Value(top),
      })
    } else {
      // if monkey hasn't been placed yet, do not animated
      Animated.timing(this.state.left, {toValue: left, duration: duration}).start()
      Animated.timing(this.state.top, {toValue: top, duration: duration}).start()
    }
  }

  /**
   * rotate the monkey to specified direction
   * @param  {boolean} turnClockwise true if rotating clockwise, false if rotating
   *                               counterclockwise
   */
  rotate(turnClockwise) {
    let dirIdx = this.dirOrder.indexOf(this.state.direction)
    if (dirIdx == -1) {
      throw (this.state.direction + " is not in this.dirOrder")
    }

    if (turnClockwise) {
      dirIdx += 1
    } else {
      dirIdx -= 1
    }

    this.setState({direction: this.dirOrder[dirIdx]})
  }

  renderArrow(direction) {
    const radius = this.state.radius
    const arrowSize = radius
    const gap = 5 // gap between monkey and arrow

    const arrowStyle = {
      position: 'absolute',
      width: arrowSize/2,
      height: arrowSize,
    }

    let dirStyle;
    switch (direction) {
    case 'right':
      dirStyle = {
        top: radius-arrowSize/2,
        left: radius*2+gap,
      }
      break
    case 'down':
      dirStyle = {
        top: radius*2,
        left: radius-arrowSize/4,
        transform: [
          {rotate: '90deg'},
        ],
      }
      break
    case 'left':
      dirStyle = {
        top: radius-arrowSize/2,
        left: -gap-arrowSize/2,
        transform: [
          {rotate: '180deg'},
        ],
      }
      break
    case 'up':
      dirStyle = {
        top: -gap-3*arrowSize/4,
        left: radius-arrowSize/4,
        transform: [
          {rotate: '270deg'},
        ],
      }
      break
    default:
      throw ("Unrecognizable direction: " + direction)
    }

    return (
      <View style={[arrowStyle, dirStyle]}>
        <Image style={styles.arrow} source={require('../resources/icons/direction.png')} />
      </View>
    )
  }

  render() {
    const label = "Monkey. Currently facing " + this.state.direction
    const monkeyWrapperStyle = [styles.monkeyWrapper,
                {left: this.state.left, top: this.state.top},
                {width: this.state.radius*2, height: this.state.radius*2}]

    return (
      <Animated.View style={monkeyWrapperStyle} accessible={true} accessibilityLabel={label}>
        {this.renderArrow(this.getDirection())}
        <Image style={styles.monkey} source={require('../resources/icons/monkeyface.png')} />
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  monkeyWrapper: {
    position: 'absolute',
    zIndex: 100, //allow monkey to be displayed on top of dot
  },

  monkey: {
    display: 'flex',
    flex: 1,
    width: null,
    height: null,
  },

  arrow: {
    display: 'flex',
    flex: 1,
    width: null,
    height: null,
  },
})

export default Monkey;
