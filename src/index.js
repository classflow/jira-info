#!/usr/bin/env node

import prompt from 'prompt';
import { setCredentials } from './auth';
import { getMyIssues } from './jira';

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



promptForAuthentication().then(() => {
  getMyIssues().then(string => {
    process.stdout.write(string);
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
