(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* exported onLinkedInLoad */

// todo: import publications, awards, volunteer
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var LinkedInToJsonResume = (function () {
  function LinkedInToJsonResume() {
    _classCallCheck(this, LinkedInToJsonResume);

    this.target = {};
  }

  _createClass(LinkedInToJsonResume, [{
    key: 'getOutput',
    value: function getOutput() {
      // sort the object
      var propertyOrder = ['basics', 'work', 'volunteer', 'education', 'awards', 'publications', 'skills', 'languages', 'interests', 'references', 'projects'];

      var sortedTarget = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = propertyOrder[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var p = _step.value;

          if (p in this.target) {
            sortedTarget[p] = this.target[p];
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return sortedTarget;
    }
  }, {
    key: '_extend',
    value: function _extend(target, source) {
      target = target || {};
      Object.keys(source).forEach(function (key) {
        return target[key] = source[key];
      });
    }
  }, {
    key: 'processProfile',
    value: function processProfile(source) {
      this.target.basics = this.target.basics || {};
      this._extend(this.target.basics, {
        name: source.firstName + ' ' + source.lastName,
        label: source.headline,
        picture: source.pictureUrl,
        phone: source.phoneNumbers && source.phoneNumbers._total ? source.phoneNumbers.values[0].phoneNumber : '',
        website: '',
        summary: source.summary,
        location: {
          address: source.address,
          postalCode: '',
          city: source.location ? source.location.name : '',
          countryCode: source.location ? source.location.country.code.toUpperCase() : '',
          region: ''
        },
        profiles: []
      });
    }
  }, {
    key: 'processEmail',
    value: function processEmail(source) {
      this.target.basics = this.target.basics || {};
      this._extend(this.target.basics, { 'email': source.address });
    }
  }, {
    key: 'processPosition',
    value: function processPosition(source) {

      function processPosition(position) {
        var object = {
          company: position.companyName,
          position: position.title || '',
          website: '',
          startDate: position.startDate.year + '-' + (position.startDate.month < 10 ? '0' : '') + position.startDate.month + '-01',
          summary: position.description,
          highlights: []
        };

        if (position.endDate) {
          object.endDate = position.endDate.year + '-' + (position.endDate.month < 10 ? '0' : '') + position.endDate.month + '-01';
        }

        return object;
      }

      this.target.work = source.map(processPosition);
    }
  }, {
    key: 'processEducation',
    value: function processEducation(source) {

      function processEducation(education) {
        var object = {
          institution: education.schoolName,
          area: '',
          studyType: education.degree,
          startDate: education.startDate + '-01-01',
          gpa: '',
          courses: []
        };

        if (education.endDate) {
          object.endDate = education.endDate + '-01-01';
        }

        return object;
      }

      this.target.education = source.map(processEducation);
    }
  }, {
    key: 'processSkills',
    value: function processSkills(skills) {

      this.target.skills = skills.map(function (skill) {
        return {
          name: skill,
          level: '',
          keywords: []
        };
      });
    }
  }, {
    key: 'processLanguages',
    value: function processLanguages(source) {

      function cleanProficiencyString(proficiency) {
        proficiency = proficiency.toLowerCase().replace(/_/g, ' ');
        return proficiency[0].toUpperCase() + proficiency.substr(1);
      }

      this.target.languages = source.map(function (language) {
        return {
          language: language.name,
          fluency: language.proficiency ? cleanProficiencyString(language.proficiency) : null
        };
      });
    }
  }, {
    key: 'processReferences',
    value: function processReferences(source) {

      this.target.references = source.map(function (reference) {
        return {
          name: reference.recommenderFirstName + ' ' + reference.recommenderLastName + ' - ' + reference.recommenderCompany,
          reference: reference.recommendationBody
        };
      });
    }
  }, {
    key: 'processInterests',
    value: function processInterests(source) {

      this.target.interests = source.map(function (interest) {
        return {
          name: interest,
          keywords: []
        };
      });
    }
  }, {
    key: 'processProjects',
    value: function processProjects(source) {

      function processProjects(project) {

        var p = {
          name: project.title,
          startDate: project.startDate.year + '-' + (project.startDate.month < 10 ? '0' : '') + project.startDate.month + '-01',
          summary: project.description,
          url: project.url
        };
        if (project.endDate) {
          p.endDate = project.endDate.year + '-' + (project.endDate.month < 10 ? '0' : '') + project.endDate.month + '-01';
        }
        return p;
      }

      this.target.projects = source.map(processProjects);
    }
  }]);

  return LinkedInToJsonResume;
})();

exports['default'] = LinkedInToJsonResume;
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
/* global module */
'use strict';

(function () {
  // ref: http://stackoverflow.com/a/1293163/2343
  // This will parse a delimited string into an array of
  // arrays. The default delimiter is the comma, but this
  // can be overriden in the second argument.
  function CSVToArray(strData) {
    var strDelimiter = arguments.length <= 1 || arguments[1] === undefined ? ',' : arguments[1];

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp('(\\' + strDelimiter + '|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\' + strDelimiter + '\\r\\n]*))', 'gi');

    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;

    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    do {
      arrMatches = objPattern.exec(strData);
      if (!arrMatches) {
        break;
      }

      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[1];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {

        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push([]);
      }

      var strMatchedValue = undefined;

      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[2]) {

        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[2].replace(new RegExp('\"\"', 'g'), '\"');
      } else {

        // We found a non-quoted value.
        strMatchedValue = arrMatches[3];
      }

      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue ? strMatchedValue.trim() : strMatchedValue);
    } while (true);

    // Return the parsed data.
    return arrData;
  }

  module.exports = CSVToArray;
})();

},{}],3:[function(require,module,exports){
/* global URL, Blob  */
/* exported save */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var save = (function () {
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

exports['default'] = save;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
/* global zip, Prism */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _converterJs = require('./converter.js');

var _converterJs2 = _interopRequireDefault(_converterJs);

var _csvtoarrayJs = require('./csvtoarray.js');

var _csvtoarrayJs2 = _interopRequireDefault(_csvtoarrayJs);

var _fileJs = require('./file.js');

var _fileJs2 = _interopRequireDefault(_fileJs);

(function () {
  var filedrag = document.getElementById('filedrag');
  var fileselect = document.getElementById('fileselect');
  var fileName = null;

  // file drag hover
  function fileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = e.type === 'dragover' ? 'hover' : '';
  }

  var linkedinToJsonResume = new _converterJs2['default']();

  var downloadButton = document.querySelector('.download');
  downloadButton.addEventListener('click', function () {
    (0, _fileJs2['default'])(JSON.stringify(linkedinToJsonResume.getOutput(), undefined, 2), 'resume.json');
  });
  downloadButton.style.display = 'none';

  // file selection
  function fileSelectHandler(e) {
    // cancel event and hover styling
    fileDragHover(e);

    var droppedFiles = e.target.files || e.dataTransfer.files;

    var file = droppedFiles[0];
    fileName = file.name;

    var readBlob = function readBlob(blob) {
      return new Promise(function (resolve) {
        var reader = new FileReader();
        reader.onload = function (e) {
          resolve(e.target.result);
        };
        reader.readAsText(blob);
      });
    };

    var readEntryContents = function readEntryContents(entry) {
      return new Promise(function (resolve) {
        entry.getData(new zip.BlobWriter('text/plain'), function (blob) {
          readBlob(blob).then(resolve);
        });
      });
    };

    var getEntries = function getEntries(file, onend) {
      zip.createReader(new zip.BlobReader(file), function (zipReader) {
        zipReader.getEntries(onend);
      }, onerror);
    };

    getEntries(file, function (entries) {

      var promises = entries.map(function (entry) {

        switch (entry.filename) {
          case 'Skills.csv':
            return readEntryContents(entry).then(function (contents) {
              contents = contents.replace(/"/g, '');
              var elements = contents.split('\n');
              elements = elements.slice(1, elements.length - 1);
              linkedinToJsonResume.processSkills(elements);
              return;
            });

          case 'Education.csv':
            return readEntryContents(entry).then(function (contents) {
              var elements = (0, _csvtoarrayJs2['default'])(contents);
              var education = elements.slice(1, elements.length - 1).map(function (elem) {
                return {
                  schoolName: elem[0],
                  startDate: elem[1],
                  endDate: elem[2],
                  notes: elem[3],
                  degree: elem[4],
                  activities: elem[5]
                };
              });
              linkedinToJsonResume.processEducation(education.sort(function (e1, e2) {
                return +e2.startDate.year - +e1.startDate.year || +e2.startDate.month - +e1.startDate.month;
              }));
              return;
            });

          case 'Positions.csv':
            return readEntryContents(entry).then(function (contents) {
              var elements = (0, _csvtoarrayJs2['default'])(contents);
              var positions = elements.slice(1, elements.length - 1).map(function (elem) {
                return {
                  companyName: elem[0],
                  description: elem[1],
                  location: elem[2],

                  startDate: {
                    year: elem[3].split('/')[1],
                    month: elem[3].split('/')[0]
                  },

                  endDate: elem[4] ? {
                    year: elem[4].split('/')[1],
                    month: elem[4].split('/')[0]
                  } : null,

                  title: elem[5]
                };
              });
              linkedinToJsonResume.processPosition(positions.sort(function (p1, p2) {
                return +p2.startDate.year - +p1.startDate.year || +p2.startDate.month - +p1.startDate.month;
              }));
              return;
            });

          case 'Languages.csv':
            return readEntryContents(entry).then(function (contents) {
              var elements = (0, _csvtoarrayJs2['default'])(contents);
              var languages = elements.slice(1, elements.length - 1).map(function (elem) {
                return {
                  name: elem[0],
                  proficiency: elem[1]
                };
              });
              linkedinToJsonResume.processLanguages(languages);
              return;
            });

          case 'Recommendations Received.csv':
            return readEntryContents(entry).then(function (contents) {
              var elements = (0, _csvtoarrayJs2['default'])(contents);
              var recommendations = elements.slice(1, elements.length - 1).map(function (elem) {
                return {
                  recommenderFirstName: elem[0],
                  recommenderLastName: elem[1],
                  recommendationDate: elem[2],
                  recommendationBody: elem[3],
                  recommenderCompany: elem[4],
                  recommenderTitle: elem[5],
                  displayStatus: elem[6]
                };
              }).filter(function (recommendation) {
                return recommendation.displayStatus === 'VISIBLE';
              });
              linkedinToJsonResume.processReferences(recommendations);
              return;
            });

          case 'Profile.csv':
            return readEntryContents(entry).then(function (contents) {
              var elements = (0, _csvtoarrayJs2['default'])(contents);
              var profile = {
                firstName: elements[1][0],
                lastName: elements[1][1],
                maidenName: elements[1][2],
                createdDate: elements[1][3],
                address: elements[1][4],
                birthDate: elements[1][5],
                contactInstructions: elements[1][6],
                maritalStatus: elements[1][7],
                headline: elements[1][8],
                summary: elements[1][9],
                industry: elements[1][10],
                association: elements[1][11]
              };
              linkedinToJsonResume.processProfile(profile);
              return;
            });

          case 'Email Addresses.csv':
            return readEntryContents(entry).then(function (contents) {
              var elements = (0, _csvtoarrayJs2['default'])(contents, '\t'); // yes, recommendations use tab-delimiter
              var email = elements.slice(1, elements.length - 1).map(function (elem) {
                return {
                  address: elem[0],
                  status: elem[1],
                  isPrimary: elem[2] === 'Yes',
                  dateAdded: elem[3],
                  dateRemoved: elem[4]
                };
              }).filter(function (email) {
                return email.isPrimary;
              });
              if (email.length) {
                linkedinToJsonResume.processEmail(email[0]);
              }
              return;
            });

          case 'Interests.csv':
            return readEntryContents(entry).then(function (contents) {
              var elements = (0, _csvtoarrayJs2['default'])(contents);
              var interests = [];
              elements.slice(1, elements.length - 1).forEach(function (elem) {
                interests = interests.concat(elem[0].split(','));
              });
              linkedinToJsonResume.processInterests(interests);
              return;
            });

          case 'Projects.csv':
            return readEntryContents(entry).then(function (contents) {
              var elements = (0, _csvtoarrayJs2['default'])(contents);
              var projects = elements.slice(1, elements.length - 1).map(function (elem) {
                return {
                  title: elem[0],

                  startDate: {
                    year: elem[1].split('/')[1],
                    month: elem[1].split('/')[0]
                  },

                  endDate: elem[2] ? {
                    year: elem[2].split('/')[1],
                    month: elem[2].split('/')[0]
                  } : null,

                  description: elem[3],
                  url: elem[4]
                };
              });
              linkedinToJsonResume.processProjects(projects.sort(function (p1, p2) {
                return +p2.startDate.year - +p1.startDate.year || +p2.startDate.month - +p1.startDate.month;
              }));
              return;
            });

          default:
            return Promise.resolve([]);
        }
      });

      Promise.all(promises).then(function () {
        filedrag.innerHTML = 'Dropped! See the resulting JSON Resume at the bottom.';
        var output = document.getElementById('output');
        output.innerHTML = JSON.stringify(linkedinToJsonResume.getOutput(), undefined, 2);
        Prism.highlightElement(output);
        downloadButton.style.display = 'block';
        document.getElementById('result').style.display = 'block';
      });
    });
  }

  // file select
  fileselect.addEventListener('change', fileSelectHandler, false);

  var xhr = new XMLHttpRequest();
  if (xhr.upload) {
    // file drop
    filedrag.addEventListener('dragover', fileDragHover, false);
    filedrag.addEventListener('dragleave', fileDragHover, false);
    filedrag.addEventListener('drop', fileSelectHandler, false);
    filedrag.style.display = 'block';
  } else {
    filedrag.style.display = 'none';
  }

  document.getElementById('select-file').addEventListener('click', function () {
    fileselect.click();
  });

  zip.workerScriptsPath = window.location.pathname + 'vendor/';
})();

},{"./converter.js":1,"./csvtoarray.js":2,"./file.js":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaW5zcGVyaW9uL2dpdC9saW5rZWRpbi10by1qc29uLXJlc3VtZS9qcy9jb252ZXJ0ZXIuanMiLCIvVXNlcnMvaW5zcGVyaW9uL2dpdC9saW5rZWRpbi10by1qc29uLXJlc3VtZS9qcy9jc3Z0b2FycmF5LmpzIiwiL1VzZXJzL2luc3Blcmlvbi9naXQvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvZmlsZS5qcyIsIi9Vc2Vycy9pbnNwZXJpb24vZ2l0L2xpbmtlZGluLXRvLWpzb24tcmVzdW1lL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0lDR00sb0JBQW9CO0FBQ2IsV0FEUCxvQkFBb0IsR0FDVjswQkFEVixvQkFBb0I7O0FBRXRCLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0dBQ2xCOztlQUhHLG9CQUFvQjs7V0FLZixxQkFBRzs7QUFFVixVQUFNLGFBQWEsR0FBRyxDQUNwQixRQUFRLEVBQ1IsTUFBTSxFQUNOLFdBQVcsRUFDWCxXQUFXLEVBQ1gsUUFBUSxFQUNSLGNBQWMsRUFDZCxRQUFRLEVBQ1IsV0FBVyxFQUNYLFdBQVcsRUFDWCxZQUFZLEVBQ1osVUFBVSxDQUNYLENBQUM7O0FBRUYsVUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFDeEIsNkJBQWdCLGFBQWEsOEhBQUU7Y0FBcEIsQ0FBQzs7QUFDVixjQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3BCLHdCQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztXQUNsQztTQUNGOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0QsYUFBTyxZQUFZLENBQUM7S0FDckI7OztXQUVNLGlCQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDdEIs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LE9BQU8sRUFBRSxZQUFNO0FBQ3JFLGNBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztHQUNwQixDQUFDLENBQUM7O0FBRUgsS0FBRyxDQUFDLGlCQUFpQixHQUFNLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxZQUFTLENBQUM7Q0FDOUQsQ0FBQSxFQUFJLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZXhwb3J0ZWQgb25MaW5rZWRJbkxvYWQgKi9cblxuLy8gdG9kbzogaW1wb3J0IHB1YmxpY2F0aW9ucywgYXdhcmRzLCB2b2x1bnRlZXJcbmNsYXNzIExpbmtlZEluVG9Kc29uUmVzdW1lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50YXJnZXQgPSB7fTtcbiAgfVxuXG4gIGdldE91dHB1dCgpIHtcbiAgICAvLyBzb3J0IHRoZSBvYmplY3RcbiAgICBjb25zdCBwcm9wZXJ0eU9yZGVyID0gW1xuICAgICAgJ2Jhc2ljcycsXG4gICAgICAnd29yaycsXG4gICAgICAndm9sdW50ZWVyJyxcbiAgICAgICdlZHVjYXRpb24nLFxuICAgICAgJ2F3YXJkcycsXG4gICAgICAncHVibGljYXRpb25zJyxcbiAgICAgICdza2lsbHMnLFxuICAgICAgJ2xhbmd1YWdlcycsXG4gICAgICAnaW50ZXJlc3RzJyxcbiAgICAgICdyZWZlcmVuY2VzJyxcbiAgICAgICdwcm9qZWN0cydcbiAgICBdO1xuXG4gICAgY29uc3Qgc29ydGVkVGFyZ2V0ID0ge307XG4gICAgZm9yIChjb25zdCBwIG9mIHByb3BlcnR5T3JkZXIpIHtcbiAgICAgIGlmIChwIGluIHRoaXMudGFyZ2V0KSB7XG4gICAgICAgIHNvcnRlZFRhcmdldFtwXSA9IHRoaXMudGFyZ2V0W3BdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc29ydGVkVGFyZ2V0O1xuICB9XG5cbiAgX2V4dGVuZCh0YXJnZXQsIHNvdXJjZSkge1xuICAgIHRhcmdldCA9IHRhcmdldCB8fMKge307XG4gICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGtleSA9PiB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldKTtcbiAgfVxuXG4gIHByb2Nlc3NQcm9maWxlKHNvdXJjZSkge1xuICAgIHRoaXMudGFyZ2V0LmJhc2ljcyA9IHRoaXMudGFyZ2V0LmJhc2ljcyB8fCB7fTtcbiAgICB0aGlzLl9leHRlbmQodGhpcy50YXJnZXQuYmFzaWNzLCB7XG4gICAgICBuYW1lOiBgJHtzb3VyY2UuZmlyc3ROYW1lfSAke3NvdXJjZS5sYXN0TmFtZX1gLFxuICAgICAgbGFiZWw6IHNvdXJjZS5oZWFkbGluZSxcbiAgICAgIHBpY3R1cmU6IHNvdXJjZS5waWN0dXJlVXJsLFxuICAgICAgcGhvbmU6IHNvdXJjZS5waG9uZU51bWJlcnMgJiYgc291cmNlLnBob25lTnVtYmVycy5fdG90YWwgPyBzb3VyY2UucGhvbmVOdW1iZXJzLnZhbHVlc1swXS5waG9uZU51bWJlciA6ICcnLFxuICAgICAgd2Vic2l0ZTogJycsXG4gICAgICBzdW1tYXJ5OiBzb3VyY2Uuc3VtbWFyeSxcbiAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIGFkZHJlc3M6IHNvdXJjZS5hZGRyZXNzLFxuICAgICAgICBwb3N0YWxDb2RlOiAnJyxcbiAgICAgICAgY2l0eTogc291cmNlLmxvY2F0aW9uID8gc291cmNlLmxvY2F0aW9uLm5hbWUgOiAnJyxcbiAgICAgICAgY291bnRyeUNvZGU6IHNvdXJjZS5sb2NhdGlvbiA/IHNvdXJjZS5sb2NhdGlvbi5jb3VudHJ5LmNvZGUudG9VcHBlckNhc2UoKSA6ICcnLFxuICAgICAgICByZWdpb246ICcnXG4gICAgICB9LFxuICAgICAgcHJvZmlsZXM6IFtdXG4gICAgfSk7XG4gIH1cblxuICBwcm9jZXNzRW1haWwoc291cmNlKSB7XG4gICAgdGhpcy50YXJnZXQuYmFzaWNzID0gdGhpcy50YXJnZXQuYmFzaWNzIHx8IHt9O1xuICAgIHRoaXMuX2V4dGVuZCh0aGlzLnRhcmdldC5iYXNpY3MsIHsnZW1haWwnOiBzb3VyY2UuYWRkcmVzc30pO1xuICB9XG5cbiAgcHJvY2Vzc1Bvc2l0aW9uKHNvdXJjZSkge1xuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc1Bvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgICBsZXQgb2JqZWN0ID0ge1xuICAgICAgICBjb21wYW55OiBwb3NpdGlvbi5jb21wYW55TmFtZSxcbiAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLnRpdGxlIHx8ICcnLFxuICAgICAgICB3ZWJzaXRlOiAnJyxcbiAgICAgICAgc3RhcnREYXRlOiBgJHtwb3NpdGlvbi5zdGFydERhdGUueWVhcn0tJHtwb3NpdGlvbi5zdGFydERhdGUubW9udGggPCAxMCA/ICcwJyA6ICcnfSR7cG9zaXRpb24uc3RhcnREYXRlLm1vbnRofS0wMWAsXG4gICAgICAgIHN1bW1hcnk6IHBvc2l0aW9uLmRlc2NyaXB0aW9uLFxuICAgICAgICBoaWdobGlnaHRzOiBbXVxuICAgICAgfTtcblxuICAgICAgaWYgKHBvc2l0aW9uLmVuZERhdGUpIHtcbiAgICAgICAgb2JqZWN0LmVuZERhdGUgPSBgJHtwb3NpdGlvbi5lbmREYXRlLnllYXJ9LSR7cG9zaXRpb24uZW5kRGF0ZS5tb250aCA8IDEwID8gJzAnIDogJyd9JHtwb3NpdGlvbi5lbmREYXRlLm1vbnRofS0wMWA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXQud29yayA9IHNvdXJjZS5tYXAocHJvY2Vzc1Bvc2l0aW9uKTtcbiAgfVxuXG4gIHByb2Nlc3NFZHVjYXRpb24oc291cmNlKSB7XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzRWR1Y2F0aW9uKGVkdWNhdGlvbikge1xuICAgICAgbGV0IG9iamVjdCA9IHtcbiAgICAgICAgaW5zdGl0dXRpb246IGVkdWNhdGlvbi5zY2hvb2xOYW1lLFxuICAgICAgICBhcmVhOiAnJyxcbiAgICAgICAgc3R1ZHlUeXBlOiBlZHVjYXRpb24uZGVncmVlLFxuICAgICAgICBzdGFydERhdGU6IGAke2VkdWNhdGlvbi5zdGFydERhdGV9LTAxLTAxYCxcbiAgICAgICAgZ3BhOiAnJyxcbiAgICAgICAgY291cnNlczogW11cbiAgICAgIH07XG5cbiAgICAgIGlmIChlZHVjYXRpb24uZW5kRGF0ZSkge1xuICAgICAgICBvYmplY3QuZW5kRGF0ZSA9IGAke2VkdWNhdGlvbi5lbmREYXRlfS0wMS0wMWA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXQuZWR1Y2F0aW9uID0gc291cmNlLm1hcChwcm9jZXNzRWR1Y2F0aW9uKTtcbiAgfVxuXG4gIHByb2Nlc3NTa2lsbHMoc2tpbGxzKSB7XG5cbiAgICB0aGlzLnRhcmdldC5za2lsbHMgPSBza2lsbHMubWFwKHNraWxsID0+ICh7XG4gICAgICAgIG5hbWU6IHNraWxsLFxuICAgICAgICBsZXZlbDogJycsXG4gICAgICAgIGtleXdvcmRzOiBbXVxuICAgICAgfSkpO1xuICB9XG5cbiAgcHJvY2Vzc0xhbmd1YWdlcyhzb3VyY2UpIHtcblxuICAgIGZ1bmN0aW9uIGNsZWFuUHJvZmljaWVuY3lTdHJpbmcocHJvZmljaWVuY3kpIHtcbiAgICAgIHByb2ZpY2llbmN5ID0gcHJvZmljaWVuY3kudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9fL2csICcgJyk7XG4gICAgICByZXR1cm4gcHJvZmljaWVuY3lbMF0udG9VcHBlckNhc2UoKSArIHByb2ZpY2llbmN5LnN1YnN0cigxKTtcbiAgICB9XG5cbiAgICB0aGlzLnRhcmdldC5sYW5ndWFnZXMgPSBzb3VyY2UubWFwKGxhbmd1YWdlID0+ICh7XG4gICAgICBsYW5ndWFnZTogbGFuZ3VhZ2UubmFtZSxcbiAgICAgIGZsdWVuY3k6IGxhbmd1YWdlLnByb2ZpY2llbmN5ID8gY2xlYW5Qcm9maWNpZW5jeVN0cmluZyhsYW5ndWFnZS5wcm9maWNpZW5jeSkgOiBudWxsXG4gICAgfSkpO1xuICB9XG5cbiAgcHJvY2Vzc1JlZmVyZW5jZXMoc291cmNlKSB7XG5cbiAgICB0aGlzLnRhcmdldC5yZWZlcmVuY2VzID0gc291cmNlLm1hcChyZWZlcmVuY2UgPT4gKHtcbiAgICAgIG5hbWU6IGAke3JlZmVyZW5jZS5yZWNvbW1lbmRlckZpcnN0TmFtZX0gJHtyZWZlcmVuY2UucmVjb21tZW5kZXJMYXN0TmFtZX0gLSAke3JlZmVyZW5jZS5yZWNvbW1lbmRlckNvbXBhbnl9YCxcbiAgICAgIHJlZmVyZW5jZTogcmVmZXJlbmNlLnJlY29tbWVuZGF0aW9uQm9keVxuICAgIH0pKTtcbiAgfVxuXG4gIHByb2Nlc3NJbnRlcmVzdHMoc291cmNlKSB7XG5cbiAgICB0aGlzLnRhcmdldC5pbnRlcmVzdHMgPSBzb3VyY2UubWFwKGludGVyZXN0ID0+ICh7XG4gICAgICBuYW1lOiBpbnRlcmVzdCxcbiAgICAgIGtleXdvcmRzOiBbXVxuICAgIH0pKTtcbiAgfVxuXG4gIHByb2Nlc3NQcm9qZWN0cyhzb3VyY2UpIHtcblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NQcm9qZWN0cyhwcm9qZWN0KSB7XG5cbiAgICAgICBsZXQgcCA9IHtcbiAgICAgICAgICBuYW1lOiBwcm9qZWN0LnRpdGxlLFxuICAgICAgICAgIHN0YXJ0RGF0ZTogYCR7cHJvamVjdC5zdGFydERhdGUueWVhcn0tJHtwcm9qZWN0LnN0YXJ0RGF0ZS5tb250aCA8IDEwID8gJzAnIDogJyd9JHtwcm9qZWN0LnN0YXJ0RGF0ZS5tb250aH0tMDFgLFxuICAgICAgICAgIHN1bW1hcnk6IHByb2plY3QuZGVzY3JpcHRpb24sXG4gICAgICAgICAgdXJsOiBwcm9qZWN0LnVybFxuICAgICAgICB9O1xuICAgICAgIGlmKHByb2plY3QuZW5kRGF0ZSkge1xuICAgICAgICAgIHAuZW5kRGF0ZSA9IGAke3Byb2plY3QuZW5kRGF0ZS55ZWFyfS0ke3Byb2plY3QuZW5kRGF0ZS5tb250aCA8IDEwID8gJzAnIDogJyd9JHtwcm9qZWN0LmVuZERhdGUubW9udGh9LTAxYDtcbiAgICAgICB9XG4gICAgICAgcmV0dXJuIHA7XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXQucHJvamVjdHMgPSBzb3VyY2UubWFwKHByb2Nlc3NQcm9qZWN0cyk7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBMaW5rZWRJblRvSnNvblJlc3VtZTtcbiIsIi8qIGdsb2JhbCBtb2R1bGUgKi9cbigoKCkgPT4ge1xuICAvLyByZWY6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEyOTMxNjMvMjM0M1xuICAvLyBUaGlzIHdpbGwgcGFyc2UgYSBkZWxpbWl0ZWQgc3RyaW5nIGludG8gYW4gYXJyYXkgb2ZcbiAgLy8gYXJyYXlzLiBUaGUgZGVmYXVsdCBkZWxpbWl0ZXIgaXMgdGhlIGNvbW1hLCBidXQgdGhpc1xuICAvLyBjYW4gYmUgb3ZlcnJpZGVuIGluIHRoZSBzZWNvbmQgYXJndW1lbnQuXG4gIGZ1bmN0aW9uIENTVlRvQXJyYXkoc3RyRGF0YSwgc3RyRGVsaW1pdGVyPScsJykge1xuICAgIC8vIENyZWF0ZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBwYXJzZSB0aGUgQ1NWIHZhbHVlcy5cbiAgICBjb25zdCBvYmpQYXR0ZXJuID0gbmV3IFJlZ0V4cChcbiAgICAgICAgKFxuXG4gICAgICAgICAgICBgKFxcXFwke3N0ckRlbGltaXRlcn18XFxcXHI/XFxcXG58XFxcXHJ8XikoPzpcIihbXlwiXSooPzpcIlwiW15cIl0qKSopXCJ8KFteXCJcXFxcJHtzdHJEZWxpbWl0ZXJ9XFxcXHJcXFxcbl0qKSlgXG4gICAgICAgICksXG4gICAgICAgICdnaSdcbiAgICAgICAgKTtcblxuICAgIC8vIENyZWF0ZSBhbiBhcnJheSB0byBob2xkIG91ciBkYXRhLiBHaXZlIHRoZSBhcnJheVxuICAgIC8vIGEgZGVmYXVsdCBlbXB0eSBmaXJzdCByb3cuXG4gICAgY29uc3QgYXJyRGF0YSA9IFtbXV07XG5cbiAgICAvLyBDcmVhdGUgYW4gYXJyYXkgdG8gaG9sZCBvdXIgaW5kaXZpZHVhbCBwYXR0ZXJuXG4gICAgLy8gbWF0Y2hpbmcgZ3JvdXBzLlxuICAgIGxldCBhcnJNYXRjaGVzID0gbnVsbDtcblxuICAgIC8vIEtlZXAgbG9vcGluZyBvdmVyIHRoZSByZWd1bGFyIGV4cHJlc3Npb24gbWF0Y2hlc1xuICAgIC8vIHVudGlsIHdlIGNhbiBubyBsb25nZXIgZmluZCBhIG1hdGNoLlxuICAgIGRvIHtcbiAgICAgIGFyck1hdGNoZXMgPSBvYmpQYXR0ZXJuLmV4ZWMoc3RyRGF0YSk7XG4gICAgICBpZiAoIWFyck1hdGNoZXMpIHsgYnJlYWs7IH1cblxuICAgICAgLy8gR2V0IHRoZSBkZWxpbWl0ZXIgdGhhdCB3YXMgZm91bmQuXG4gICAgICBjb25zdCBzdHJNYXRjaGVkRGVsaW1pdGVyID0gYXJyTWF0Y2hlc1sgMSBdO1xuXG4gICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGdpdmVuIGRlbGltaXRlciBoYXMgYSBsZW5ndGhcbiAgICAgIC8vIChpcyBub3QgdGhlIHN0YXJ0IG9mIHN0cmluZykgYW5kIGlmIGl0IG1hdGNoZXNcbiAgICAgIC8vIGZpZWxkIGRlbGltaXRlci4gSWYgaWQgZG9lcyBub3QsIHRoZW4gd2Uga25vd1xuICAgICAgLy8gdGhhdCB0aGlzIGRlbGltaXRlciBpcyBhIHJvdyBkZWxpbWl0ZXIuXG4gICAgICBpZiAoXG4gICAgICAgICAgc3RyTWF0Y2hlZERlbGltaXRlci5sZW5ndGggJiZcbiAgICAgICAgICBzdHJNYXRjaGVkRGVsaW1pdGVyICE9PSBzdHJEZWxpbWl0ZXJcbiAgICAgICAgICApIHtcblxuICAgICAgICAvLyBTaW5jZSB3ZSBoYXZlIHJlYWNoZWQgYSBuZXcgcm93IG9mIGRhdGEsXG4gICAgICAgIC8vIGFkZCBhbiBlbXB0eSByb3cgdG8gb3VyIGRhdGEgYXJyYXkuXG4gICAgICAgIGFyckRhdGEucHVzaChbXSk7XG5cbiAgICAgIH1cblxuICAgICAgbGV0IHN0ck1hdGNoZWRWYWx1ZTtcblxuICAgICAgLy8gTm93IHRoYXQgd2UgaGF2ZSBvdXIgZGVsaW1pdGVyIG91dCBvZiB0aGUgd2F5LFxuICAgICAgLy8gbGV0J3MgY2hlY2sgdG8gc2VlIHdoaWNoIGtpbmQgb2YgdmFsdWUgd2VcbiAgICAgIC8vIGNhcHR1cmVkIChxdW90ZWQgb3IgdW5xdW90ZWQpLlxuICAgICAgaWYgKGFyck1hdGNoZXNbIDIgXSkge1xuXG4gICAgICAgIC8vIFdlIGZvdW5kIGEgcXVvdGVkIHZhbHVlLiBXaGVuIHdlIGNhcHR1cmVcbiAgICAgICAgLy8gdGhpcyB2YWx1ZSwgdW5lc2NhcGUgYW55IGRvdWJsZSBxdW90ZXMuXG4gICAgICAgIHN0ck1hdGNoZWRWYWx1ZSA9IGFyck1hdGNoZXNbIDIgXS5yZXBsYWNlKFxuICAgICAgICAgICAgbmV3IFJlZ0V4cCgnXFxcIlxcXCInLCAnZycpLFxuICAgICAgICAgICAgJ1xcXCInXG4gICAgICAgICAgICApO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8vIFdlIGZvdW5kIGEgbm9uLXF1b3RlZCB2YWx1ZS5cbiAgICAgICAgc3RyTWF0Y2hlZFZhbHVlID0gYXJyTWF0Y2hlc1sgMyBdO1xuXG4gICAgICB9XG5cbiAgICAgIC8vIE5vdyB0aGF0IHdlIGhhdmUgb3VyIHZhbHVlIHN0cmluZywgbGV0J3MgYWRkXG4gICAgICAvLyBpdCB0byB0aGUgZGF0YSBhcnJheS5cbiAgICAgIGFyckRhdGFbIGFyckRhdGEubGVuZ3RoIC0gMSBdLnB1c2goc3RyTWF0Y2hlZFZhbHVlID8gc3RyTWF0Y2hlZFZhbHVlLnRyaW0oKSA6IHN0ck1hdGNoZWRWYWx1ZSk7XG4gICAgfSB3aGlsZSAodHJ1ZSk7XG5cbiAgICAvLyBSZXR1cm4gdGhlIHBhcnNlZCBkYXRhLlxuICAgIHJldHVybiBhcnJEYXRhO1xuICB9XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBDU1ZUb0FycmF5O1xufSkpKCk7XG4iLCIvKiBnbG9iYWwgVVJMLCBCbG9iICAqL1xuLyogZXhwb3J0ZWQgc2F2ZSAqL1xuY29uc3Qgc2F2ZSA9ICgoKCkgPT4ge1xuICAvLyBzYXZlQXMgZnJvbSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9NclN3aXRjaC8zNTUyOTg1XG4gIGNvbnN0IHNhdmVBcyA9IHdpbmRvdy5zYXZlQXMgfHwgKHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlQmxvYiA/IChiLCBuKSA9PiB3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZUJsb2IoYiwgbikgOiBmYWxzZSkgfHwgd2luZG93LndlYmtpdFNhdmVBcyB8fCB3aW5kb3cubW96U2F2ZUFzIHx8IHdpbmRvdy5tc1NhdmVBcyB8fCAoKCgpID0+IHtcblxuICAgICAgLy8gVVJMJ3NcbiAgICAgIHdpbmRvdy5VUkwgPSB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkw7XG5cbiAgICAgIGlmICghd2luZG93LlVSTCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoYmxvYiwgbmFtZSkgPT4ge1xuICAgICAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG4gICAgICAgIC8vIFRlc3QgZm9yIGRvd25sb2FkIGxpbmsgc3VwcG9ydFxuICAgICAgICBpZiAoJ2Rvd25sb2FkJyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJykpIHtcblxuICAgICAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB1cmwpO1xuICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIG5hbWUpO1xuXG4gICAgICAgICAgLy8gQ3JlYXRlIENsaWNrIGV2ZW50XG4gICAgICAgICAgY29uc3QgY2xpY2tFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdNb3VzZUV2ZW50Jyk7XG4gICAgICAgICAgY2xpY2tFdmVudC5pbml0TW91c2VFdmVudCgnY2xpY2snLCB0cnVlLCB0cnVlLCB3aW5kb3csIDAsXG4gICAgICAgICAgICAwLCAwLCAwLCAwLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgMCwgbnVsbCk7XG5cbiAgICAgICAgICAvLyBkaXNwYXRjaCBjbGljayBldmVudCB0byBzaW11bGF0ZSBkb3dubG9hZFxuICAgICAgICAgIGEuZGlzcGF0Y2hFdmVudChjbGlja0V2ZW50KTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGZhbGxvdmVyLCBvcGVuIHJlc291cmNlIGluIG5ldyB0YWIuXG4gICAgICAgICAgd2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJywgJycpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKSgpO1xuXG4gIGZ1bmN0aW9uIF9zYXZlKHRleHQsIGZpbGVOYW1lKSB7XG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFt0ZXh0XSwge1xuICAgICAgdHlwZTogJ3RleHQvcGxhaW4nXG4gICAgfSk7XG4gICAgc2F2ZUFzKGJsb2IsIGZpbGVOYW1lIHx8ICdzdWJ0aXRsZS5zcnQnKTtcbiAgfVxuXG4gIHJldHVybiBfc2F2ZTtcbn0pKSgpO1xuXG5leHBvcnQgZGVmYXVsdCBzYXZlO1xuIiwiLyogZ2xvYmFsIHppcCwgUHJpc20gKi9cblxuaW1wb3J0IExpbmtlZEluVG9Kc29uUmVzdW1lIGZyb20gJy4vY29udmVydGVyLmpzJztcbmltcG9ydCBjc3ZUb0FycmF5IGZyb20gJy4vY3N2dG9hcnJheS5qcyc7XG5pbXBvcnQgc2F2ZSBmcm9tICcuL2ZpbGUuanMnO1xuXG4oKCgpID0+IHtcbiAgY29uc3QgZmlsZWRyYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZWRyYWcnKTtcbiAgY29uc3QgZmlsZXNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlc2VsZWN0Jyk7XG4gIGxldCBmaWxlTmFtZSA9IG51bGw7XG5cbiAgLy8gZmlsZSBkcmFnIGhvdmVyXG4gIGZ1bmN0aW9uIGZpbGVEcmFnSG92ZXIoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUudGFyZ2V0LmNsYXNzTmFtZSA9IChlLnR5cGUgPT09ICdkcmFnb3ZlcicgPyAnaG92ZXInIDogJycpO1xuICB9XG5cbiAgY29uc3QgbGlua2VkaW5Ub0pzb25SZXN1bWUgPSBuZXcgTGlua2VkSW5Ub0pzb25SZXN1bWUoKTtcblxuICBjb25zdCBkb3dubG9hZEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kb3dubG9hZCcpO1xuICBkb3dubG9hZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBzYXZlKEpTT04uc3RyaW5naWZ5KGxpbmtlZGluVG9Kc29uUmVzdW1lLmdldE91dHB1dCgpLCB1bmRlZmluZWQsIDIpLCAncmVzdW1lLmpzb24nKTtcbiAgfSk7XG4gIGRvd25sb2FkQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgLy8gZmlsZSBzZWxlY3Rpb25cbiAgZnVuY3Rpb24gZmlsZVNlbGVjdEhhbmRsZXIoZSkge1xuICAgIC8vIGNhbmNlbCBldmVudCBhbmQgaG92ZXIgc3R5bGluZ1xuICAgIGZpbGVEcmFnSG92ZXIoZSk7XG5cbiAgICBjb25zdCBkcm9wcGVkRmlsZXMgPSBlLnRhcmdldC5maWxlcyB8fCBlLmRhdGFUcmFuc2Zlci5maWxlcztcblxuICAgIGNvbnN0IGZpbGUgPSBkcm9wcGVkRmlsZXNbMF07XG4gICAgZmlsZU5hbWUgPSBmaWxlLm5hbWU7XG5cbiAgICBjb25zdCByZWFkQmxvYiA9IGJsb2IgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICBsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGUgPT4ge1xuICAgICAgICAgIHJlc29sdmUoZS50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYik7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29uc3QgcmVhZEVudHJ5Q29udGVudHMgPSBlbnRyeSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGJsb2IgPT4ge1xuICAgICAgICAgIHJlYWRCbG9iKGJsb2IpLnRoZW4ocmVzb2x2ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGdldEVudHJpZXMgPSAoZmlsZSwgb25lbmQpID0+IHtcbiAgICAgIHppcC5jcmVhdGVSZWFkZXIobmV3IHppcC5CbG9iUmVhZGVyKGZpbGUpLCB6aXBSZWFkZXIgPT4ge1xuICAgICAgICB6aXBSZWFkZXIuZ2V0RW50cmllcyhvbmVuZCk7XG4gICAgICB9LCBvbmVycm9yKTtcbiAgICB9O1xuXG4gICAgZ2V0RW50cmllcyhmaWxlLCBlbnRyaWVzID0+IHtcblxuICAgICAgY29uc3QgcHJvbWlzZXMgPSBlbnRyaWVzLm1hcChlbnRyeSA9PiB7XG5cbiAgICAgICAgc3dpdGNoIChlbnRyeS5maWxlbmFtZSkge1xuICAgICAgICAgIGNhc2UgJ1NraWxscy5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIHJlYWRFbnRyeUNvbnRlbnRzKGVudHJ5KS50aGVuKGNvbnRlbnRzID0+IHtcbiAgICAgICAgICAgICAgY29udGVudHMgPSBjb250ZW50cy5yZXBsYWNlKC9cIi9nLCAnJyk7XG4gICAgICAgICAgICAgIGxldCBlbGVtZW50cyA9IGNvbnRlbnRzLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICAgICAgZWxlbWVudHMgPSBlbGVtZW50cy5zbGljZSgxLCBlbGVtZW50cy5sZW5ndGggLTEpO1xuICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzU2tpbGxzKGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdFZHVjYXRpb24uY3N2JzpcbiAgICAgICAgICAgIHJldHVybiByZWFkRW50cnlDb250ZW50cyhlbnRyeSkudGhlbihjb250ZW50cyA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cyk7XG4gICAgICAgICAgICAgIGNvbnN0IGVkdWNhdGlvbiA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChlbGVtID0+ICh7XG4gICAgICAgICAgICAgICAgc2Nob29sTmFtZTogZWxlbVswXSxcbiAgICAgICAgICAgICAgICBzdGFydERhdGU6IGVsZW1bMV0sXG4gICAgICAgICAgICAgICAgZW5kRGF0ZTogZWxlbVsyXSxcbiAgICAgICAgICAgICAgICBub3RlczogZWxlbVszXSxcbiAgICAgICAgICAgICAgICBkZWdyZWU6IGVsZW1bNF0sXG4gICAgICAgICAgICAgICAgYWN0aXZpdGllczogZWxlbVs1XVxuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NFZHVjYXRpb24oZWR1Y2F0aW9uLnNvcnQoKGUxLGUyKSA9PlxuICAgICAgICAgICAgICAgICgrZTIuc3RhcnREYXRlLnllYXIgLSArZTEuc3RhcnREYXRlLnllYXIpIHx8ICgrZTIuc3RhcnREYXRlLm1vbnRoIC0gK2UxLnN0YXJ0RGF0ZS5tb250aClcbiAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2FzZSAnUG9zaXRpb25zLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gcmVhZEVudHJ5Q29udGVudHMoZW50cnkpLnRoZW4oY29udGVudHMgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMpO1xuICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBlbGVtZW50cy5zbGljZSgxLCBlbGVtZW50cy5sZW5ndGggLSAxKS5tYXAoZWxlbSA9PiAoe1xuICAgICAgICAgICAgICAgIGNvbXBhbnlOYW1lOiBlbGVtWzBdLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBlbGVtWzFdLFxuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBlbGVtWzJdLFxuXG4gICAgICAgICAgICAgICAgc3RhcnREYXRlOiB7XG4gICAgICAgICAgICAgICAgICB5ZWFyOiBlbGVtWzNdLnNwbGl0KCcvJylbMV0sXG4gICAgICAgICAgICAgICAgICBtb250aDogZWxlbVszXS5zcGxpdCgnLycpWzBdXG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGVuZERhdGU6IGVsZW1bNF0gPyB7XG4gICAgICAgICAgICAgICAgICB5ZWFyOiBlbGVtWzRdLnNwbGl0KCcvJylbMV0sXG4gICAgICAgICAgICAgICAgICBtb250aDogZWxlbVs0XS5zcGxpdCgnLycpWzBdXG4gICAgICAgICAgICAgICAgfSA6IG51bGwsXG5cbiAgICAgICAgICAgICAgICB0aXRsZTogZWxlbVs1XVxuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NQb3NpdGlvbihwb3NpdGlvbnMuc29ydCgocDEscDIpID0+XG4gICAgICAgICAgICAgICAgKCtwMi5zdGFydERhdGUueWVhciAtICtwMS5zdGFydERhdGUueWVhcikgfHwgKCtwMi5zdGFydERhdGUubW9udGggLSArcDEuc3RhcnREYXRlLm1vbnRoKVxuICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdMYW5ndWFnZXMuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiByZWFkRW50cnlDb250ZW50cyhlbnRyeSkudGhlbihjb250ZW50cyA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cyk7XG4gICAgICAgICAgICAgIGNvbnN0IGxhbmd1YWdlcyA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChlbGVtID0+ICh7XG4gICAgICAgICAgICAgICAgbmFtZTogZWxlbVswXSxcbiAgICAgICAgICAgICAgICBwcm9maWNpZW5jeTogZWxlbVsxXVxuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NMYW5ndWFnZXMobGFuZ3VhZ2VzKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdSZWNvbW1lbmRhdGlvbnMgUmVjZWl2ZWQuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiByZWFkRW50cnlDb250ZW50cyhlbnRyeSkudGhlbihjb250ZW50cyA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cyk7IFxuICAgICAgICAgICAgICBjb25zdCByZWNvbW1lbmRhdGlvbnMgPSBlbGVtZW50cy5zbGljZSgxLCBlbGVtZW50cy5sZW5ndGggLSAxKS5tYXAoZWxlbSA9PiAoe1xuICAgICAgICAgICAgICAgIHJlY29tbWVuZGVyRmlyc3ROYW1lOiBlbGVtWzBdLFxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGVyTGFzdE5hbWU6IGVsZW1bMV0sXG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25EYXRlOiBlbGVtWzJdLFxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uQm9keTogZWxlbVszXSxcbiAgICAgICAgICAgICAgICByZWNvbW1lbmRlckNvbXBhbnk6IGVsZW1bNF0sXG4gICAgICAgICAgICAgICAgcmVjb21tZW5kZXJUaXRsZTogZWxlbVs1XSxcbiAgICAgICAgICAgICAgICBkaXNwbGF5U3RhdHVzOiBlbGVtWzZdXG4gICAgICAgICAgICAgIH0pKS5maWx0ZXIocmVjb21tZW5kYXRpb24gPT4gcmVjb21tZW5kYXRpb24uZGlzcGxheVN0YXR1cyA9PT0gJ1ZJU0lCTEUnKTtcbiAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc1JlZmVyZW5jZXMocmVjb21tZW5kYXRpb25zKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdQcm9maWxlLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gcmVhZEVudHJ5Q29udGVudHMoZW50cnkpLnRoZW4oY29udGVudHMgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMpO1xuICAgICAgICAgICAgICBjb25zdCBwcm9maWxlID0ge1xuICAgICAgICAgICAgICAgIGZpcnN0TmFtZTogZWxlbWVudHNbMV1bMF0sXG4gICAgICAgICAgICAgICAgbGFzdE5hbWU6IGVsZW1lbnRzWzFdWzFdLFxuICAgICAgICAgICAgICAgIG1haWRlbk5hbWU6IGVsZW1lbnRzWzFdWzJdLFxuICAgICAgICAgICAgICAgIGNyZWF0ZWREYXRlOiBlbGVtZW50c1sxXVszXSxcbiAgICAgICAgICAgICAgICBhZGRyZXNzOiBlbGVtZW50c1sxXVs0XSxcbiAgICAgICAgICAgICAgICBiaXJ0aERhdGU6IGVsZW1lbnRzWzFdWzVdLFxuICAgICAgICAgICAgICAgIGNvbnRhY3RJbnN0cnVjdGlvbnM6IGVsZW1lbnRzWzFdWzZdLFxuICAgICAgICAgICAgICAgIG1hcml0YWxTdGF0dXM6IGVsZW1lbnRzWzFdWzddLFxuICAgICAgICAgICAgICAgIGhlYWRsaW5lOiBlbGVtZW50c1sxXVs4XSxcbiAgICAgICAgICAgICAgICBzdW1tYXJ5OiBlbGVtZW50c1sxXVs5XSxcbiAgICAgICAgICAgICAgICBpbmR1c3RyeTogZWxlbWVudHNbMV1bMTBdLFxuICAgICAgICAgICAgICAgIGFzc29jaWF0aW9uOiBlbGVtZW50c1sxXVsxMV1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc1Byb2ZpbGUocHJvZmlsZSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjYXNlICdFbWFpbCBBZGRyZXNzZXMuY3N2JzpcbiAgICAgICAgICAgICAgcmV0dXJuIHJlYWRFbnRyeUNvbnRlbnRzKGVudHJ5KS50aGVuKGNvbnRlbnRzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMsICdcXHQnKTsgLy8geWVzLCByZWNvbW1lbmRhdGlvbnMgdXNlIHRhYi1kZWxpbWl0ZXJcbiAgICAgICAgICAgICAgICBjb25zdCBlbWFpbCA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChlbGVtID0+ICh7XG4gICAgICAgICAgICAgICAgICBhZGRyZXNzOiBlbGVtWzBdLFxuICAgICAgICAgICAgICAgICAgc3RhdHVzOiBlbGVtWzFdLFxuICAgICAgICAgICAgICAgICAgaXNQcmltYXJ5OiBlbGVtWzJdID09PSAnWWVzJyxcbiAgICAgICAgICAgICAgICAgIGRhdGVBZGRlZDogZWxlbVszXSxcbiAgICAgICAgICAgICAgICAgIGRhdGVSZW1vdmVkOiBlbGVtWzRdXG4gICAgICAgICAgICAgICAgfSkpLmZpbHRlcihlbWFpbCA9PiBlbWFpbC5pc1ByaW1hcnkpO1xuICAgICAgICAgICAgICAgIGlmIChlbWFpbC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NFbWFpbChlbWFpbFswXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdJbnRlcmVzdHMuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiByZWFkRW50cnlDb250ZW50cyhlbnRyeSkudGhlbihjb250ZW50cyA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cyk7XG4gICAgICAgICAgICAgIGxldCBpbnRlcmVzdHMgPSBbXTtcbiAgICAgICAgICAgICAgZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkuZm9yRWFjaChlbGVtID0+IHtcbiAgICAgICAgICAgICAgIFx0IGludGVyZXN0cyA9IGludGVyZXN0cy5jb25jYXQoZWxlbVswXS5zcGxpdCgnLCcpKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NJbnRlcmVzdHMoaW50ZXJlc3RzKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdQcm9qZWN0cy5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIHJlYWRFbnRyeUNvbnRlbnRzKGVudHJ5KS50aGVuKGNvbnRlbnRzID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgZWxlbWVudHMgPSBjc3ZUb0FycmF5KGNvbnRlbnRzKTtcbiAgICAgICAgICAgICAgY29uc3QgcHJvamVjdHMgPSBlbGVtZW50cy5zbGljZSgxLCBlbGVtZW50cy5sZW5ndGggLSAxKS5tYXAoZWxlbSA9PiAoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBlbGVtWzBdLFxuXG4gICAgICAgICAgICAgICAgc3RhcnREYXRlOiB7XG4gICAgICAgICAgICAgICAgICB5ZWFyOiBlbGVtWzFdLnNwbGl0KCcvJylbMV0sXG4gICAgICAgICAgICAgICAgICBtb250aDogZWxlbVsxXS5zcGxpdCgnLycpWzBdXG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGVuZERhdGU6IGVsZW1bMl0gPyB7XG4gICAgICAgICAgICAgICAgICB5ZWFyOiBlbGVtWzJdLnNwbGl0KCcvJylbMV0sXG4gICAgICAgICAgICAgICAgICBtb250aDogZWxlbVsyXS5zcGxpdCgnLycpWzBdXG4gICAgICAgICAgICAgICAgfSA6IG51bGwsXG5cbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZWxlbVszXSxcbiAgICAgICAgICAgICAgICB1cmw6IGVsZW1bNF1cbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzUHJvamVjdHMocHJvamVjdHMuc29ydCgocDEscDIpID0+XG4gICAgICAgICAgICAgICAgKCtwMi5zdGFydERhdGUueWVhciAtICtwMS5zdGFydERhdGUueWVhcikgfHwgKCtwMi5zdGFydERhdGUubW9udGggLSArcDEuc3RhcnREYXRlLm1vbnRoKVxuICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XG4gICAgICAgIGZpbGVkcmFnLmlubmVySFRNTCA9ICdEcm9wcGVkISBTZWUgdGhlIHJlc3VsdGluZyBKU09OIFJlc3VtZSBhdCB0aGUgYm90dG9tLic7XG4gICAgICAgIGNvbnN0IG91dHB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdXRwdXQnKTtcbiAgICAgICAgb3V0cHV0LmlubmVySFRNTCA9IEpTT04uc3RyaW5naWZ5KGxpbmtlZGluVG9Kc29uUmVzdW1lLmdldE91dHB1dCgpLCB1bmRlZmluZWQsIDIpO1xuICAgICAgICBQcmlzbS5oaWdobGlnaHRFbGVtZW50KG91dHB1dCk7XG4gICAgICAgIGRvd25sb2FkQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0Jykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGZpbGUgc2VsZWN0XG4gIGZpbGVzZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZmlsZVNlbGVjdEhhbmRsZXIsIGZhbHNlKTtcblxuICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgaWYgKHhoci51cGxvYWQpIHtcbiAgICAvLyBmaWxlIGRyb3BcbiAgICBmaWxlZHJhZy5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGZpbGVEcmFnSG92ZXIsIGZhbHNlKTtcbiAgICBmaWxlZHJhZy5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBmaWxlRHJhZ0hvdmVyLCBmYWxzZSk7XG4gICAgZmlsZWRyYWcuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGZpbGVTZWxlY3RIYW5kbGVyLCBmYWxzZSk7XG4gICAgZmlsZWRyYWcuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gIH0gZWxzZSB7XG4gICAgZmlsZWRyYWcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3QtZmlsZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGZpbGVzZWxlY3QuY2xpY2soKTtcbiAgfSk7XG5cbiAgemlwLndvcmtlclNjcmlwdHNQYXRoID0gYCR7d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lfXZlbmRvci9gO1xufSkpKCk7XG4iXX0=
