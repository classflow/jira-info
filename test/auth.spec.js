import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { getAuthHeader, setCredentials } from '../src/auth';

chai.use(chaiAsPromised);

describe('auth', () => {
  describe('getAuthHeader', () => {
    describe('when credentials are not set', () => {
      it('should return null', () => {
        setCredentials();
        expect(getAuthHeader()).to.equal(null);
      });
    });

    describe('when credentials have been set', () => {
      it('should return expected basic auth header', () => {
        const username = 'user';
        const password = 'pwrd';
        const base64 = new Buffer(`${username}:${password}`).toString('base64');
        const expected = `Basic ${base64}`;

        setCredentials(username, password);
        expect(getAuthHeader()).to.equal(expected);
      });
    });
  });
});
