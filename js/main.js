/* global IN, Prism */
/* exported onLinkedInLoad */

import LinkedInToJsonResume from './converter.js';
import save from './file.js';

(function() {
  'use strict';

  var jsonResumeOutput = null;

  var linkedinToJsonResume = new LinkedInToJsonResume();

  var downloadButton = document.querySelector('.download');
  downloadButton.addEventListener('click', function() {
    save(JSON.stringify(jsonResumeOutput, undefined, 2), 'resume.json');
  });
  downloadButton.style.display = 'none';
  var onLinkedInAuth = function() {
    IN.API.Profile('me')
      .fields('firstName', 'lastName', 'headline', 'picture-url', 'summary', 'specialties',
        'positions', 'email-address', 'languages', 'skills', 'educations',
        'location:(name,country)', 'recommendations-received', 'phone-numbers', 'volunteer',
        'publications', 'honors-awards')
      .result(function(data) {
        var jsonResumeOutput = linkedinToJsonResume.process(data.values[0]);
        var output = document.getElementById('output');
        output.innerHTML = JSON.stringify(jsonResumeOutput, undefined, 2);
        Prism.highlightElement(output);
        downloadButton.style.display = 'block';
      });
  };

  var onLinkedInLoad = function() {
    IN.Event.on(IN, 'auth', onLinkedInAuth);
  };

  window.onLinkedInLoad = onLinkedInLoad;
})();