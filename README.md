LinkedIn to JSON Résumé
=======================

This is a small site that allows you to generate a JSON output compatible with [JSON Résumé](http://jsonresume.org/) (version 0.0.0) from your LinkedIn profile.

Try the demo on [http://jmperezperez.com/linkedin-to-json-resume/](http://jmperezperez.com/linkedin-to-json-resume/)

## How it works

The project uses the [Sign with LinkedIn button](https://developer.linkedin.com/documents/sign-linkedin) together with [LinkedIn's API](https://developer.linkedin.com/documents/profile-fields) to fetch a user's profile on LinkedIn and convert it to the format expected by JSON Résumé.

Note that due to some limitations in LinkedIn's API, not all the data exposed on LinkedIn's site is available through their API. For example, start and end dates for volunteer, or honors & awards.

## Running it locally

Serve the files from `http://localhost` or `http://localhost:8000` which are the SDK Domains registered in the LinkedIn Depelopers page for this app. You don't need to install anything.

## Developing

Install the dependencies running

`npm install`

Then, in order to generate the `dist/output.js` file you will need to run:

`npm run build`

You can test and lint your source code running:

`npm run test`
