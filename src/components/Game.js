import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  UIManager,
  View,
  findNodeHandle } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Dot from './Dot';
import Monkey from './Monkey';
import Assistant from './Assistant';
import CommandPanel from './CommandPanel';
import CameraScreen from './CameraScreen';
import HelpScreen from './HelpScreen';
import stage0 from '../resources/stages/stage0.json';
import stage1 from '../resources/stages/stage1.json';
import stage2 from '../resources/stages/stage2.json';
import stage3 from '../resources/stages/stage3.json';
import stage4 from '../resources/stages/stage4.json';
import TimerMixin from 'react-timer-mixin';

import { Audio } from 'expo';

/**
 * Main controller class. interaction with voice assistant and the map.
 * To add a stage, you must import the stage json file and add to this.stages.
 *
 * To turn on the camera, you need to call setState({cameraOn: true})
 *
 * TODO I need a way to reset the game status when stage is cleared. ex) set currentCommands to null
 */
class Game extends Component {
  constructor(props) {
    super(props)
    this.dots = {} // keeps reference to all dots so that monkey can be drawn
    this.monkeyIdx = {}
    this.moveIntvl = 1000 // interval between each move of the monkey

    // TODO for safety run a function to check validity of each map before adding
    this.stages = [stage1, stage2, stage3, stage3, stage4]

    this.state = {
      stageIdx: 0,
      // TODO add loading status when waiting for async results
      gameStatus: "started", // intro, started, fail, success, finished
      currentCommands: [], // stores parsed result of latest photo taken
      loading: false, // displays the loading icon and disables all buttons
      helpScreen: false, // displays the help screen
    }
  }

  // this.props.sounds is a dictionary of action => Expo.Audio.Sound object
  // see loadSounds() in App.js to see what actions are possible
  playSound(action) {
    try {
      this.props.sounds[action].playAsync();
      this.props.sounds[action].setPositionAsync(0);
    } catch (err) {
      console.log("Could not play", action)
    }
  }

  getCurrentStage() {
    return this.stages[this.state.stageIdx]
  }

  getMonkeyDot() {
    return this.dots['dot'+this.monkeyIdx.rowIdx+this.monkeyIdx.colIdx]
  }

  withinBound(rowIdx, colIdx) {
    const stage = this.getCurrentStage()
    const numRow = stage.map.length
    const numCol = stage.map[0].length
    return 0 <= rowIdx && rowIdx < numRow && 0 <= colIdx && colIdx < numCol
  }

  /**
   * reads the stageMap number
   * @param  {number} num number between 0~3
   * @return {string} 0 => empty, 1 => filled, 2 => monkey, 3 => apple
   * @throws error when num is not between 0~3
   */
  num2type(num) {
    switch (num) {
      case 0:
        return 'empty';
      case 1:
        return 'filled';
      case 2:
        return 'monkey';
      case 3:
        return 'apple';
      default:
        throw ("Unknown number read from the map: " + typeNum)
    }
  }

  /**
   * Callback function that is called when post method (fruit detection) returns
   * result.
   * @param  {string[]} fruits list of either ["banana", "orange", "apple"]
   * @param  {string}   error
   * @return {[type]}        [description]
   */
  receivedPostResult(fruits, error) {
    console.log("receivedPostResult", fruits, error)

    if (error != "") {
      this.assistant.speakText("Could not connect to server. Double check your network connection.")
      Alert.alert("Could not connect to server. Double check your network connection.") //TODO delete?
    } else {
      if (fruits.length == 0) {
        this.assistant.speakText("I could not find any fruits. Please try again.")
      } else {
        this.assistant.speakText("You entered " + fruits.join())
      }

      let commands = []
      for (var i = 0; i < fruits.length; i++) {
        let command;
        switch (fruits[i]) {
          case "banana":
          command = 0;
          break;
          case "orange":
          command = -1;
          break;
          case "apple":
          command = 1;
          break;
        }

        commands.push(command)
      }

      // set command for both game and command panel.
      this.setState({currentCommands: commands, loading: false})
    }
  }

