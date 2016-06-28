import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as config from '../src/config';

chai.use(chaiAsPromised);

describe.only('reading runtime config', () => {
  it('should use values in current dir .jira-inforc', () => {
    expect(config.getConfig().username).to.equal('jeremy.greer');
  });
});
