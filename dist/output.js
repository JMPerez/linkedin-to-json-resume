(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global module */
/* exported onLinkedInLoad */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var LinkedInToJsonResume = (function () {
  function LinkedInToJsonResume() {
    _classCallCheck(this, LinkedInToJsonResume);
  }

  _createClass(LinkedInToJsonResume, [{
    key: 'process',
    value: function process(profile) {
      var target = {};
      this._processBasics(profile, target);
      this._processWork(profile, target);
      this._processEducation(profile, target);
      this._processSkills(profile, target);
      this._processLanguages(profile, target);
      this._processReferences(profile, target);
      this._processVolunteer(profile, target);
      this._processAwards(profile, target);
      return target;
    }
  }, {
    key: '_processBasics',
    value: function _processBasics(source, target) {
      target.basics = {
        name: source.firstName + ' ' + source.lastName,
        label: source.headline,
        picture: source.pictureUrl,
        email: source.emailAddress,
        phone: source.phoneNumbers && source.phoneNumbers._total ? source.phoneNumbers.values[0].phoneNumber : '',
        website: '',
        summary: source.summary,
        location: {
          address: '',
          postalCode: '',
          city: source.location ? source.location.name : '',
          countryCode: source.location ? source.location.country.code.toUpperCase() : '',
          region: ''
        },
        profiles: []
      };
    }
  }, {
    key: '_processWork',
    value: function _processWork(source, target) {

      function processPosition(position) {
        var object = {
          company: position.company.name,
          position: position.title || '',
          website: '',
          startDate: position.startDate.year + '-' + (position.startDate.month < 10 ? '0' : '') + position.startDate.month + '-01',
          summary: position.summary,
          highlights: []
        };

        if (position.endDate) {
          object.endDate = position.endDate.year + '-' + (position.endDate.month < 10 ? '0' : '') + position.endDate.month + '-01';
        }

        return object;
      }

      var work = source.positions && source.positions.values ? source.positions.values.map(processPosition) : [];

      target.work = work;
    }
  }, {
    key: '_processEducation',
    value: function _processEducation(source, target) {

      function processEducation(education) {
        var object = {
          institution: education.schoolName,
          area: education.fieldOfStudy,
          studyType: education.degree,
          startDate: '' + education.startDate.year + '-01-01',
          gpa: '',
          courses: [] // even though they are returned through the API, they can't
          // be tracked back to a school/education entry
        };

        if (education.endDate) {
          object.endDate = education.endDate.year + '-01-01';
        }

        return object;
      }

      var education = source.educations && source.educations.values ? source.educations.values.map(processEducation) : [];

      target.education = education;
    }
  }, {
    key: '_processSkills',
    value: function _processSkills(source, target) {

      var skills = source.skills && source.skills.values ? source.skills.values.map(function (skill) {
        return {
          name: skill.skill.name,
          level: '',
          keywords: []
        };
      }) : [];

      target.skills = skills;
    }
  }, {
    key: '_processLanguages',
    value: function _processLanguages(source, target) {

      var languages = source.languages && source.languages.values ? source.languages.values.map(function (language) {
        return {
          language: language.language.name,
          fluency: ''
        };
      }) : [];

      target.languages = languages;
    }
  }, {
    key: '_processReferences',
    value: function _processReferences(source, target) {

      var references = source.recommendationsReceived && source.recommendationsReceived.values ? source.recommendationsReceived.values.map(function (reference) {
        return {
          name: reference.recommender.firstName + ' ' + reference.recommender.lastName,
          reference: reference.recommendationText
        };
      }) : [];

      target.references = references;
    }
  }, {
    key: '_processVolunteer',
    value: function _processVolunteer(source, target) {

      var volunteer = source.volunteer && source.volunteer.values ? source.volunteer.volunteerExperiences.values.map(function (volunteer) {
        return {
          organization: volunteer.organization.name,
          position: volunteer.role
          // unfortunately, startDate and endDate are not exposed
          // see https://developer.linkedin.com/forum/dates-volunteer-experience
        };
      }) : [];

      target.volunteer = volunteer;
    }
  }, {
    key: '_processAwards',
    value: function _processAwards(source, target) {

      var awards = source.honorsAwards && source.honorsAwards.values ? source.honorsAwards.values.map(function (honorsAward) {
        return {
          awarder: honorsAward.issuer,
          title: honorsAward.name
          // unfortunately, startDate and endDate are not exposed
        };
      }) : [];

      target.awards = awards;
    }
  }]);

  return LinkedInToJsonResume;
})();

module.exports = LinkedInToJsonResume;

},{}],2:[function(require,module,exports){
/* global URL, Blob, module */
/* exported save */
'use strict';

var save = (function () {
  'use strict';

  // saveAs from https://gist.github.com/MrSwitch/3552985
  var saveAs = window.saveAs || (window.navigator.msSaveBlob ? function (b, n) {
    return window.navigator.msSaveBlob(b, n);
  } : false) || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs || (function () {

    // URL's
    window.URL = window.URL || window.webkitURL;

    if (!window.URL) {
      return false;
    }

    return function (blob, name) {
      var url = URL.createObjectURL(blob);

      // Test for download link support
      if ('download' in document.createElement('a')) {

        var a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', name);

        // Create Click event
        var clickEvent = document.createEvent('MouseEvent');
        clickEvent.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        // dispatch click event to simulate download
        a.dispatchEvent(clickEvent);
      } else {
        // fallover, open resource in new tab.
        window.open(url, '_blank', '');
      }
    };
  })();

  function _save(text, fileName) {
    var blob = new Blob([text], {
      type: 'text/plain'
    });
    saveAs(blob, fileName || 'subtitle.srt');
  }

  return _save;
})();

module.exports = save;

},{}],3:[function(require,module,exports){
/* global IN, Prism */
/* exported onLinkedInLoad */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _converterJs = require('./converter.js');

var _converterJs2 = _interopRequireDefault(_converterJs);

var _fileJs = require('./file.js');

var _fileJs2 = _interopRequireDefault(_fileJs);

(function () {
  'use strict';

  var jsonResumeOutput = null;

  var linkedinToJsonResume = new _converterJs2['default']();

  var downloadButton = document.querySelector('.download');
  downloadButton.addEventListener('click', function () {
    (0, _fileJs2['default'])(JSON.stringify(jsonResumeOutput, undefined, 2), 'resume.json');
  });
  downloadButton.style.display = 'none';
  var onLinkedInAuth = function onLinkedInAuth() {
    IN.API.Profile('me').fields('firstName', 'lastName', 'headline', 'picture-url', 'summary', 'specialties', 'positions', 'email-address', 'languages', 'skills', 'educations', 'location:(name,country)', 'recommendations-received', 'phone-numbers', 'volunteer', 'publications', 'honors-awards').result(function (data) {
      jsonResumeOutput = linkedinToJsonResume.process(data.values[0]);
      var output = document.getElementById('output');
      output.innerHTML = JSON.stringify(jsonResumeOutput, undefined, 2);
      Prism.highlightElement(output);
      downloadButton.style.display = 'block';
    });
  };

  var onLinkedInLoad = function onLinkedInLoad() {
    IN.Event.on(IN, 'auth', onLinkedInAuth);
  };

  window.onLinkedInLoad = onLinkedInLoad;
})();

},{"./converter.js":1,"./file.js":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam1wZXJlei9naXRodWIvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvY29udmVydGVyLmpzIiwiL1VzZXJzL2ptcGVyZXovZ2l0aHViL2xpbmtlZGluLXRvLWpzb24tcmVzdW1lL2pzL2ZpbGUuanMiLCIvVXNlcnMvam1wZXJlei9naXRodWIvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztJQ0dNLG9CQUFvQjtBQUNiLFdBRFAsb0JBQW9CLEdBQ1Y7MEJBRFYsb0JBQW9CO0dBR3ZCOztlQUhHLG9CQUFvQjs7V0FLakIsaUJBQUMsT0FBTyxFQUFFO0FBQ2YsVUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFVBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3JDLFVBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLFVBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDckMsVUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN4QyxVQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3pDLFVBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDckMsYUFBTyxNQUFNLENBQUM7S0FDZjs7O1dBRWEsd0JBQUMsTUFBTSxFQUFFLE1BQU0sRUFB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QUFDLENBQUM7R0FDekMsQ0FBQzs7QUFFRixRQUFNLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztDQUN4QyxDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgbW9kdWxlICovXG4vKiBleHBvcnRlZCBvbkxpbmtlZEluTG9hZCAqL1xuXG5jbGFzcyBMaW5rZWRJblRvSnNvblJlc3VtZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gIH1cblxuICBwcm9jZXNzKHByb2ZpbGUpIHtcbiAgICBsZXQgdGFyZ2V0ID0ge307XG4gICAgdGhpcy5fcHJvY2Vzc0Jhc2ljcyhwcm9maWxlLCB0YXJnZXQpO1xuICAgIHRoaXMuX3Byb2Nlc3NXb3JrKHByb2ZpbGUsIHRhcmdldCk7XG4gICAgdGhpcy5fcHJvY2Vzc0VkdWNhdGlvbihwcm9maWxlLCB0YXJnZXQpO1xuICAgIHRoaXMuX3Byb2Nlc3NTa2lsbHMocHJvZmlsZSwgdGFyZ2V0KTtcbiAgICB0aGlzLl9wcm9jZXNzTGFuZ3VhZ2VzKHByb2ZpbGUsIHRhcmdldCk7XG4gICAgdGhpcy5fcHJvY2Vzc1JlZmVyZW5jZXMocHJvZmlsZSwgdGFyZ2V0KTtcbiAgICB0aGlzLl9wcm9jZXNzVm9sdW50ZWVyKHByb2ZpbGUsIHRhcmdldCk7XG4gICAgdGhpcy5fcHJvY2Vzc0F3YXJkcyhwcm9maWxlLCB0YXJnZXQpO1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cblxuICBfcHJvY2Vzc0Jhc2ljcyhzb3VyY2UsIHRhcmdldCkge1xuICAgIHRhcmdldC5iYXNpY3MgPSB7XG4gICAgICBuYW1lOiBzb3VyY2UuZmlyc3ROYW1lICsgJyAnICsgc291cmNlLmxhc3ROYW1lLFxuICAgICAgbGFiZWw6IHNvdXJjZS5oZWFkbGluZSxcbiAgICAgIHBpY3R1cmU6IHNvdXJjZS5waWN0dXJlVXJsLFxuICAgICAgZW1haWw6IHNvdXJjZS5lbWFpbEFkZHJlc3MsXG4gICAgICBwaG9uZTogc291cmNlLnBob25lTnVtYmVycyAmJiBzb3VyY2UucGhvbmVOdW1iZXJzLl90b3RhbCA/IHNvdXJjZS5waG9uZU51bWJlcnMudmFsdWVzWzBdLnBob25lTnVtYmVyIDogJycsXG4gICAgICB3ZWJzaXRlOiAnJyxcbiAgICAgIHN1bW1hcnk6IHNvdXJjZS5zdW1tYXJ5LFxuICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgYWRkcmVzczogJycsXG4gICAgICAgIHBvc3RhbENvZGU6ICcnLFxuICAgICAgICBjaXR5OiBzb3VyY2UubG9jYXRpb24gPyBzb3VyY2UubG9jYXRpb24ubmFtZSA6ICcnLFxuICAgICAgICBjb3VudHJ5Q29kZTogc291cmNlLmxvY2F0aW9uID8gc291cmNlLmxvY2F0aW9uLmNvdW50cnkuY29kZS50b1VwcGVyQ2FzZSgpIDogJycsXG4gICAgICAgIHJlZ2lvbjogJydcbiAgICAgIH0sXG4gICAgICBwcm9maWxlczogW11cbiAgICB9O1xuICB9XG5cbiAgX3Byb2Nlc3NXb3JrKHNvdXJjZSwgdGFyZ2V0KSB7XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzUG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICAgIGxldCBvYmplY3QgPSB7XG4gICAgICAgIGNvbXBhbnk6IHBvc2l0aW9uLmNvbXBhbnkubmFtZSxcbiAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLnRpdGxlIHx8ICcnLFxuICAgICAgICB3ZWJzaXRlOiAnJyxcbiAgICAgICAgc3RhcnREYXRlOiBwb3NpdGlvbi5zdGFydERhdGUueWVhciArICctJyArIChwb3NpdGlvbi5zdGFydERhdGUubW9udGggPCAxMCA/ICcwJyA6ICcnKSArIHBvc2l0aW9uLnN0YXJ0RGF0ZS5tb250aCArICctMDEnLFxuICAgICAgICBzdW1tYXJ5OiBwb3NpdGlvbi5zdW1tYXJ5LFxuICAgICAgICBoaWdobGlnaHRzOiBbXVxuICAgICAgfTtcblxuICAgICAgaWYgKHBvc2l0aW9uLmVuZERhdGUpIHtcbiAgICAgICAgb2JqZWN0LmVuZERhdGUgPSBwb3NpdGlvbi5lbmREYXRlLnllYXIgKyAnLScgKyAocG9zaXRpb24uZW5kRGF0ZS5tb250aCA8IDEwID8gJzAnIDogJycpICsgcG9zaXRpb24uZW5kRGF0ZS5tb250aCArICctMDEnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIGxldCB3b3JrID0gc291cmNlLnBvc2l0aW9ucyAmJiBzb3VyY2UucG9zaXRpb25zLnZhbHVlcyA/XG4gICAgICBzb3VyY2UucG9zaXRpb25zLnZhbHVlcy5tYXAocHJvY2Vzc1Bvc2l0aW9uKSA6IFtdO1xuXG4gICAgdGFyZ2V0LndvcmsgPSB3b3JrO1xuICB9XG5cbiAgX3Byb2Nlc3NFZHVjYXRpb24oc291cmNlLCB0YXJnZXQpIHtcblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NFZHVjYXRpb24oZWR1Y2F0aW9uKSB7XG4gICAgICBsZXQgb2JqZWN0ID0ge1xuICAgICAgICBpbnN0aXR1dGlvbjogZWR1Y2F0aW9uLnNjaG9vbE5hbWUsXG4gICAgICAgIGFyZWE6IGVkdWNhdGlvbi5maWVsZE9mU3R1ZHksXG4gICAgICAgIHN0dWR5VHlwZTogZWR1Y2F0aW9uLmRlZ3JlZSxcbiAgICAgICAgc3RhcnREYXRlOiAnJyArIGVkdWNhdGlvbi5zdGFydERhdGUueWVhciArICctMDEtMDEnLFxuICAgICAgICBncGE6ICcnLFxuICAgICAgICBjb3Vyc2VzOiBbXSAvLyBldmVuIHRob3VnaCB0aGV5IGFyZSByZXR1cm5lZCB0aHJvdWdoIHRoZSBBUEksIHRoZXkgY2FuJ3RcbiAgICAgICAgICAgICAgICAgICAgLy8gYmUgdHJhY2tlZCBiYWNrIHRvIGEgc2Nob29sL2VkdWNhdGlvbiBlbnRyeVxuICAgICAgfTtcblxuICAgICAgaWYgKGVkdWNhdGlvbi5lbmREYXRlKSB7XG4gICAgICAgIG9iamVjdC5lbmREYXRlID0gZWR1Y2F0aW9uLmVuZERhdGUueWVhciArICctMDEtMDEnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIGxldCBlZHVjYXRpb24gPSBzb3VyY2UuZWR1Y2F0aW9ucyAmJiBzb3VyY2UuZWR1Y2F0aW9ucy52YWx1ZXMgP1xuICAgICAgc291cmNlLmVkdWNhdGlvbnMudmFsdWVzLm1hcChwcm9jZXNzRWR1Y2F0aW9uKSA6IFtdO1xuICBcbiAgICB0YXJnZXQuZWR1Y2F0aW9uID0gZWR1Y2F0aW9uO1xuICB9XG5cbiAgX3Byb2Nlc3NTa2lsbHMoc291cmNlLCB0YXJnZXQpIHtcblxuICAgIGxldCBza2lsbHMgPSBzb3VyY2Uuc2tpbGxzICYmIHNvdXJjZS5za2lsbHMudmFsdWVzID9cbiAgICAgIHNvdXJjZS5za2lsbHMudmFsdWVzLm1hcChza2lsbCA9PiAoe1xuICAgICAgICBuYW1lOiBza2lsbC5za2lsbC5uYW1lLFxuICAgICAgICBsZXZlbDogJycsXG4gICAgICAgIGtleXdvcmRzOiBbXVxuICAgICAgfSkpIDogW107XG5cbiAgICB0YXJnZXQuc2tpbGxzID0gc2tpbGxzO1xuICB9XG5cbiAgX3Byb2Nlc3NMYW5ndWFnZXMoc291cmNlLCB0YXJnZXQpIHtcblxuICAgIGxldCBsYW5ndWFnZXMgPSBzb3VyY2UubGFuZ3VhZ2VzICYmXG4gICAgICBzb3VyY2UubGFuZ3VhZ2VzLnZhbHVlcyA/IHNvdXJjZS5sYW5ndWFnZXMudmFsdWVzLm1hcChsYW5ndWFnZSA9PiAoe1xuICAgICAgICBsYW5ndWFnZTogbGFuZ3VhZ2UubGFuZ3VhZ2UubmFtZSxcbiAgICAgICAgZmx1ZW5jeTogJydcbiAgICAgIH0pKSA6IFtdO1xuXG4gICAgdGFyZ2V0Lmxhbmd1YWdlcyA9IGxhbmd1YWdlcztcbiAgfVxuXG4gIF9wcm9jZXNzUmVmZXJlbmNlcyhzb3VyY2UsIHRhcmdldCkge1xuXG4gICAgbGV0IHJlZmVyZW5jZXMgPSBzb3VyY2UucmVjb21tZW5kYXRpb25zUmVjZWl2ZWQgJiZcbiAgICAgIHNvdXJjZS5yZWNvbW1lbmRhdGlvbnNSZWNlaXZlZC52YWx1ZXMgPyBzb3VyY2UucmVjb21tZW5kYXRpb25zUmVjZWl2ZWQudmFsdWVzLm1hcChyZWZlcmVuY2UgPT4gKHtcbiAgICAgICAgbmFtZTogcmVmZXJlbmNlLnJlY29tbWVuZGVyLmZpcnN0TmFtZSArICcgJyArIHJlZmVyZW5jZS5yZWNvbW1lbmRlci5sYXN0TmFtZSxcbiAgICAgICAgcmVmZXJlbmNlOiByZWZlcmVuY2UucmVjb21tZW5kYXRpb25UZXh0XG4gICAgICB9KSkgOiBbXTtcblxuICAgIHRhcmdldC5yZWZlcmVuY2VzID0gcmVmZXJlbmNlcztcbiAgfVxuXG4gIF9wcm9jZXNzVm9sdW50ZWVyKHNvdXJjZSwgdGFyZ2V0KSB7XG5cbiAgICBsZXQgdm9sdW50ZWVyID0gc291cmNlLnZvbHVudGVlciAmJiBzb3VyY2Uudm9sdW50ZWVyLnZhbHVlcyA/XG4gICAgICAgIHNvdXJjZS52b2x1bnRlZXIudm9sdW50ZWVyRXhwZXJpZW5jZXMudmFsdWVzLm1hcCh2b2x1bnRlZXIgPT4gKHtcbiAgICAgICAgICBvcmdhbml6YXRpb246IHZvbHVudGVlci5vcmdhbml6YXRpb24ubmFtZSxcbiAgICAgICAgICBwb3NpdGlvbjogdm9sdW50ZWVyLnJvbGVcbiAgICAgICAgICAvLyB1bmZvcnR1bmF0ZWx5LCBzdGFydERhdGUgYW5kIGVuZERhdGUgYXJlIG5vdCBleHBvc2VkXG4gICAgICAgICAgLy8gc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmxpbmtlZGluLmNvbS9mb3J1bS9kYXRlcy12b2x1bnRlZXItZXhwZXJpZW5jZVxuICAgICAgICB9KSkgOiBbXTtcblxuICAgIHRhcmdldC52b2x1bnRlZXIgPSB2b2x1bnRlZXI7XG4gIH1cblxuICBfcHJvY2Vzc0F3YXJkcyhzb3VyY2UsIHRhcmdldCkge1xuXG4gICAgbGV0IGF3YXJkcyA9IHNvdXJjZS5ob25vcnNBd2FyZHMgJiZcbiAgICAgICAgc291cmNlLmhvbm9yc0F3YXJkcy52YWx1ZXMgPyBzb3VyY2UuaG9ub3JzQXdhcmRzLnZhbHVlcy5tYXAoaG9ub3JzQXdhcmQgPT4gKHtcbiAgICAgICAgICBhd2FyZGVyOiBob25vcnNBd2FyZC5pc3N1ZXIsXG4gICAgICAgICAgdGl0bGU6IGhvbm9yc0F3YXJkLm5hbWVcbiAgICAgICAgICAvLyB1bmZvcnR1bmF0ZWx5LCBzdGFydERhdGUgYW5kIGVuZERhdGUgYXJlIG5vdCBleHBvc2VkXG4gICAgICAgIH0pKSA6IFtdO1xuXG4gICAgdGFyZ2V0LmF3YXJkcyA9IGF3YXJkcztcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmtlZEluVG9Kc29uUmVzdW1lOyIsIi8qIGdsb2JhbCBVUkwsIEJsb2IsIG1vZHVsZSAqL1xuLyogZXhwb3J0ZWQgc2F2ZSAqL1xudmFyIHNhdmUgPSAoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBzYXZlQXMgZnJvbSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9NclN3aXRjaC8zNTUyOTg1XG4gIHZhciBzYXZlQXMgPSB3aW5kb3cuc2F2ZUFzIHx8ICh3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZUJsb2IgPyBmdW5jdGlvbiAoYiwgbikge1xuICAgICAgcmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlQmxvYihiLCBuKTtcbiAgICB9IDogZmFsc2UpIHx8IHdpbmRvdy53ZWJraXRTYXZlQXMgfHwgd2luZG93Lm1velNhdmVBcyB8fCB3aW5kb3cubXNTYXZlQXMgfHwgKGZ1bmN0aW9uICgpIHtcblxuICAgICAgLy8gVVJMJ3NcbiAgICAgIHdpbmRvdy5VUkwgPSB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkw7XG5cbiAgICAgIGlmICghd2luZG93LlVSTCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYmxvYiwgbmFtZSkge1xuICAgICAgICB2YXIgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuICAgICAgICAvLyBUZXN0IGZvciBkb3dubG9hZCBsaW5rIHN1cHBvcnRcbiAgICAgICAgaWYgKCdkb3dubG9hZCcgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpKSB7XG5cbiAgICAgICAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnaHJlZicsIHVybCk7XG4gICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgbmFtZSk7XG5cbiAgICAgICAgICAvLyBDcmVhdGUgQ2xpY2sgZXZlbnRcbiAgICAgICAgICB2YXIgY2xpY2tFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdNb3VzZUV2ZW50Jyk7XG4gICAgICAgICAgY2xpY2tFdmVudC5pbml0TW91c2VFdmVudCgnY2xpY2snLCB0cnVlLCB0cnVlLCB3aW5kb3csIDAsXG4gICAgICAgICAgICAwLCAwLCAwLCAwLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgMCwgbnVsbCk7XG5cbiAgICAgICAgICAvLyBkaXNwYXRjaCBjbGljayBldmVudCB0byBzaW11bGF0ZSBkb3dubG9hZFxuICAgICAgICAgIGEuZGlzcGF0Y2hFdmVudChjbGlja0V2ZW50KTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGZhbGxvdmVyLCBvcGVuIHJlc291cmNlIGluIG5ldyB0YWIuXG4gICAgICAgICAgd2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJywgJycpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKCk7XG5cbiAgZnVuY3Rpb24gX3NhdmUgKHRleHQsIGZpbGVOYW1lKSB7XG4gICAgdmFyIGJsb2IgPSBuZXcgQmxvYihbdGV4dF0sIHtcbiAgICAgIHR5cGU6ICd0ZXh0L3BsYWluJ1xuICAgIH0pO1xuICAgIHNhdmVBcyhibG9iLCBmaWxlTmFtZSB8fCAnc3VidGl0bGUuc3J0Jyk7XG4gIH1cblxuICByZXR1cm4gX3NhdmU7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2F2ZTsiLCIvKiBnbG9iYWwgSU4sIFByaXNtICovXG4vKiBleHBvcnRlZCBvbkxpbmtlZEluTG9hZCAqL1xuXG5pbXBvcnQgTGlua2VkSW5Ub0pzb25SZXN1bWUgZnJvbSAnLi9jb252ZXJ0ZXIuanMnO1xuaW1wb3J0IHNhdmUgZnJvbSAnLi9maWxlLmpzJztcblxuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGpzb25SZXN1bWVPdXRwdXQgPSBudWxsO1xuXG4gIHZhciBsaW5rZWRpblRvSnNvblJlc3VtZSA9IG5ldyBMaW5rZWRJblRvSnNvblJlc3VtZSgpO1xuXG4gIHZhciBkb3dubG9hZEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kb3dubG9hZCcpO1xuICBkb3dubG9hZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIHNhdmUoSlNPTi5zdHJpbmdpZnkoanNvblJlc3VtZU91dHB1dCwgdW5kZWZpbmVkLCAyKSwgJ3Jlc3VtZS5qc29uJyk7XG4gIH0pO1xuICBkb3dubG9hZEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB2YXIgb25MaW5rZWRJbkF1dGggPSBmdW5jdGlvbigpIHtcbiAgICBJTi5BUEkuUHJvZmlsZSgnbWUnKVxuICAgICAgLmZpZWxkcygnZmlyc3ROYW1lJywgJ2xhc3ROYW1lJywgJ2hlYWRsaW5lJywgJ3BpY3R1cmUtdXJsJywgJ3N1bW1hcnknLCAnc3BlY2lhbHRpZXMnLFxuICAgICAgICAncG9zaXRpb25zJywgJ2VtYWlsLWFkZHJlc3MnLCAnbGFuZ3VhZ2VzJywgJ3NraWxscycsICdlZHVjYXRpb25zJyxcbiAgICAgICAgJ2xvY2F0aW9uOihuYW1lLGNvdW50cnkpJywgJ3JlY29tbWVuZGF0aW9ucy1yZWNlaXZlZCcsICdwaG9uZS1udW1iZXJzJywgJ3ZvbHVudGVlcicsXG4gICAgICAgICdwdWJsaWNhdGlvbnMnLCAnaG9ub3JzLWF3YXJkcycpXG4gICAgICAucmVzdWx0KGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAganNvblJlc3VtZU91dHB1dCA9IGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3MoZGF0YS52YWx1ZXNbMF0pO1xuICAgICAgICB2YXIgb3V0cHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ291dHB1dCcpO1xuICAgICAgICBvdXRwdXQuaW5uZXJIVE1MID0gSlNPTi5zdHJpbmdpZnkoanNvblJlc3VtZU91dHB1dCwgdW5kZWZpbmVkLCAyKTtcbiAgICAgICAgUHJpc20uaGlnaGxpZ2h0RWxlbWVudChvdXRwdXQpO1xuICAgICAgICBkb3dubG9hZEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIH0pO1xuICB9O1xuXG4gIHZhciBvbkxpbmtlZEluTG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIElOLkV2ZW50Lm9uKElOLCAnYXV0aCcsIG9uTGlua2VkSW5BdXRoKTtcbiAgfTtcblxuICB3aW5kb3cub25MaW5rZWRJbkxvYWQgPSBvbkxpbmtlZEluTG9hZDtcbn0pKCk7Il19