  /**
   * Move monkey to the dot at rowIdx, colIdx. If monkey jumps out of bound or
   * to an empty dot, display 'fail' screen. If monkey jumps to the apple,
   * display 'success' screen.
   *
   * @param  {number} rowIdx row index of the dot
   * @param  {number} colIdx column index of the dot
   * @return {boolean} false if jumped out of bound or to empty dot; true otherwise
   */
  setMonkeyPosition(rowIdx, colIdx) {
    // check within bound
    if (!this.withinBound(rowIdx, colIdx)) {
      setTimeout(() => {
        Alert.alert("cannot jump out of the map!") // TODO speak this text?
        this.setState({gameStatus: 'fail'})
      }, this.moveIntvl)
      return false
    }

    // turn on accessibility of the old dot
    const oldMonkeyDot = this.getMonkeyDot()
    oldMonkeyDot.setAccessibility(true)

    // turn off accessibility of the new dot. This allows monkey to be accessible
    // instead of the dot it sits on
    this.monkeyIdx = {rowIdx: rowIdx, colIdx: colIdx}
    const monkeyDot = this.getMonkeyDot()
    monkeyDot.setAccessibility(false)

    // update position of the monkey
    UIManager.measure(
      findNodeHandle(monkeyDot),
      (x,y,width,height,pageX,pageY) => {
        try {
          this.monkey.moveTo(pageX, pageY)
          this.monkey.setState({'radius': width/2})
        } catch (e) {
          // findNodeHandle is executed as a timeout callback, so it may be
          // called after the stage is completed. If it does, this.monkey is
          // undefined so try statement above raises exception.
        }
      }
    )

    // if this returns false, calling function should end the round
    return monkeyDot.isJumpable()
  }

  /**
   * move the monkey by applying the command. This function is fired consistently
   * in interval. Thus, if the stage completes with success/fail, you must stop
   * calling this function (this.monkey is undefined). This can be done using
   * clearInterval(id)
   * @param  {number} command {-1: rotate left, 0: move forward, 1: rotate right}
   * @return {boolean} true if move was successful; false otherwise
   */
  moveMonkey(command) {
    try {
      switch (command) {
      case -1: // rotate counter-clockwise
        this.playSound('turn_left')
        this.monkey.rotate(false)
        return true
      case 1: // rotate clockwise
        this.playSound('turn_right')
        this.monkey.rotate(true)
        return true
      case 0:
        const {rowIdx, colIdx} = this.monkeyIdx
        switch (this.monkey.getDirection()) {
          case 'up':
            rowIdx -= 1
            break
          case 'down':
            rowIdx += 1
            break
          case 'left':
            colIdx -= 1
            break
          case 'right':
            colIdx += 1
            break
        }
        this.playSound('jump')
        return this.setMonkeyPosition(rowIdx, colIdx)
      }
    } catch (err) {
      // TODO this.monkey.getDirection raises an error if the stage ends early.
      // try/except statement is quick way around, but we should prevent this
      // function to be called if stage ends early.
      console.log(err, "need to fix this. See moveMonkey function in Game.js")
    }
  }

  runProgram(commands) {
    if (!commands || commands.length == 0) {
      // this should be done when this function is called in Assistant.js
    } else {
      // pass in command to move the monkey in intervals. The verbosity is due
      // to the fact that you can't pass in different argument to setInterval
      // function
      let commandIdx = -1;
      const getCommand = (() => {
        commandIdx += 1
        if (commandIdx < commands.length) {
          return commands[commandIdx]
        } else { // return -1 if no more commands
          return null
        }
      })

      let id = setInterval(function() {
        const command = getCommand() // get & increment the idx
        let res = false;
        if (command != null) {
          res = this.moveMonkey(command)
        }

        // reached apple in the middle
        // TODO if we want to enforce that they reach apple at the END of commands,
        // remove `command == null`.
        if (command == null && this.getMonkeyDot().isApple()) {
          console.log("success case")
          clearInterval(id)

          // display 'success' if there are leftover stages. Display 'finished'
          // if all stages are completed
          // setTimeout allows the screen to be loaded after the user has time to
          // see that the monkey reached the apple
          setTimeout(() => this.setState({
            gameStatus: this.stages.length === this.state.stageIdx+1 ? 'finished' : 'success'
          }), this.moveIntvl)

        // stop interval if there are no more commands / move was unsuccessful
        } else if (command == null || !res) {
          console.log("failure case")
          clearInterval(id)

          setTimeout(() => this.setState({gameStatus: 'fail'}), this.moveIntvl);
        }
      }.bind(this), this.moveIntvl)
    }
  }

