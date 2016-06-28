import fs from 'fs';
import path from 'path';

export function getConfig() {
  let config = null;

  const rcPath = path.join(process.cwd(), '.jira-inforc');
  try {
    const file = fs.readFileSync(rcPath, 'utf8');

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
