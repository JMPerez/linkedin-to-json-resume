LinkedIn to JSON Résumé
=======================


This is a small site that allows you to generate a JSON output compatible with [JSON Résumé](http://jsonresume.org/) (version 0.0.0) from your LinkedIn profile.

You first need to download a copy of your data through [LinkedIn's Data Export Page](https://www.linkedin.com/settings/data-export-page), and then select that file from this project page.

Try the demo on [http://jmperezperez.com/linkedin-to-json-resume/](http://jmperezperez.com/linkedin-to-json-resume/)

## LinkedIn API?

Due to some changes in the LinkedIn API the exporter will no longer have access to the user's full profile from LinkedIn nor contact information. Unfortunately there is no way for this app to ask for that data through the LinkedIn OAuth gateway anymore. See https://github.com/JMPerez/linkedin-to-json-resume/issues/10

## Running it locally

Serve the files from `http://localhost` or `http://localhost:8000` which are the SDK Domains registered in the LinkedIn Depelopers page for this app. You don't need to install anything.

## Developing

Install the dependencies running

`npm install`

Then, in order to generate the `dist/output.js` file you will need to run:

`npm run build`
