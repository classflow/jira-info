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

function getMyIssues() {
  const jql = 'assignee = currentUser() AND resolution = Unresolved order by updated DESC';
  const auth = getAuthHeader();
  const url = 'https://jira.prometheanjira.com/rest/api/2/search';
  const options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: auth,
    },
    method: 'POST',
    body: JSON.stringify({
      jql,
    }),
  };

  return new Promise((resolve, reject) => {
    fetch(url, options)
    .then(resp => {
      if (resp.ok) {
        return resolve(resp.json());
      } else {
        reject(new Error('unable to handle request'));
      }
    });
  });
}


promptForAuthentication().then(() => {
  // const issueId = process.argv[2];
  // console.log('lookup issueId', issueId);
  // getInfoByIssueId(issueId).then(issue => {
  //   console.log(issue);
  // }, err => {
  //   console.log(err);
  // });

  getMyIssues().then(result => {
    result.issues.map(issue => {
      const info =
`[priority: ${issue.fields.priority.name} ${issue.fields.issuetype.name}]
${issue.key}: ${issue.fields.summary}, ${issue.fields.status.name}

`;
      process.stdout.write(info);
    });
  });
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
