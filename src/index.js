#!/usr/bin/env node

import prompt from 'prompt';
import { setCredentials } from './auth';
import { setUrl, getMyIssues } from './jira';
import { getConfig } from './config';

function getRequiredInfo() {
  return new Promise((resolve, reject) => {
    const config = getConfig();
    const properties = {};

    if (!config || !config['jira-url']) {
      properties['jira-url'] = {
        description: 'Jira url',
        required: true,
      };
    }

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
        : resolve((() => {
          const username = (config && config.username) || result.username;
          const password = (config && config.password) || result.password;
          const jiraUrl = (config && config['jira-url']) || result['jira-url'];
          setCredentials(username, password);
          setUrl(jiraUrl);
        })());
      });
    } else {
      setCredentials(config.username, config.password)
      setUrl(config['jira-url']);
      resolve();
    }
  });
}

getRequiredInfo().then(
  () => {
    getMyIssues().then(
      string => {
        process.stdout.write(string);
      },
      err => {
        process.stdout.write(err);
      })
      .catch(err => {
        console.log(err);
      });
  },
  err => {
    console.log('unable to get required info', err);
  }
).catch(err => {
  console.log('crap', err);
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
