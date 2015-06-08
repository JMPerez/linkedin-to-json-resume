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
        phone: source.phoneNumbers._total ? source.phoneNumbers.values[0].phoneNumber : '',
        website: '',
        summary: source.summary,
        location: {
          address: '',
          postalCode: '',
          city: source.location.name,
          countryCode: source.location.country.code.toUpperCase(),
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
          position: position.title,
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
      var jsonResumeOutput = linkedinToJsonResume.process(data.values[0]);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam1wZXJlei9naXRodWIvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvY29udmVydGVyLmpzIiwiL1VzZXJzL2ptcGVyZXovZ2l0aHViL2xpbmtlZGluLXRvLWpzb24tcmVzdW1lL2pzL2ZpbGUuanMiLCIvVXNlcnMvam1wZXJlei9naXRodWIvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztJQ0dNLG9CQUFvQjtBQUNiLFdBRFAsb0JBQW9CLEdBQ1Y7MEJBRFYsb0JBQW9CO0dBR3ZCOztlQUhHLG9CQUFvQjs7V0FLakIsaUJBQUMsT0FBTyxFQUFFO0FBQ2YsVUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFVBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3JDLFVBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLFVBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDckMsVUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN4QyxVQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3pDLFVBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDckMsYUFBTyxNQUFNLENBQUM7S0FDZjs7O1dBRWEsd0JBQUMsTUFBTSxFQUFFLE1BQU0sRUFB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ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCBtb2R1bGUgKi9cbi8qIGV4cG9ydGVkIG9uTGlua2VkSW5Mb2FkICovXG5cbmNsYXNzIExpbmtlZEluVG9Kc29uUmVzdW1lIHtcbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgfVxuXG4gIHByb2Nlc3MocHJvZmlsZSkge1xuICAgIGxldCB0YXJnZXQgPSB7fTtcbiAgICB0aGlzLl9wcm9jZXNzQmFzaWNzKHByb2ZpbGUsIHRhcmdldCk7XG4gICAgdGhpcy5fcHJvY2Vzc1dvcmsocHJvZmlsZSwgdGFyZ2V0KTtcbiAgICB0aGlzLl9wcm9jZXNzRWR1Y2F0aW9uKHByb2ZpbGUsIHRhcmdldCk7XG4gICAgdGhpcy5fcHJvY2Vzc1NraWxscyhwcm9maWxlLCB0YXJnZXQpO1xuICAgIHRoaXMuX3Byb2Nlc3NMYW5ndWFnZXMocHJvZmlsZSwgdGFyZ2V0KTtcbiAgICB0aGlzLl9wcm9jZXNzUmVmZXJlbmNlcyhwcm9maWxlLCB0YXJnZXQpO1xuICAgIHRoaXMuX3Byb2Nlc3NWb2x1bnRlZXIocHJvZmlsZSwgdGFyZ2V0KTtcbiAgICB0aGlzLl9wcm9jZXNzQXdhcmRzKHByb2ZpbGUsIHRhcmdldCk7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIF9wcm9jZXNzQmFzaWNzKHNvdXJjZSwgdGFyZ2V0KSB7XG4gICAgdGFyZ2V0LmJhc2ljcyA9IHtcbiAgICAgIG5hbWU6IHNvdXJjZS5maXJzdE5hbWUgKyAnICcgKyBzb3VyY2UubGFzdE5hbWUsXG4gICAgICBsYWJlbDogc291cmNlLmhlYWRsaW5lLFxuICAgICAgcGljdHVyZTogc291cmNlLnBpY3R1cmVVcmwsXG4gICAgICBlbWFpbDogc291cmNlLmVtYWlsQWRkcmVzcyxcbiAgICAgIHBob25lOiBzb3VyY2UucGhvbmVOdW1iZXJzLl90b3RhbCA/IHNvdXJjZS5waG9uZU51bWJlcnMudmFsdWVzWzBdLnBob25lTnVtYmVyIDogJycsXG4gICAgICB3ZWJzaXRlOiAnJyxcbiAgICAgIHN1bW1hcnk6IHNvdXJjZS5zdW1tYXJ5LFxuICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgYWRkcmVzczogJycsXG4gICAgICAgIHBvc3RhbENvZGU6ICcnLFxuICAgICAgICBjaXR5OiBzb3VyY2UubG9jYXRpb24ubmFtZSxcbiAgICAgICAgY291bnRyeUNvZGU6IHNvdXJjZS5sb2NhdGlvbi5jb3VudHJ5LmNvZGUudG9VcHBlckNhc2UoKSxcbiAgICAgICAgcmVnaW9uOiAnJ1xuICAgICAgfSxcbiAgICAgIHByb2ZpbGVzOiBbXVxuICAgIH07XG4gIH1cblxuICBfcHJvY2Vzc1dvcmsoc291cmNlLCB0YXJnZXQpIHtcblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NQb3NpdGlvbihwb3NpdGlvbikge1xuICAgICAgbGV0IG9iamVjdCA9IHtcbiAgICAgICAgY29tcGFueTogcG9zaXRpb24uY29tcGFueS5uYW1lLFxuICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24udGl0bGUsXG4gICAgICAgIHdlYnNpdGU6ICcnLFxuICAgICAgICBzdGFydERhdGU6IHBvc2l0aW9uLnN0YXJ0RGF0ZS55ZWFyICsgJy0nICsgKHBvc2l0aW9uLnN0YXJ0RGF0ZS5tb250aCA8IDEwID8gJzAnIDogJycpICsgcG9zaXRpb24uc3RhcnREYXRlLm1vbnRoICsgJy0wMScsXG4gICAgICAgIHN1bW1hcnk6IHBvc2l0aW9uLnN1bW1hcnksXG4gICAgICAgIGhpZ2hsaWdodHM6IFtdXG4gICAgICB9O1xuXG4gICAgICBpZiAocG9zaXRpb24uZW5kRGF0ZSkge1xuICAgICAgICBvYmplY3QuZW5kRGF0ZSA9IHBvc2l0aW9uLmVuZERhdGUueWVhciArICctJyArIChwb3NpdGlvbi5lbmREYXRlLm1vbnRoIDwgMTAgPyAnMCcgOiAnJykgKyBwb3NpdGlvbi5lbmREYXRlLm1vbnRoICsgJy0wMSc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgbGV0IHdvcmsgPSBzb3VyY2UucG9zaXRpb25zICYmIHNvdXJjZS5wb3NpdGlvbnMudmFsdWVzID9cbiAgICAgIHNvdXJjZS5wb3NpdGlvbnMudmFsdWVzLm1hcChwcm9jZXNzUG9zaXRpb24pIDogW107XG5cbiAgICB0YXJnZXQud29yayA9IHdvcms7XG4gIH1cblxuICBfcHJvY2Vzc0VkdWNhdGlvbihzb3VyY2UsIHRhcmdldCkge1xuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc0VkdWNhdGlvbihlZHVjYXRpb24pIHtcbiAgICAgIGxldCBvYmplY3QgPSB7XG4gICAgICAgIGluc3RpdHV0aW9uOiBlZHVjYXRpb24uc2Nob29sTmFtZSxcbiAgICAgICAgYXJlYTogZWR1Y2F0aW9uLmZpZWxkT2ZTdHVkeSxcbiAgICAgICAgc3R1ZHlUeXBlOiBlZHVjYXRpb24uZGVncmVlLFxuICAgICAgICBzdGFydERhdGU6ICcnICsgZWR1Y2F0aW9uLnN0YXJ0RGF0ZS55ZWFyICsgJy0wMS0wMScsXG4gICAgICAgIGdwYTogJycsXG4gICAgICAgIGNvdXJzZXM6IFtdIC8vIGV2ZW4gdGhvdWdoIHRoZXkgYXJlIHJldHVybmVkIHRocm91Z2ggdGhlIEFQSSwgdGhleSBjYW4ndFxuICAgICAgICAgICAgICAgICAgICAvLyBiZSB0cmFja2VkIGJhY2sgdG8gYSBzY2hvb2wvZWR1Y2F0aW9uIGVudHJ5XG4gICAgICB9O1xuXG4gICAgICBpZiAoZWR1Y2F0aW9uLmVuZERhdGUpIHtcbiAgICAgICAgb2JqZWN0LmVuZERhdGUgPSBlZHVjYXRpb24uZW5kRGF0ZS55ZWFyICsgJy0wMS0wMSc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgbGV0IGVkdWNhdGlvbiA9IHNvdXJjZS5lZHVjYXRpb25zICYmIHNvdXJjZS5lZHVjYXRpb25zLnZhbHVlcyA/XG4gICAgICBzb3VyY2UuZWR1Y2F0aW9ucy52YWx1ZXMubWFwKHByb2Nlc3NFZHVjYXRpb24pIDogW107XG4gIFxuICAgIHRhcmdldC5lZHVjYXRpb24gPSBlZHVjYXRpb247XG4gIH1cblxuICBfcHJvY2Vzc1NraWxscyhzb3VyY2UsIHRhcmdldCkge1xuXG4gICAgbGV0IHNraWxscyA9IHNvdXJjZS5za2lsbHMgJiYgc291cmNlLnNraWxscy52YWx1ZXMgP1xuICAgICAgc291cmNlLnNraWxscy52YWx1ZXMubWFwKHNraWxsID0+ICh7XG4gICAgICAgIG5hbWU6IHNraWxsLnNraWxsLm5hbWUsXG4gICAgICAgIGxldmVsOiAnJyxcbiAgICAgICAga2V5d29yZHM6IFtdXG4gICAgICB9KSkgOiBbXTtcblxuICAgIHRhcmdldC5za2lsbHMgPSBza2lsbHM7XG4gIH1cblxuICBfcHJvY2Vzc0xhbmd1YWdlcyhzb3VyY2UsIHRhcmdldCkge1xuXG4gICAgbGV0IGxhbmd1YWdlcyA9IHNvdXJjZS5sYW5ndWFnZXMgJiZcbiAgICAgIHNvdXJjZS5sYW5ndWFnZXMudmFsdWVzID8gc291cmNlLmxhbmd1YWdlcy52YWx1ZXMubWFwKGxhbmd1YWdlID0+ICh7XG4gICAgICAgIGxhbmd1YWdlOiBsYW5ndWFnZS5sYW5ndWFnZS5uYW1lLFxuICAgICAgICBmbHVlbmN5OiAnJ1xuICAgICAgfSkpIDogW107XG5cbiAgICB0YXJnZXQubGFuZ3VhZ2VzID0gbGFuZ3VhZ2VzO1xuICB9XG5cbiAgX3Byb2Nlc3NSZWZlcmVuY2VzKHNvdXJjZSwgdGFyZ2V0KSB7XG5cbiAgICBsZXQgcmVmZXJlbmNlcyA9IHNvdXJjZS5yZWNvbW1lbmRhdGlvbnNSZWNlaXZlZCAmJlxuICAgICAgc291cmNlLnJlY29tbWVuZGF0aW9uc1JlY2VpdmVkLnZhbHVlcyA/IHNvdXJjZS5yZWNvbW1lbmRhdGlvbnNSZWNlaXZlZC52YWx1ZXMubWFwKHJlZmVyZW5jZSA9PiAoe1xuICAgICAgICBuYW1lOiByZWZlcmVuY2UucmVjb21tZW5kZXIuZmlyc3ROYW1lICsgJyAnICsgcmVmZXJlbmNlLnJlY29tbWVuZGVyLmxhc3ROYW1lLFxuICAgICAgICByZWZlcmVuY2U6IHJlZmVyZW5jZS5yZWNvbW1lbmRhdGlvblRleHRcbiAgICAgIH0pKSA6IFtdO1xuXG4gICAgdGFyZ2V0LnJlZmVyZW5jZXMgPSByZWZlcmVuY2VzO1xuICB9XG5cbiAgX3Byb2Nlc3NWb2x1bnRlZXIoc291cmNlLCB0YXJnZXQpIHtcblxuICAgIGxldCB2b2x1bnRlZXIgPSBzb3VyY2Uudm9sdW50ZWVyICYmIHNvdXJjZS52b2x1bnRlZXIudmFsdWVzID9cbiAgICAgICAgc291cmNlLnZvbHVudGVlci52b2x1bnRlZXJFeHBlcmllbmNlcy52YWx1ZXMubWFwKHZvbHVudGVlciA9PiAoe1xuICAgICAgICAgIG9yZ2FuaXphdGlvbjogdm9sdW50ZWVyLm9yZ2FuaXphdGlvbi5uYW1lLFxuICAgICAgICAgIHBvc2l0aW9uOiB2b2x1bnRlZXIucm9sZVxuICAgICAgICAgIC8vIHVuZm9ydHVuYXRlbHksIHN0YXJ0RGF0ZSBhbmQgZW5kRGF0ZSBhcmUgbm90IGV4cG9zZWRcbiAgICAgICAgICAvLyBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubGlua2VkaW4uY29tL2ZvcnVtL2RhdGVzLXZvbHVudGVlci1leHBlcmllbmNlXG4gICAgICAgIH0pKSA6IFtdO1xuXG4gICAgdGFyZ2V0LnZvbHVudGVlciA9IHZvbHVudGVlcjtcbiAgfVxuXG4gIF9wcm9jZXNzQXdhcmRzKHNvdXJjZSwgdGFyZ2V0KSB7XG5cbiAgICBsZXQgYXdhcmRzID0gc291cmNlLmhvbm9yc0F3YXJkcyAmJlxuICAgICAgICBzb3VyY2UuaG9ub3JzQXdhcmRzLnZhbHVlcyA/IHNvdXJjZS5ob25vcnNBd2FyZHMudmFsdWVzLm1hcChob25vcnNBd2FyZCA9PiAoe1xuICAgICAgICAgIGF3YXJkZXI6IGhvbm9yc0F3YXJkLmlzc3VlcixcbiAgICAgICAgICB0aXRsZTogaG9ub3JzQXdhcmQubmFtZVxuICAgICAgICAgIC8vIHVuZm9ydHVuYXRlbHksIHN0YXJ0RGF0ZSBhbmQgZW5kRGF0ZSBhcmUgbm90IGV4cG9zZWRcbiAgICAgICAgfSkpIDogW107XG5cbiAgICB0YXJnZXQuYXdhcmRzID0gYXdhcmRzO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGlua2VkSW5Ub0pzb25SZXN1bWU7IiwiLyogZ2xvYmFsIFVSTCwgQmxvYiwgbW9kdWxlICovXG4vKiBleHBvcnRlZCBzYXZlICovXG52YXIgc2F2ZSA9IChmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIHNhdmVBcyBmcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL01yU3dpdGNoLzM1NTI5ODVcbiAgdmFyIHNhdmVBcyA9IHdpbmRvdy5zYXZlQXMgfHwgKHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlQmxvYiA/IGZ1bmN0aW9uIChiLCBuKSB7XG4gICAgICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci5tc1NhdmVCbG9iKGIsIG4pO1xuICAgIH0gOiBmYWxzZSkgfHwgd2luZG93LndlYmtpdFNhdmVBcyB8fCB3aW5kb3cubW96U2F2ZUFzIHx8IHdpbmRvdy5tc1NhdmVBcyB8fCAoZnVuY3Rpb24gKCkge1xuXG4gICAgICAvLyBVUkwnc1xuICAgICAgd2luZG93LlVSTCA9IHdpbmRvdy5VUkwgfHwgd2luZG93LndlYmtpdFVSTDtcblxuICAgICAgaWYgKCF3aW5kb3cuVVJMKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChibG9iLCBuYW1lKSB7XG4gICAgICAgIHZhciB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG4gICAgICAgIC8vIFRlc3QgZm9yIGRvd25sb2FkIGxpbmsgc3VwcG9ydFxuICAgICAgICBpZiAoJ2Rvd25sb2FkJyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJykpIHtcblxuICAgICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdocmVmJywgdXJsKTtcbiAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBuYW1lKTtcblxuICAgICAgICAgIC8vIENyZWF0ZSBDbGljayBldmVudFxuICAgICAgICAgIHZhciBjbGlja0V2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ01vdXNlRXZlbnQnKTtcbiAgICAgICAgICBjbGlja0V2ZW50LmluaXRNb3VzZUV2ZW50KCdjbGljaycsIHRydWUsIHRydWUsIHdpbmRvdywgMCxcbiAgICAgICAgICAgIDAsIDAsIDAsIDAsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCAwLCBudWxsKTtcblxuICAgICAgICAgIC8vIGRpc3BhdGNoIGNsaWNrIGV2ZW50IHRvIHNpbXVsYXRlIGRvd25sb2FkXG4gICAgICAgICAgYS5kaXNwYXRjaEV2ZW50KGNsaWNrRXZlbnQpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZmFsbG92ZXIsIG9wZW4gcmVzb3VyY2UgaW4gbmV3IHRhYi5cbiAgICAgICAgICB3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnLCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkoKTtcblxuICBmdW5jdGlvbiBfc2F2ZSAodGV4dCwgZmlsZU5hbWUpIHtcbiAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKFt0ZXh0XSwge1xuICAgICAgdHlwZTogJ3RleHQvcGxhaW4nXG4gICAgfSk7XG4gICAgc2F2ZUFzKGJsb2IsIGZpbGVOYW1lIHx8ICdzdWJ0aXRsZS5zcnQnKTtcbiAgfVxuXG4gIHJldHVybiBfc2F2ZTtcblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzYXZlOyIsIi8qIGdsb2JhbCBJTiwgUHJpc20gKi9cbi8qIGV4cG9ydGVkIG9uTGlua2VkSW5Mb2FkICovXG5cbmltcG9ydCBMaW5rZWRJblRvSnNvblJlc3VtZSBmcm9tICcuL2NvbnZlcnRlci5qcyc7XG5pbXBvcnQgc2F2ZSBmcm9tICcuL2ZpbGUuanMnO1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIganNvblJlc3VtZU91dHB1dCA9IG51bGw7XG5cbiAgdmFyIGxpbmtlZGluVG9Kc29uUmVzdW1lID0gbmV3IExpbmtlZEluVG9Kc29uUmVzdW1lKCk7XG5cbiAgdmFyIGRvd25sb2FkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRvd25sb2FkJyk7XG4gIGRvd25sb2FkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgc2F2ZShKU09OLnN0cmluZ2lmeShqc29uUmVzdW1lT3V0cHV0LCB1bmRlZmluZWQsIDIpLCAncmVzdW1lLmpzb24nKTtcbiAgfSk7XG4gIGRvd25sb2FkQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHZhciBvbkxpbmtlZEluQXV0aCA9IGZ1bmN0aW9uKCkge1xuICAgIElOLkFQSS5Qcm9maWxlKCdtZScpXG4gICAgICAuZmllbGRzKCdmaXJzdE5hbWUnLCAnbGFzdE5hbWUnLCAnaGVhZGxpbmUnLCAncGljdHVyZS11cmwnLCAnc3VtbWFyeScsICdzcGVjaWFsdGllcycsXG4gICAgICAgICdwb3NpdGlvbnMnLCAnZW1haWwtYWRkcmVzcycsICdsYW5ndWFnZXMnLCAnc2tpbGxzJywgJ2VkdWNhdGlvbnMnLFxuICAgICAgICAnbG9jYXRpb246KG5hbWUsY291bnRyeSknLCAncmVjb21tZW5kYXRpb25zLXJlY2VpdmVkJywgJ3Bob25lLW51bWJlcnMnLCAndm9sdW50ZWVyJyxcbiAgICAgICAgJ3B1YmxpY2F0aW9ucycsICdob25vcnMtYXdhcmRzJylcbiAgICAgIC5yZXN1bHQoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB2YXIganNvblJlc3VtZU91dHB1dCA9IGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3MoZGF0YS52YWx1ZXNbMF0pO1xuICAgICAgICB2YXIgb3V0cHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ291dHB1dCcpO1xuICAgICAgICBvdXRwdXQuaW5uZXJIVE1MID0gSlNPTi5zdHJpbmdpZnkoanNvblJlc3VtZU91dHB1dCwgdW5kZWZpbmVkLCAyKTtcbiAgICAgICAgUHJpc20uaGlnaGxpZ2h0RWxlbWVudChvdXRwdXQpO1xuICAgICAgICBkb3dubG9hZEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIH0pO1xuICB9O1xuXG4gIHZhciBvbkxpbmtlZEluTG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIElOLkV2ZW50Lm9uKElOLCAnYXV0aCcsIG9uTGlua2VkSW5BdXRoKTtcbiAgfTtcblxuICB3aW5kb3cub25MaW5rZWRJbkxvYWQgPSBvbkxpbmtlZEluTG9hZDtcbn0pKCk7Il19
