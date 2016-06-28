import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as app from '../src';

chai.use(chaiAsPromised);

describe('getting info for a single issue', () => {
  describe('when looking up by issue code', () => {
    it('should give you what you want', (done) => {
      app.getInfoByIssueId('CF-24371').then(
        info => {
          expect(info.fields).to.have.property('assignee');
          expect(info.fields).to.have.property('status');
          expect(info.fields).to.have.property('description');
          done();
        },
        done
      ).catch(done);
    });
  });
});
