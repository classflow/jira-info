import fetch from 'node-fetch';

let encodedCredentials = null;

export function getAuthHeader() {
  return encodedCredentials
    ? `Basic ${encodedCredentials}`
    : null;
}

export function setCredentials(username, password) {
  return encodedCredentials = (username && password)
    ? new Buffer(`${username}:${password}`).toString('base64')
    : null;
}

export function logout() {
  const url = 'https://jira.prometheanjira.com/rest/auth/1/session';

  const options = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(),
    },
  };

  return fetch(url, options);
}

// export function login(username, password) {
//   const url = 'https://jira.prometheanjira.com/rest/auth/1/session';
//   const options = {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       username,
//       password,
//     }),
//   };
//
//   return fetch(url, options)
//     .then(resp => resp.json())
// }
