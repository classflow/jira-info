#!/usr/bin/env node

import prompt from 'prompt';
import { setCredentials } from './auth';
import { setUrl, getMyIssues } from './jira';
import { getConfig } from './config';

function getRequiredInfo() {
  return new Promise((resolve, reject) => {
    const config = getConfig();
    const properties = {
      ['jira-url']: {
        description: 'Jira url',
        required: true,
      },
      username: {
        description: 'Jira username',
        required: true,
      },
      password: {
        description: 'Jira password',
        required: true,
        hidden: true,
      },
    };

    if (config) {
      Object.keys(config).map(key => {
        delete properties[key];
      });
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
      });
  },
  err => {
    console.log('unable to get required info', err); //eslint-disable-line
  }
);
