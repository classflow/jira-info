import fetch from 'node-fetch';
import { getAuthHeader } from './auth';
import colors from 'colors/safe';

let jiraUrl = '';

function needsCaptcha(resp) {
  return resp.headers.get('x-seraph-loginreason') === 'AUTHENTICATION_DENIED';
}

function getCaptchaUrl(resp) {
  const header = resp.headers.get('x-authentication-denied-reason');
  return header.split('=').pop();
}

function handleBadResponse(resp) {
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

      case 404:
      throw new Error('appears to be an invalid Jira url');

      default:
      throw new Error(`${resp.status}: ${resp.statusText}`);
    }
  } else {
    return resp;
  }
}

export function setUrl(url) {
  jiraUrl = url;
}

export function getInfoByIssueId(issueId) {
  const auth = getAuthHeader();
  if (!auth) {
    return Promise.reject(new Error('Please authenticate.'));
  } else {
    const url = `${jiraUrl}/rest/api/2/issue/${issueId}?fields=status,assignee,description`;
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

function getColor(issue) {
  let color;
  switch (issue.fields.priority.name) {
    case '0':
    case '1':
      color = 'red';
      break;

    case '2':
      color = 'yellow';
      break;

    case '3':
    default:
      color = 'green';
  }
  return colors[color];
}

function renderIssue(issue) {
  const color = getColor(issue);

  return color(`${issue.fields.priority.name} ${issue.fields.issuetype.name}, ${issue.fields.status.name}
${issue.key}: ${issue.fields.summary}

`);
}

export function getMyIssues() {
  const jql = 'assignee = currentUser() AND resolution = Unresolved order by priority DESC';
  const auth = getAuthHeader();
  const url = `${jiraUrl}/rest/api/2/search`;
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
  .then(handleBadResponse)
  .then(resp => resp.json())
  .then(resp => '\n' + resp.issues.map(renderIssue).join(''))
  .catch(err => {
    process.stdout.write(`unable to getMyIssues: ${err.message}\n`);
  });
}
