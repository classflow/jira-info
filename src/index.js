#!/usr/bin/env node

import prompt from 'prompt';
import { setCredentials } from './auth';
import { getMyIssues } from './jira';
import { getConfig } from './config';

function promptForAuthentication() {
  return new Promise((resolve, reject) => {
    const config = getConfig();
    const properties = {};

    if (!config || !config.username) {
      properties.username = {
        description: 'Jira username',
        required: true,
      };
    }

    if (!config || !config.password) {
      properties.password = {
        description: 'Jira password',
        required: true,
        hidden: true,
      };
    }

    if (Object.keys(properties).length) {
      prompt.message = '';
      const schema = { properties };

      prompt.start();
      prompt.get(schema, (err, result) => {
        return err
        ? reject(err)
        : resolve(
          setCredentials(result.username, result.password)
        );
      });
    } else {
      setCredentials(config.username, config.password)
      resolve();
    }
  });
}

promptForAuthentication().then(() => {
  getMyIssues().then(
    string => {
      process.stdout.write(string);
    },
    err => {
      process.stdout.write(err);
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