  ///////////////////////////////////
  ///////// Render Function /////////
  ///////////////////////////////////
  renderScreen(status) {
    let path, onPress;
    switch (status) {
    case 'intro':
      path=require('../resources/screens/intro.png')
      onPress=(() => this.setState({
        gameStatus: 'started',
        stageIdx: 0,
        currentCommands: []
      }))
      break
    case 'fail':
      this.playSound('fail')
      path=require('../resources/screens/failed.jpg')
      onPress=(() => this.setState({
        gameStatus: 'started',
        currentCommands: []
      }))
      break
    case 'success':
      this.playSound('success')
      path=require('../resources/screens/success.jpg')
      onPress=(() => {
        this.setState({
        gameStatus: 'started',
        stageIdx: this.state.stageIdx+1,
        currentCommands: []
      })})
      break;
    case 'finished': // reset the game
      this.playSound('success')
      path=require('../resources/screens/final.jpg')
      onPress=(() => this.setState({gameStatus: 'intro'}))
      break;
    default:
      throw ("Unrecognizable game status: " + this.gameStatus)
    }

    return (
      <TouchableHighlight style={styles.wholeWrapper} onPress={onPress}>
        <Image style={styles.screenWrapper} source={path}/>
      </TouchableHighlight>
    )
  }

  /**
   * read the map and returns a list of dot components
   * monkey is NOT rendered here.
   * @param  {int[][]} stageJson json file of the stage
   */
  renderDots(stageJson) {
    const stage = stageJson["map"]
    //TODO: control the constant (android)
    const gap = 80;
    const dots = [];

    for (var rowIdx=0; rowIdx<stage.length; rowIdx++) {
      let row = []

      for (var colIdx=0; colIdx<stage[rowIdx].length; colIdx++) {
        const type = this.num2type(stage[rowIdx][colIdx]);
        const position = {top: gap*rowIdx, left: gap*colIdx}

        if (type === 'monkey') {
          // save monkey's position
          this.monkeyIdx = {rowIdx: rowIdx, colIdx: colIdx}
        }

        const ri = rowIdx
        const ci = colIdx

        // render each dot
        row.push(<Dot ref={(ref) => this.dots['dot'+ri+ci]=ref}
          type={type} key={colIdx}/>)
      }

      dots.push(row)
    }

    return (
      <View style={styles.dotsWrapper}>
        {dots.map((row, i) => (
          <View style={styles.rowWrapper} key={i}>{row}</View>
        ))}
      </View>
    );
  }

  render() {
    // game playing in progress
    if (this.state.gameStatus === 'started') {
      // to place monkey on the dot, must wait for dots to get rendered
      setTimeout((() => {
        const { rowIdx, colIdx } = this.monkeyIdx //starting position
        this.setMonkeyPosition(rowIdx, colIdx)
      }).bind(this))

      return (
        <View style={styles.wholeWrapper}>
          <View style={styles.gameWrapper}>
            {/* left/top/radius should be specified in renderMonkey() */}
            <Monkey ref={(ref)=>this.monkey=ref}
              direction={this.getCurrentStage()['direction']} radius={0}/>
            {/* dots  */}
            {this.renderDots(this.getCurrentStage())}

            <CommandPanel commands={this.state.currentCommands} />
          </View>

          {/* Touchable are accessible by default, so assistant need to be siblings of
            dots to avoid accessibility conflicts. */}
          <Assistant ref={(ref)=>this.assistant=ref} game={this}
          receivedPostResult={this.receivedPostResult.bind(this)}/>

          {/* loading icon */}
          {this.state.loading &&
            <View style={styles.loadingWrapper}>
              <ActivityIndicator
                animating = {true}
                size = "large"
              />
            </View>}

          {/* help screen */}
          {this.state.helpScreen &&
            <HelpScreen close={() => {
              this.assistant.speakText("Closing Help Screen")
              this.setState({helpScreen: false})
            }}/>
          }
        </View>
      )
    // if game is not being played & need to show specific page
    } else {
        return this.renderScreen(this.state.gameStatus)
    }
  }
}

const styles = StyleSheet.create({
  wholeWrapper: {
    backgroundColor: "#ffeb3b", //yellow
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  gameWrapper: {
    width: "80%",
    height: "100%",
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  // when displaying image for intro, success, fail, etc
  screenWrapper: {
    width: "100%",
    height: "100%",
  },

  dotsWrapper: {
    width: "90%",
    height: "75%", // creates a small padding on the top.
                   // To get rid of it, change height to 80%
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignContent: 'center',
    zIndex: 15,
  },

  rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: "100%",
  },

  loadingWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
})


const mapStateToProps = (state, ownProps) => {
  return { currentStageIdx: state.currentStageIdx }
}

export default connect(mapStateToProps, actions)(Game);
