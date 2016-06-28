import fs from 'fs';
import path from 'path';

const fileName = '.jira-inforc';

function getHomePath() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

function readConfigInDir(dir) {
  return fs.readFileSync(path.join(dir, fileName), 'utf8');
}

function getConfigFile() {
  try {
    return readConfigInDir(process.cwd());
  } catch (err) {
    return readConfigInDir(getHomePath());
  }
}

export function getConfig() {
  let config = null;

  try {
    const file = getConfigFile();

    try {
      config = JSON.parse(file);
    } catch (err) {
      // console.log('invalid json');
    }
  } catch (err) {
    // console.log('no rc');
  }

  return config;
}
