# jira-info

Get a summary of your open Jira issues from the command line.

## Installation

```sh
npm i -g jira-info
```

## Usage

Run `jira-info` from the command line to show a summary of your open issues sorted by priority.

### Info

In order to query Jira, **jira-info** needs to know the following.

* **Jira Url** - The location of the Jira instance you're querying.  
* **Username** - Your Jira username.  
* **Password** - Your Jira password.  

To skip providing this info every time, create a `.jira-inforc` file.  **jira-info** will check for this file in the current working directory and in your home directory and use its values.  You can store your password, *but that's probably not a good idea*.  You will be prompted for anything missing from the file as needed.

```js
{
  "jira-url": "https://jira.superjiraninja.com",
  "username": "some.dude",
  "password": "correcthorsebatterystaple"
}
```

### Problems / Captcha

**jira-info** provides pretty obvious errors when there's a problem fetching data.  If something doesn't go right, the answer is probably in the console.  One worth mentioning, though, is CAPTCHA.  There's no way around that through the API, so you'll have to go to your browser and deal with it.  If Jira won't let you in because of this, you'll see an error with a URL pointing to the CAPTCHA challenge.  Handle that in the browser and you should be back in business.







---
kickstarted by [npm-boom][npm-boom]

[npm-boom]: https://github.com/reergymerej/npm-boom
