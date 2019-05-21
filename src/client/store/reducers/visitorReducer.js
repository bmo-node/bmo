import { UPDATE_VISITOR_NAME } from '../../actions/visitorActions';

const initialState = {
  name: '',
};

const visitorReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_VISITOR_NAME:
      return {
        ...state,
        name: action.name,
      };
    default:
      return { ...state };
  }
};

export default visitorReducer;
