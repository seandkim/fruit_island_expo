import React, { Component } from 'react';
import {
  Alert,
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
import Camera from './Camera';
import stage0 from '../resources/stages/stage0.json';
import stage1 from '../resources/stages/stage1.json';
import stage2 from '../resources/stages/stage2.json';
import stage3 from '../resources/stages/stage3.json';
import stage4 from '../resources/stages/stage4.json';
import TimerMixin from 'react-timer-mixin';

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
      cameraOn: false,
      currentCommands: null // stores parsed result of latest photo taken
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
   * Callback function that is called when picture is taken
   * TODO set cameraOn to false first, then display loading screen
   * @param  {[type]} data [description]
   */
  tookPicture(data) {
    console.log("tookPicture start", data, this)

    // TODO delete. for faster demonstration without api call
    const results = ['banana', 'apple', 'apple']; // TODO change to real results
    this.currentCommands = results;
    Alert.alert("Results are " + results) // TODO change to voice assistant. Right now, async call results in undefined this.assistant
    this.setState({cameraOn: false, currentCommands: results})

    // var root = 'https://jsonplaceholder.typicode.com';
    // fetch(root + '/posts/1', {
    //         method: 'GET',
    //         headers: {
    //           'Accept': 'application/json',
    //           'Content-Type': 'application/json',
    //         }
    //         // body: JSON.stringify({
    //         //   firstParam: 'yourValue',
    //         //   secondParam: 'yourOtherValue',
    //         // })
    //       })
    //   .then(function(responseJson) {
    //     console.log("Success: API call returned", responseJson);
    //     const results = ['banana', 'apple', 'apple']; // TODO change to real results
    //     this.currentCommands = results;
    //     Alert.alert("Results are " + results) // TODO change to voice assistant. Right now, async call results in undefined this.assistant
    //     this.setState({cameraOn: false, currentCommands: results})
    //   }.bind(this))
    //   .catch(function(error) {
    //     console.error(error);
    //     Alert.alert("Error: Could not connect to the server. Please check your internet connection")
    //     this.setState({cameraOn: false})
    //   });
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

    // check if reached apple or dead-end
    if (monkeyDot.isApple()) {
      // display 'success' if there are leftover stages. Display 'finished'
      // if all stages are completed
      // setTimeout allows the screen to be loaded after the user has time to
      // see that the monkey reached the apple
      console.log("reached apple")
      // setTimeout(() => this.props.stageClear("success"), this.moveIntvl)

      setTimeout(() => this.setState({
        currentCommands: null,
        gameStatus: this.stages.length === this.state.stageIdx+1 ? 'finished' : 'success'
      }), this.moveIntvl)

    } else if (!monkeyDot.isJumpable()) {
      setTimeout(() => {
        Alert.alert("jumped to empty dot!") // TODO delete
        this.props.stageClear("failure")
      }, this.moveIntvl)
      return false
    }
    return true
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
    switch (command) {
      case -1: // rotate counter-clockwise
        this.monkey.rotate(false)
        return true
      case 1: // rotate clockwise
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
        return this.setMonkeyPosition(rowIdx, colIdx)
    }
  }

  runProgram() {
    console.log("runProgram start", this.state.currentCommands)
    if (!this.state.currentCommands) {
      this.assistant.speakError("You need to take a picture first")
    } else {
      this.assistant.speakText("Running program...")

      const commands = (this.getCurrentStage())['solution'] // TODO switch to this.currentCommands

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
        // stop interval if there are no more commands / move was unsuccessful
        if (command == null || !res) {
          clearInterval(id)
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
      onPress=(() => this.setState({gameStatus: 'started', stageIdx: 0}))
      break
    case 'fail':
      path=require('../resources/screens/failed.jpg')
      onPress=(() => this.setState({gameStatus: 'started'}))
      break
    case 'success':
      path=require('../resources/screens/success.jpg')
      onPress=(() => {
        this.setState({
        gameStatus: 'started',
        stageIdx: this.state.stageIdx+1
      })})
      break;
    case 'finished': // reset the game
      path=require('../resources/screens/final.jpg')
      onPress=(() => this.setState({gameStatus: 'intro'}))
      break;
    default:
      throw ("Unrecognizable game status: " + this.gameStatus)
    }

    return (
      <TouchableHighlight style={styles.gameWrapper} onPress={onPress}>
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

  renderCommands() {
    return (
      <View style={styles.commandsWrapper}>

      </View>
    )
  }

  render() {
    if (this.state.cameraOn) {
      return <Camera tookPicture={this.tookPicture.bind(this)}/>
    }

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

            <CommandPanel />
          </View>

          {/* Touchable are accessible by default, so need to be siblings of
            dots to avoid accessibility conflicts. */}
          {/* TODO delete callback functions */}
          <Assistant ref={(ref)=>this.assistant=ref} game={this} />
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
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  gameWrapper: {
    // backgroundColor: "#ffeb3b", //yellow
    backgroundColor: "rgb(193, 1, 99)",
    width: "80%",
    height: "100%",
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  screenWrapper: {
    width: "100%",
    height: "100%",
  },

  dotsWrapper: {
    backgroundColor: "#ffeb3b", //yellow
    width: "100%",
    height: "80%",
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
})

const mapStateToProps = (state, ownProps) => {
  return { currentStageIdx: state.currentStageIdx }
}

export default connect(mapStateToProps, actions)(Game);
