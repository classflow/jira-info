#!/usr/bin/env node

import jiraQuery from 'jira-query';
import colors from 'colors/safe';

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

jiraQuery.getMyOpenIssues()
.then(issues => '\n' + issues.map(renderIssue).join(''))
.then(issues => process.stdout.write(issues));
