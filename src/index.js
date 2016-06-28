#!/usr/bin/env node

import prompt from 'prompt';
import fetch from 'node-fetch';
import { getAuthHeader, setCredentials } from './auth';

function promptForAuthentication() {
  return new Promise((resolve, reject) => {
    prompt.message = '';

    const schema = {
      properties: {
        username: {
          description: 'Jira username',
          required: true,
        },
        password: {
          description: 'Jira password',
          hidden: true,
        },
      },
    };

    prompt.start();

    prompt.get(schema, (err, result) => {
      return err
        ? reject(err)
        : resolve(
          setCredentials(result.username, result.password)
        );
    });
  });
}

export function getInfoByIssueId(issueId) {
  const auth = getAuthHeader();
  if (!auth) {
    return Promise.reject(new Error('Please authenticate.'));
  } else {
    const url = `https://jira.prometheanjira.com/rest/api/2/issue/${issueId}?fields=status,assignee,description`;
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: auth,
      },
    };

    return new Promise((resolve, reject) => {
      fetch(url, options)
      .then(resp => {
        if (resp.ok) {
          return resolve(resp.json());
        } else {
          reject(new Error('unable to handle request'));
        }
        // TODO: check for captcha https://jira.prometheanjira.com/login.jsp
        /*
        'x-authentication-denied-reason': [ 'CAPTCHA_CHALLENGE; login-url=https://jira.prometheanjira.com/login.jsp' ],
        'x-content-type-options': [ 'nosniff' ],
        'x-seraph-loginreason': [ 'AUTHENTICATION_DENIED' ],
        */
        // console.log(resp.headers['x-seraph-loginreason']);
        return resp;
      })
    });
  }
}


promptForAuthentication().then(() => {
  const issueId = process.argv[2];
  console.log('lookup issueId', issueId);
  // getInfoByIssueId(issueId).then(issue => {
  //   console.log(issue);
  // }, err => {
  //   console.log(err);
  // });
});



// wait for user to do something
// process.stdin.setEncoding('utf8');
//
// process.stdin.on('readable', () => {
//   var chunk = process.stdin.read();
//   if (chunk !== null) {
//     process.stdout.write(`data: ${chunk}`);
//   }
// });
