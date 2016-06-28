import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { logout, getAuthHeader, setCredentials } from '../src/auth';

chai.use(chaiAsPromised);

describe('auth', () => {
  describe('getAuthHeader', () => {
    describe('when credentials are not set', () => {
      it('should return null', () => {
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

// describe('authentication', () => {
//   describe('before authenticating', () => {
//     beforeEach((done) => {
//       app.logout().then(() => done());
//     });
//
//     describe('calling any method', () => {
//       it('should reject, instructing you to authenticate', (done) => {
//         app.getInfoByIssueId('xxx').then(
//           () => {
//             done(new Error('should have rejected'));
//           },
//           err => {
//             expect(err.message).to.equal('Please authenticate.');
//             done();
//           }
//         ).catch(done);
//       });
//     });
//
//     describe.only('providing credentials', () => {
//       describe('when credentials are good', () => {
//         it('should create a new auth header for you', () => {
//
//         });
//       });
//     });
//   });
//
//
//   describe('when providing correct credentials', () => {
//     it('should authenticate', (done) => {
//       const user = 'jeremy.greer';
//       app.authenticate(user, password).then(
//         result => {
//           expect(result.session).to.have.property('value');
//           done();
//         },
//         done
//       ).catch(done);
//     });
//   });
//
//   xdescribe('when providing incorrect credentials', () => {
//     it('should not authenticate', (done) => {
//       const user = 'some dude';
//       const password = 'woot!';
//       app.authenticate(user, password).then(
//         result => {
//           expect(result.errorMessages).to.eql(['Login failed']);
//           done();
//         },
//         done
//       ).catch(done);
//     });
//   });
// });
