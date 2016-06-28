import fetch from 'node-fetch';
import { getAuthHeader } from './auth';

function needsCaptcha(resp) {
  return resp.headers.get('x-seraph-loginreason') === 'AUTHENTICATION_DENIED';
}

function getCaptchaUrl(resp) {
  const header = resp.headers.get('x-authentication-denied-reason');
  return header.split('=').pop();
}

function checkResponseAuthentication(resp) {
  if (!resp.ok) {
    switch(resp.status) {
      case 403:
      if (needsCaptcha(resp)) {
        throw new Error(`CAPTCHA needed, ${getCaptchaUrl(resp)}`);
      } else {
        throw new Error('user is not authenticated');
      }

      case 401:
      throw new Error('user is not authenticated');

      default:
      // console.log(resp);
      throw new Error(resp.statusText);
    }
  } else {
    return resp;
  }
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
    body: JSON.stringify({ jql }),
  };

  return fetch(url, options)
  .then(checkResponseAuthentication)
  .then(resp => resp.json())
  .then(resp =>
'\n' + resp.issues.map(issue =>
`[priority: ${issue.fields.priority.name} ${issue.fields.issuetype.name}]
  ${issue.key}: ${issue.fields.summary}, ${issue.fields.status.name}

`
    ).join('')
  ).catch(err => {
    process.stdout.write(`unable to getMyIssues: ${err.message}\n`);
  });
}
