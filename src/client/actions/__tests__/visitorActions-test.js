import { expect } from 'chai';
import * as visitorActions from '../visitorActions';

describe('visitorActions', () => {
  describe('updateVisitorName', () => {
    it(`should dispatch ${visitorActions.UPDATE_VISITOR_NAME} successfully when updateVisitorName is called with a valid name`, () => {
      const nameParam = 'test-name';
      const dispatchObj = visitorActions.updateVisitorName(nameParam);

      expect(dispatchObj.type).to.equal(visitorActions.UPDATE_VISITOR_NAME);
      expect(dispatchObj.name).to.equal(nameParam);
    });

    it(`should dispatch ${visitorActions.UPDATE_VISITOR_NAME} successfully with a blank name when updateVisitorName is called without a valid name`, () => {
      const dispatchObj = visitorActions.updateVisitorName();

      expect(dispatchObj.type).to.equal(visitorActions.UPDATE_VISITOR_NAME);
      expect(dispatchObj.name).to.equal('');
    });
  });
});
