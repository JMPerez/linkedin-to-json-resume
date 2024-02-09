LinkedIn to JSON Résumé
=======================

This is a small site that allows you to generate a JSON output compatible with [JSON Résumé](http://jsonresume.org/) (version 0.0.0) from your LinkedIn profile.  **Try the demo on [https://jmperezperez.com/linkedin-to-json-resume/](https://jmperezperez.com/linkedin-to-json-resume/)**

You first need to download a copy of your data through the [LinkedIn's Data Export Page](https://www.linkedin.com/settings/data-export-page), then select that file from this project page.

<a href="https://linkedin-json-resume.surge.sh/linkedin.png" target="_blank"><img src="https://linkedin-json-resume.surge.sh/linkedin.png" width="497" height="317" alt="Screenshot of LinkedIn Data Export"></a>

## LinkedIn API?

Due to some changes in the LinkedIn API the exporter will no longer have access to the user's full profile from LinkedIn nor contact information. Unfortunately there is no way for this app to ask for that data through the LinkedIn OAuth gateway anymore. See https://github.com/JMPerez/linkedin-to-json-resume/issues/10

## Running it locally

Just start a server and browse the files. You don't need to install anything to run it if you are not going to make changes in the code.

## Developing

Install the dependencies running:

`npm install`

To start developing run:

`npm run start`

To build the project in production mode run:

`npm run build`

and serve the files from the `dist` folder.
