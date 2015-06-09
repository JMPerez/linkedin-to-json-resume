var assert = require("assert");
var fixtureInput = require("./fixtures/sample-linkedin.json");
var fixtureOutput = require("./fixtures/sample-jsonresume.json");

import LinkedInToJsonResume from '../js/converter.js';

describe('Converter', function(){
  it('should work with a sample linkedin cv', function() {
    var linkedInToJsonResume = new LinkedInToJsonResume();
    var output = linkedInToJsonResume.process(fixtureInput);
    assert.deepEqual(output, fixtureOutput);
  });
});