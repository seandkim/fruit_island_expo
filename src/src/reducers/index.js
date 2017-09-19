import { combineReducers } from 'redux';
import StageReducer from './StageReducer';


export default combineReducers({
  currentStageIdx: StageReducer
  // currentCommands: CommandReducer
});
