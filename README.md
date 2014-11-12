LinkedIn to JSON Résumé
=======================

This is a small site that allows you to generate a JSON output compatible with [JSON Résumé](http://jsonresume.org/) (version 0.0.0) from your LinkedIn profile.

Try the demo on [http://jmperezperez.com/linkedin-to-json-resume/](http://jmperezperez.com/linkedin-to-json-resume/)

## How it works

The project uses the [Sign with LinkedIn button](https://developer.linkedin.com/documents/sign-linkedin) together with [LinkedIn's API](https://developer.linkedin.com/documents/profile-fields) to fetch a user's profile on LinkedIn and convert it to the format expected by JSON Résumé.

Note that due to some limitations in LinkedIn's API, not all the data exposed on LinkedIn's site is available through their API. For example, start and end dates for volunteer, or honors & awards.
