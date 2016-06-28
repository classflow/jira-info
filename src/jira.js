import fetch from 'node-fetch';
import { getAuthHeader } from './auth';

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

export function getMyIssues() {
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
        return resp.json();
      } else {
        reject(new Error('unable to handle request'));
      }
    })
    .then(result =>
      resolve(
        result.issues.map(issue =>
`[priority: ${issue.fields.priority.name} ${issue.fields.issuetype.name}]
${issue.key}: ${issue.fields.summary}, ${issue.fields.status.name}

`
        ).join('')
      )
    );
  });
}
