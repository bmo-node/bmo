import { expect } from 'chai';

import * as visitorActions from '../../../actions/visitorActions';
import visitorReducer from '../visitorReducer';

describe('visitorReducer', () => {
  it('should return initial state on default action', () => {
    const sampleAction = {
      type: 'test-type',
    };
    const result = visitorReducer(undefined, sampleAction);

    expect(result.name).to.equal('');
  });

  it('should return updated name when sent a valid action', () => {
    const name = 'test-name';
    const sampleAction = {
      type: visitorActions.UPDATE_VISITOR_NAME,
      name,
    };
    const result = visitorReducer(undefined, sampleAction);

    expect(result.name).to.equal(name);
  });
});
