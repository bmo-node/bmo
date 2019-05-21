import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import visitorReducer from './visitorReducer';

export default combineReducers({
  visitor: visitorReducer,
  routing: routerReducer,
});
