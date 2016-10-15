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
          name: reference.recommenderFirstName + ' ' + reference.recommenderLastName,
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
              var elements = (0, _csvtoarrayJs2['default'])(contents, '\t'); // yes, recommendations use tab-delimiter
              var recommendations = elements.slice(1, elements.length - 1).map(function (elem) {
                return {
                  recommendationDate: elem[0],
                  recommendationBody: elem[1],
                  recommenderFirstName: elem[2],
                  recommenderLastName: elem[3],
                  recommenderCompany: elem[4],
                  recommenderTitle: elem[5],
                  displayStatus: elem[6]
                };
              }).filter(function (recommendation) {
                return recommendation.displayStatus === 'Shown';
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvanBlcmV6L2dpdGh1Yi9saW5rZWRpbi10by1qc29uLXJlc3VtZS9qcy9jb252ZXJ0ZXIuanMiLCIvVXNlcnMvanBlcmV6L2dpdGh1Yi9saW5rZWRpbi10by1qc29uLXJlc3VtZS9qcy9jc3Z0b2FycmF5LmpzIiwiL1VzZXJzL2pwZXJlei9naXRodWIvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvZmlsZS5qcyIsIi9Vc2Vycy9qcGVyZXovZ2l0aHViL2xpbmtlZGluLXRvLWpzb24tcmVzdW1lL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O0lDR00sb0JBQW9CO0FBQ2IsV0FEUCxvQkFBb0IsR0FDVjswQkFEVixvQkFBb0I7O0FBRXRCLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0dBQ2xCOztlQUhHLG9CQUFvQjs7V0FLZixxQkFBRzs7QUFFVixVQUFNLGFBQWEsR0FBRyxDQUNwQixRQUFRLEVBQ1IsTUFBTSxFQUNOLFdBQVcsRUFDWCxXQUFXLEVBQ1gsUUFBUSxFQUNSLGNBQWMsRUFDZCxRQUFRLEVBQ1IsV0FBVyxFQUNYLFdBQVcsRUFDWCxZQUFZLEVBQ1osVUFBVSxDQUNYLENBQUM7O0FBRUYsVUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFDeEIsNkJBQWdCLGFBQWEsOEhBQUU7Y0FBcEIsQ0FBQzs7QUFDVixjQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3BCLHdCQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztXQUNsQztTQUNGOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0QsYUFBTyxZQUFZLENBQUM7S0FDckI7OztXQUVNLGlCQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDdEIsWUFBTSxHQUFHLE1BQU0sSUFBSSxFQUFF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LEVBQUUsQ0FBQztHQUNwQixDQUFDLENBQUM7O0FBRUgsS0FBRyxDQUFDLGlCQUFpQixHQUFNLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxZQUFTLENBQUM7Q0FDOUQsQ0FBQSxFQUFJLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZXhwb3J0ZWQgb25MaW5rZWRJbkxvYWQgKi9cblxuLy8gdG9kbzogaW1wb3J0IHB1YmxpY2F0aW9ucywgYXdhcmRzLCB2b2x1bnRlZXJcbmNsYXNzIExpbmtlZEluVG9Kc29uUmVzdW1lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50YXJnZXQgPSB7fTtcbiAgfVxuXG4gIGdldE91dHB1dCgpIHtcbiAgICAvLyBzb3J0IHRoZSBvYmplY3RcbiAgICBjb25zdCBwcm9wZXJ0eU9yZGVyID0gW1xuICAgICAgJ2Jhc2ljcycsXG4gICAgICAnd29yaycsXG4gICAgICAndm9sdW50ZWVyJyxcbiAgICAgICdlZHVjYXRpb24nLFxuICAgICAgJ2F3YXJkcycsXG4gICAgICAncHVibGljYXRpb25zJyxcbiAgICAgICdza2lsbHMnLFxuICAgICAgJ2xhbmd1YWdlcycsXG4gICAgICAnaW50ZXJlc3RzJyxcbiAgICAgICdyZWZlcmVuY2VzJyxcbiAgICAgICdwcm9qZWN0cydcbiAgICBdO1xuXG4gICAgY29uc3Qgc29ydGVkVGFyZ2V0ID0ge307XG4gICAgZm9yIChjb25zdCBwIG9mIHByb3BlcnR5T3JkZXIpIHtcbiAgICAgIGlmIChwIGluIHRoaXMudGFyZ2V0KSB7XG4gICAgICAgIHNvcnRlZFRhcmdldFtwXSA9IHRoaXMudGFyZ2V0W3BdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc29ydGVkVGFyZ2V0O1xuICB9XG5cbiAgX2V4dGVuZCh0YXJnZXQsIHNvdXJjZSkge1xuICAgIHRhcmdldCA9IHRhcmdldCB8fMKge307XG4gICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGtleSA9PiB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldKTtcbiAgfVxuXG4gIHByb2Nlc3NQcm9maWxlKHNvdXJjZSkge1xuICAgIHRoaXMudGFyZ2V0LmJhc2ljcyA9IHRoaXMudGFyZ2V0LmJhc2ljcyB8fCB7fTtcbiAgICB0aGlzLl9leHRlbmQodGhpcy50YXJnZXQuYmFzaWNzLCB7XG4gICAgICBuYW1lOiBgJHtzb3VyY2UuZmlyc3ROYW1lfSAke3NvdXJjZS5sYXN0TmFtZX1gLFxuICAgICAgbGFiZWw6IHNvdXJjZS5oZWFkbGluZSxcbiAgICAgIHBpY3R1cmU6IHNvdXJjZS5waWN0dXJlVXJsLFxuICAgICAgcGhvbmU6IHNvdXJjZS5waG9uZU51bWJlcnMgJiYgc291cmNlLnBob25lTnVtYmVycy5fdG90YWwgPyBzb3VyY2UucGhvbmVOdW1iZXJzLnZhbHVlc1swXS5waG9uZU51bWJlciA6ICcnLFxuICAgICAgd2Vic2l0ZTogJycsXG4gICAgICBzdW1tYXJ5OiBzb3VyY2Uuc3VtbWFyeSxcbiAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIGFkZHJlc3M6IHNvdXJjZS5hZGRyZXNzLFxuICAgICAgICBwb3N0YWxDb2RlOiAnJyxcbiAgICAgICAgY2l0eTogc291cmNlLmxvY2F0aW9uID8gc291cmNlLmxvY2F0aW9uLm5hbWUgOiAnJyxcbiAgICAgICAgY291bnRyeUNvZGU6IHNvdXJjZS5sb2NhdGlvbiA/IHNvdXJjZS5sb2NhdGlvbi5jb3VudHJ5LmNvZGUudG9VcHBlckNhc2UoKSA6ICcnLFxuICAgICAgICByZWdpb246ICcnXG4gICAgICB9LFxuICAgICAgcHJvZmlsZXM6IFtdXG4gICAgfSk7XG4gIH1cblxuICBwcm9jZXNzRW1haWwoc291cmNlKSB7XG4gICAgdGhpcy50YXJnZXQuYmFzaWNzID0gdGhpcy50YXJnZXQuYmFzaWNzIHx8IHt9O1xuICAgIHRoaXMuX2V4dGVuZCh0aGlzLnRhcmdldC5iYXNpY3MsIHsnZW1haWwnOiBzb3VyY2UuYWRkcmVzc30pO1xuICB9XG5cbiAgcHJvY2Vzc1Bvc2l0aW9uKHNvdXJjZSkge1xuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc1Bvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgICBsZXQgb2JqZWN0ID0ge1xuICAgICAgICBjb21wYW55OiBwb3NpdGlvbi5jb21wYW55TmFtZSxcbiAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLnRpdGxlIHx8ICcnLFxuICAgICAgICB3ZWJzaXRlOiAnJyxcbiAgICAgICAgc3RhcnREYXRlOiBgJHtwb3NpdGlvbi5zdGFydERhdGUueWVhcn0tJHtwb3NpdGlvbi5zdGFydERhdGUubW9udGggPCAxMCA/ICcwJyA6ICcnfSR7cG9zaXRpb24uc3RhcnREYXRlLm1vbnRofS0wMWAsXG4gICAgICAgIHN1bW1hcnk6IHBvc2l0aW9uLmRlc2NyaXB0aW9uLFxuICAgICAgICBoaWdobGlnaHRzOiBbXVxuICAgICAgfTtcblxuICAgICAgaWYgKHBvc2l0aW9uLmVuZERhdGUpIHtcbiAgICAgICAgb2JqZWN0LmVuZERhdGUgPSBgJHtwb3NpdGlvbi5lbmREYXRlLnllYXJ9LSR7cG9zaXRpb24uZW5kRGF0ZS5tb250aCA8IDEwID8gJzAnIDogJyd9JHtwb3NpdGlvbi5lbmREYXRlLm1vbnRofS0wMWA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXQud29yayA9IHNvdXJjZS5tYXAocHJvY2Vzc1Bvc2l0aW9uKTtcbiAgfVxuXG4gIHByb2Nlc3NFZHVjYXRpb24oc291cmNlKSB7XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzRWR1Y2F0aW9uKGVkdWNhdGlvbikge1xuICAgICAgbGV0IG9iamVjdCA9IHtcbiAgICAgICAgaW5zdGl0dXRpb246IGVkdWNhdGlvbi5zY2hvb2xOYW1lLFxuICAgICAgICBhcmVhOiAnJyxcbiAgICAgICAgc3R1ZHlUeXBlOiBlZHVjYXRpb24uZGVncmVlLFxuICAgICAgICBzdGFydERhdGU6IGAke2VkdWNhdGlvbi5zdGFydERhdGV9LTAxLTAxYCxcbiAgICAgICAgZ3BhOiAnJyxcbiAgICAgICAgY291cnNlczogW11cbiAgICAgIH07XG5cbiAgICAgIGlmIChlZHVjYXRpb24uZW5kRGF0ZSkge1xuICAgICAgICBvYmplY3QuZW5kRGF0ZSA9IGAke2VkdWNhdGlvbi5lbmREYXRlfS0wMS0wMWA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXQuZWR1Y2F0aW9uID0gc291cmNlLm1hcChwcm9jZXNzRWR1Y2F0aW9uKTtcbiAgfVxuXG4gIHByb2Nlc3NTa2lsbHMoc2tpbGxzKSB7XG5cbiAgICB0aGlzLnRhcmdldC5za2lsbHMgPSBza2lsbHMubWFwKHNraWxsID0+ICh7XG4gICAgICAgIG5hbWU6IHNraWxsLFxuICAgICAgICBsZXZlbDogJycsXG4gICAgICAgIGtleXdvcmRzOiBbXVxuICAgICAgfSkpO1xuICB9XG5cbiAgcHJvY2Vzc0xhbmd1YWdlcyhzb3VyY2UpIHtcblxuICAgIGZ1bmN0aW9uIGNsZWFuUHJvZmljaWVuY3lTdHJpbmcocHJvZmljaWVuY3kpIHtcbiAgICAgIHByb2ZpY2llbmN5ID0gcHJvZmljaWVuY3kudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9fL2csICcgJyk7XG4gICAgICByZXR1cm4gcHJvZmljaWVuY3lbMF0udG9VcHBlckNhc2UoKSArIHByb2ZpY2llbmN5LnN1YnN0cigxKTtcbiAgICB9XG5cbiAgICB0aGlzLnRhcmdldC5sYW5ndWFnZXMgPSBzb3VyY2UubWFwKGxhbmd1YWdlID0+ICh7XG4gICAgICBsYW5ndWFnZTogbGFuZ3VhZ2UubmFtZSxcbiAgICAgIGZsdWVuY3k6IGxhbmd1YWdlLnByb2ZpY2llbmN5ID8gY2xlYW5Qcm9maWNpZW5jeVN0cmluZyhsYW5ndWFnZS5wcm9maWNpZW5jeSkgOiBudWxsXG4gICAgfSkpO1xuICB9XG5cbiAgcHJvY2Vzc1JlZmVyZW5jZXMoc291cmNlKSB7XG5cbiAgICB0aGlzLnRhcmdldC5yZWZlcmVuY2VzID0gc291cmNlLm1hcChyZWZlcmVuY2UgPT4gKHtcbiAgICAgIG5hbWU6IGAke3JlZmVyZW5jZS5yZWNvbW1lbmRlckZpcnN0TmFtZX0gJHtyZWZlcmVuY2UucmVjb21tZW5kZXJMYXN0TmFtZX1gLFxuICAgICAgcmVmZXJlbmNlOiByZWZlcmVuY2UucmVjb21tZW5kYXRpb25Cb2R5XG4gICAgfSkpO1xuICB9XG5cbiAgcHJvY2Vzc0ludGVyZXN0cyhzb3VyY2UpIHtcblxuICAgIHRoaXMudGFyZ2V0LmludGVyZXN0cyA9IHNvdXJjZS5tYXAoaW50ZXJlc3QgPT4gKHtcbiAgICAgIG5hbWU6IGludGVyZXN0LFxuICAgICAga2V5d29yZHM6IFtdXG4gICAgfSkpO1xuICB9XG5cbiAgcHJvY2Vzc1Byb2plY3RzKHNvdXJjZSkge1xuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc1Byb2plY3RzKHByb2plY3QpIHtcblxuICAgICAgIGxldCBwID0ge1xuICAgICAgICAgIG5hbWU6IHByb2plY3QudGl0bGUsXG4gICAgICAgICAgc3RhcnREYXRlOiBgJHtwcm9qZWN0LnN0YXJ0RGF0ZS55ZWFyfS0ke3Byb2plY3Quc3RhcnREYXRlLm1vbnRoIDwgMTAgPyAnMCcgOiAnJ30ke3Byb2plY3Quc3RhcnREYXRlLm1vbnRofS0wMWAsXG4gICAgICAgICAgc3VtbWFyeTogcHJvamVjdC5kZXNjcmlwdGlvbixcbiAgICAgICAgICB1cmw6IHByb2plY3QudXJsXG4gICAgICAgIH07XG4gICAgICAgaWYocHJvamVjdC5lbmREYXRlKSB7XG4gICAgICAgICAgcC5lbmREYXRlID0gYCR7cHJvamVjdC5lbmREYXRlLnllYXJ9LSR7cHJvamVjdC5lbmREYXRlLm1vbnRoIDwgMTAgPyAnMCcgOiAnJ30ke3Byb2plY3QuZW5kRGF0ZS5tb250aH0tMDFgO1xuICAgICAgIH1cbiAgICAgICByZXR1cm4gcDtcbiAgICB9XG5cbiAgICB0aGlzLnRhcmdldC5wcm9qZWN0cyA9IHNvdXJjZS5tYXAocHJvY2Vzc1Byb2plY3RzKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IExpbmtlZEluVG9Kc29uUmVzdW1lO1xuIiwiLyogZ2xvYmFsIG1vZHVsZSAqL1xuKCgoKSA9PiB7XG4gIC8vIHJlZjogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTI5MzE2My8yMzQzXG4gIC8vIFRoaXMgd2lsbCBwYXJzZSBhIGRlbGltaXRlZCBzdHJpbmcgaW50byBhbiBhcnJheSBvZlxuICAvLyBhcnJheXMuIFRoZSBkZWZhdWx0IGRlbGltaXRlciBpcyB0aGUgY29tbWEsIGJ1dCB0aGlzXG4gIC8vIGNhbiBiZSBvdmVycmlkZW4gaW4gdGhlIHNlY29uZCBhcmd1bWVudC5cbiAgZnVuY3Rpb24gQ1NWVG9BcnJheShzdHJEYXRhLCBzdHJEZWxpbWl0ZXI9JywnKSB7XG4gICAgLy8gQ3JlYXRlIGEgcmVndWxhciBleHByZXNzaW9uIHRvIHBhcnNlIHRoZSBDU1YgdmFsdWVzLlxuICAgIGNvbnN0IG9ialBhdHRlcm4gPSBuZXcgUmVnRXhwKFxuICAgICAgICAoXG5cbiAgICAgICAgICAgIGAoXFxcXCR7c3RyRGVsaW1pdGVyfXxcXFxccj9cXFxcbnxcXFxccnxeKSg/OlwiKFteXCJdKig/OlwiXCJbXlwiXSopKilcInwoW15cIlxcXFwke3N0ckRlbGltaXRlcn1cXFxcclxcXFxuXSopKWBcbiAgICAgICAgKSxcbiAgICAgICAgJ2dpJ1xuICAgICAgICApO1xuXG4gICAgLy8gQ3JlYXRlIGFuIGFycmF5IHRvIGhvbGQgb3VyIGRhdGEuIEdpdmUgdGhlIGFycmF5XG4gICAgLy8gYSBkZWZhdWx0IGVtcHR5IGZpcnN0IHJvdy5cbiAgICBjb25zdCBhcnJEYXRhID0gW1tdXTtcblxuICAgIC8vIENyZWF0ZSBhbiBhcnJheSB0byBob2xkIG91ciBpbmRpdmlkdWFsIHBhdHRlcm5cbiAgICAvLyBtYXRjaGluZyBncm91cHMuXG4gICAgbGV0IGFyck1hdGNoZXMgPSBudWxsO1xuXG4gICAgLy8gS2VlcCBsb29waW5nIG92ZXIgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBtYXRjaGVzXG4gICAgLy8gdW50aWwgd2UgY2FuIG5vIGxvbmdlciBmaW5kIGEgbWF0Y2guXG4gICAgZG8ge1xuICAgICAgYXJyTWF0Y2hlcyA9IG9ialBhdHRlcm4uZXhlYyhzdHJEYXRhKTtcbiAgICAgIGlmICghYXJyTWF0Y2hlcykgeyBicmVhazsgfVxuXG4gICAgICAvLyBHZXQgdGhlIGRlbGltaXRlciB0aGF0IHdhcyBmb3VuZC5cbiAgICAgIGNvbnN0IHN0ck1hdGNoZWREZWxpbWl0ZXIgPSBhcnJNYXRjaGVzWyAxIF07XG5cbiAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZ2l2ZW4gZGVsaW1pdGVyIGhhcyBhIGxlbmd0aFxuICAgICAgLy8gKGlzIG5vdCB0aGUgc3RhcnQgb2Ygc3RyaW5nKSBhbmQgaWYgaXQgbWF0Y2hlc1xuICAgICAgLy8gZmllbGQgZGVsaW1pdGVyLiBJZiBpZCBkb2VzIG5vdCwgdGhlbiB3ZSBrbm93XG4gICAgICAvLyB0aGF0IHRoaXMgZGVsaW1pdGVyIGlzIGEgcm93IGRlbGltaXRlci5cbiAgICAgIGlmIChcbiAgICAgICAgICBzdHJNYXRjaGVkRGVsaW1pdGVyLmxlbmd0aCAmJlxuICAgICAgICAgIHN0ck1hdGNoZWREZWxpbWl0ZXIgIT09IHN0ckRlbGltaXRlclxuICAgICAgICAgICkge1xuXG4gICAgICAgIC8vIFNpbmNlIHdlIGhhdmUgcmVhY2hlZCBhIG5ldyByb3cgb2YgZGF0YSxcbiAgICAgICAgLy8gYWRkIGFuIGVtcHR5IHJvdyB0byBvdXIgZGF0YSBhcnJheS5cbiAgICAgICAgYXJyRGF0YS5wdXNoKFtdKTtcblxuICAgICAgfVxuXG4gICAgICBsZXQgc3RyTWF0Y2hlZFZhbHVlO1xuXG4gICAgICAvLyBOb3cgdGhhdCB3ZSBoYXZlIG91ciBkZWxpbWl0ZXIgb3V0IG9mIHRoZSB3YXksXG4gICAgICAvLyBsZXQncyBjaGVjayB0byBzZWUgd2hpY2gga2luZCBvZiB2YWx1ZSB3ZVxuICAgICAgLy8gY2FwdHVyZWQgKHF1b3RlZCBvciB1bnF1b3RlZCkuXG4gICAgICBpZiAoYXJyTWF0Y2hlc1sgMiBdKSB7XG5cbiAgICAgICAgLy8gV2UgZm91bmQgYSBxdW90ZWQgdmFsdWUuIFdoZW4gd2UgY2FwdHVyZVxuICAgICAgICAvLyB0aGlzIHZhbHVlLCB1bmVzY2FwZSBhbnkgZG91YmxlIHF1b3Rlcy5cbiAgICAgICAgc3RyTWF0Y2hlZFZhbHVlID0gYXJyTWF0Y2hlc1sgMiBdLnJlcGxhY2UoXG4gICAgICAgICAgICBuZXcgUmVnRXhwKCdcXFwiXFxcIicsICdnJyksXG4gICAgICAgICAgICAnXFxcIidcbiAgICAgICAgICAgICk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgLy8gV2UgZm91bmQgYSBub24tcXVvdGVkIHZhbHVlLlxuICAgICAgICBzdHJNYXRjaGVkVmFsdWUgPSBhcnJNYXRjaGVzWyAzIF07XG5cbiAgICAgIH1cblxuICAgICAgLy8gTm93IHRoYXQgd2UgaGF2ZSBvdXIgdmFsdWUgc3RyaW5nLCBsZXQncyBhZGRcbiAgICAgIC8vIGl0IHRvIHRoZSBkYXRhIGFycmF5LlxuICAgICAgYXJyRGF0YVsgYXJyRGF0YS5sZW5ndGggLSAxIF0ucHVzaChzdHJNYXRjaGVkVmFsdWUgPyBzdHJNYXRjaGVkVmFsdWUudHJpbSgpIDogc3RyTWF0Y2hlZFZhbHVlKTtcbiAgICB9IHdoaWxlICh0cnVlKTtcblxuICAgIC8vIFJldHVybiB0aGUgcGFyc2VkIGRhdGEuXG4gICAgcmV0dXJuIGFyckRhdGE7XG4gIH1cblxuICBtb2R1bGUuZXhwb3J0cyA9IENTVlRvQXJyYXk7XG59KSkoKTtcbiIsIi8qIGdsb2JhbCBVUkwsIEJsb2IgICovXG4vKiBleHBvcnRlZCBzYXZlICovXG5jb25zdCBzYXZlID0gKCgoKSA9PiB7XG4gIC8vIHNhdmVBcyBmcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL01yU3dpdGNoLzM1NTI5ODVcbiAgY29uc3Qgc2F2ZUFzID0gd2luZG93LnNhdmVBcyB8fCAod2luZG93Lm5hdmlnYXRvci5tc1NhdmVCbG9iID8gKGIsIG4pID0+IHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlQmxvYihiLCBuKSA6IGZhbHNlKSB8fCB3aW5kb3cud2Via2l0U2F2ZUFzIHx8IHdpbmRvdy5tb3pTYXZlQXMgfHwgd2luZG93Lm1zU2F2ZUFzIHx8ICgoKCkgPT4ge1xuXG4gICAgICAvLyBVUkwnc1xuICAgICAgd2luZG93LlVSTCA9IHdpbmRvdy5VUkwgfHwgd2luZG93LndlYmtpdFVSTDtcblxuICAgICAgaWYgKCF3aW5kb3cuVVJMKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChibG9iLCBuYW1lKSA9PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cbiAgICAgICAgLy8gVGVzdCBmb3IgZG93bmxvYWQgbGluayBzdXBwb3J0XG4gICAgICAgIGlmICgnZG93bmxvYWQnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSkge1xuXG4gICAgICAgICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnaHJlZicsIHVybCk7XG4gICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgbmFtZSk7XG5cbiAgICAgICAgICAvLyBDcmVhdGUgQ2xpY2sgZXZlbnRcbiAgICAgICAgICBjb25zdCBjbGlja0V2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ01vdXNlRXZlbnQnKTtcbiAgICAgICAgICBjbGlja0V2ZW50LmluaXRNb3VzZUV2ZW50KCdjbGljaycsIHRydWUsIHRydWUsIHdpbmRvdywgMCxcbiAgICAgICAgICAgIDAsIDAsIDAsIDAsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCAwLCBudWxsKTtcblxuICAgICAgICAgIC8vIGRpc3BhdGNoIGNsaWNrIGV2ZW50IHRvIHNpbXVsYXRlIGRvd25sb2FkXG4gICAgICAgICAgYS5kaXNwYXRjaEV2ZW50KGNsaWNrRXZlbnQpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZmFsbG92ZXIsIG9wZW4gcmVzb3VyY2UgaW4gbmV3IHRhYi5cbiAgICAgICAgICB3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnLCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkpKCk7XG5cbiAgZnVuY3Rpb24gX3NhdmUodGV4dCwgZmlsZU5hbWUpIHtcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3RleHRdLCB7XG4gICAgICB0eXBlOiAndGV4dC9wbGFpbidcbiAgICB9KTtcbiAgICBzYXZlQXMoYmxvYiwgZmlsZU5hbWUgfHwgJ3N1YnRpdGxlLnNydCcpO1xuICB9XG5cbiAgcmV0dXJuIF9zYXZlO1xufSkpKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHNhdmU7XG4iLCIvKiBnbG9iYWwgemlwLCBQcmlzbSAqL1xuXG5pbXBvcnQgTGlua2VkSW5Ub0pzb25SZXN1bWUgZnJvbSAnLi9jb252ZXJ0ZXIuanMnO1xuaW1wb3J0IGNzdlRvQXJyYXkgZnJvbSAnLi9jc3Z0b2FycmF5LmpzJztcbmltcG9ydCBzYXZlIGZyb20gJy4vZmlsZS5qcyc7XG5cbigoKCkgPT4ge1xuICBjb25zdCBmaWxlZHJhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlZHJhZycpO1xuICBjb25zdCBmaWxlc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGVzZWxlY3QnKTtcbiAgbGV0IGZpbGVOYW1lID0gbnVsbDtcblxuICAvLyBmaWxlIGRyYWcgaG92ZXJcbiAgZnVuY3Rpb24gZmlsZURyYWdIb3ZlcihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS50YXJnZXQuY2xhc3NOYW1lID0gKGUudHlwZSA9PT0gJ2RyYWdvdmVyJyA/ICdob3ZlcicgOiAnJyk7XG4gIH1cblxuICBjb25zdCBsaW5rZWRpblRvSnNvblJlc3VtZSA9IG5ldyBMaW5rZWRJblRvSnNvblJlc3VtZSgpO1xuXG4gIGNvbnN0IGRvd25sb2FkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRvd25sb2FkJyk7XG4gIGRvd25sb2FkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIHNhdmUoSlNPTi5zdHJpbmdpZnkobGlua2VkaW5Ub0pzb25SZXN1bWUuZ2V0T3V0cHV0KCksIHVuZGVmaW5lZCwgMiksICdyZXN1bWUuanNvbicpO1xuICB9KTtcbiAgZG93bmxvYWRCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAvLyBmaWxlIHNlbGVjdGlvblxuICBmdW5jdGlvbiBmaWxlU2VsZWN0SGFuZGxlcihlKSB7XG4gICAgLy8gY2FuY2VsIGV2ZW50IGFuZCBob3ZlciBzdHlsaW5nXG4gICAgZmlsZURyYWdIb3ZlcihlKTtcblxuICAgIGNvbnN0IGRyb3BwZWRGaWxlcyA9IGUudGFyZ2V0LmZpbGVzIHx8IGUuZGF0YVRyYW5zZmVyLmZpbGVzO1xuXG4gICAgY29uc3QgZmlsZSA9IGRyb3BwZWRGaWxlc1swXTtcbiAgICBmaWxlTmFtZSA9IGZpbGUubmFtZTtcblxuICAgIGNvbnN0IHJlYWRCbG9iID0gYmxvYiA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByZWFkZXIub25sb2FkID0gZSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShlLnRhcmdldC5yZXN1bHQpO1xuICAgICAgICB9O1xuICAgICAgICByZWFkZXIucmVhZEFzVGV4dChibG9iKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBjb25zdCByZWFkRW50cnlDb250ZW50cyA9IGVudHJ5ID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgZW50cnkuZ2V0RGF0YShuZXcgemlwLkJsb2JXcml0ZXIoJ3RleHQvcGxhaW4nKSwgYmxvYiA9PiB7XG4gICAgICAgICAgcmVhZEJsb2IoYmxvYikudGhlbihyZXNvbHZlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29uc3QgZ2V0RW50cmllcyA9IChmaWxlLCBvbmVuZCkgPT4ge1xuICAgICAgemlwLmNyZWF0ZVJlYWRlcihuZXcgemlwLkJsb2JSZWFkZXIoZmlsZSksIHppcFJlYWRlciA9PiB7XG4gICAgICAgIHppcFJlYWRlci5nZXRFbnRyaWVzKG9uZW5kKTtcbiAgICAgIH0sIG9uZXJyb3IpO1xuICAgIH07XG5cbiAgICBnZXRFbnRyaWVzKGZpbGUsIGVudHJpZXMgPT4ge1xuXG4gICAgICBjb25zdCBwcm9taXNlcyA9IGVudHJpZXMubWFwKGVudHJ5ID0+IHtcblxuICAgICAgICBzd2l0Y2ggKGVudHJ5LmZpbGVuYW1lKSB7XG4gICAgICAgICAgY2FzZSAnU2tpbGxzLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gcmVhZEVudHJ5Q29udGVudHMoZW50cnkpLnRoZW4oY29udGVudHMgPT4ge1xuICAgICAgICAgICAgICBjb250ZW50cyA9IGNvbnRlbnRzLnJlcGxhY2UoL1wiL2csICcnKTtcbiAgICAgICAgICAgICAgbGV0IGVsZW1lbnRzID0gY29udGVudHMuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgICBlbGVtZW50cyA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtMSk7XG4gICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NTa2lsbHMoZWxlbWVudHMpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNhc2UgJ0VkdWNhdGlvbi5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIHJlYWRFbnRyeUNvbnRlbnRzKGVudHJ5KS50aGVuKGNvbnRlbnRzID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgZWxlbWVudHMgPSBjc3ZUb0FycmF5KGNvbnRlbnRzKTtcbiAgICAgICAgICAgICAgY29uc3QgZWR1Y2F0aW9uID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkubWFwKGVsZW0gPT4gKHtcbiAgICAgICAgICAgICAgICBzY2hvb2xOYW1lOiBlbGVtWzBdLFxuICAgICAgICAgICAgICAgIHN0YXJ0RGF0ZTogZWxlbVsxXSxcbiAgICAgICAgICAgICAgICBlbmREYXRlOiBlbGVtWzJdLFxuICAgICAgICAgICAgICAgIG5vdGVzOiBlbGVtWzNdLFxuICAgICAgICAgICAgICAgIGRlZ3JlZTogZWxlbVs0XSxcbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBlbGVtWzVdXG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc0VkdWNhdGlvbihlZHVjYXRpb24uc29ydCgoZTEsZTIpID0+XG4gICAgICAgICAgICAgICAgKCtlMi5zdGFydERhdGUueWVhciAtICtlMS5zdGFydERhdGUueWVhcikgfHwgKCtlMi5zdGFydERhdGUubW9udGggLSArZTEuc3RhcnREYXRlLm1vbnRoKVxuICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdQb3NpdGlvbnMuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiByZWFkRW50cnlDb250ZW50cyhlbnRyeSkudGhlbihjb250ZW50cyA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cyk7XG4gICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChlbGVtID0+ICh7XG4gICAgICAgICAgICAgICAgY29tcGFueU5hbWU6IGVsZW1bMF0sXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGVsZW1bMV0sXG4gICAgICAgICAgICAgICAgbG9jYXRpb246IGVsZW1bMl0sXG5cbiAgICAgICAgICAgICAgICBzdGFydERhdGU6IHtcbiAgICAgICAgICAgICAgICAgIHllYXI6IGVsZW1bM10uc3BsaXQoJy8nKVsxXSxcbiAgICAgICAgICAgICAgICAgIG1vbnRoOiBlbGVtWzNdLnNwbGl0KCcvJylbMF1cbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZW5kRGF0ZTogZWxlbVs0XSA/IHtcbiAgICAgICAgICAgICAgICAgIHllYXI6IGVsZW1bNF0uc3BsaXQoJy8nKVsxXSxcbiAgICAgICAgICAgICAgICAgIG1vbnRoOiBlbGVtWzRdLnNwbGl0KCcvJylbMF1cbiAgICAgICAgICAgICAgICB9IDogbnVsbCxcblxuICAgICAgICAgICAgICAgIHRpdGxlOiBlbGVtWzVdXG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc1Bvc2l0aW9uKHBvc2l0aW9ucy5zb3J0KChwMSxwMikgPT5cbiAgICAgICAgICAgICAgICAoK3AyLnN0YXJ0RGF0ZS55ZWFyIC0gK3AxLnN0YXJ0RGF0ZS55ZWFyKSB8fCAoK3AyLnN0YXJ0RGF0ZS5tb250aCAtICtwMS5zdGFydERhdGUubW9udGgpXG4gICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNhc2UgJ0xhbmd1YWdlcy5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIHJlYWRFbnRyeUNvbnRlbnRzKGVudHJ5KS50aGVuKGNvbnRlbnRzID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgZWxlbWVudHMgPSBjc3ZUb0FycmF5KGNvbnRlbnRzKTtcbiAgICAgICAgICAgICAgY29uc3QgbGFuZ3VhZ2VzID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkubWFwKGVsZW0gPT4gKHtcbiAgICAgICAgICAgICAgICBuYW1lOiBlbGVtWzBdLFxuICAgICAgICAgICAgICAgIHByb2ZpY2llbmN5OiBlbGVtWzFdXG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc0xhbmd1YWdlcyhsYW5ndWFnZXMpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNhc2UgJ1JlY29tbWVuZGF0aW9ucyBSZWNlaXZlZC5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIHJlYWRFbnRyeUNvbnRlbnRzKGVudHJ5KS50aGVuKGNvbnRlbnRzID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgZWxlbWVudHMgPSBjc3ZUb0FycmF5KGNvbnRlbnRzLCAnXFx0Jyk7IC8vIHllcywgcmVjb21tZW5kYXRpb25zIHVzZSB0YWItZGVsaW1pdGVyXG4gICAgICAgICAgICAgIGNvbnN0IHJlY29tbWVuZGF0aW9ucyA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChlbGVtID0+ICh7XG4gICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25EYXRlOiBlbGVtWzBdLFxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uQm9keTogZWxlbVsxXSxcbiAgICAgICAgICAgICAgICByZWNvbW1lbmRlckZpcnN0TmFtZTogZWxlbVsyXSxcbiAgICAgICAgICAgICAgICByZWNvbW1lbmRlckxhc3ROYW1lOiBlbGVtWzNdLFxuICAgICAgICAgICAgICAgIHJlY29tbWVuZGVyQ29tcGFueTogZWxlbVs0XSxcbiAgICAgICAgICAgICAgICByZWNvbW1lbmRlclRpdGxlOiBlbGVtWzVdLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlTdGF0dXM6IGVsZW1bNl1cbiAgICAgICAgICAgICAgfSkpLmZpbHRlcihyZWNvbW1lbmRhdGlvbiA9PiByZWNvbW1lbmRhdGlvbi5kaXNwbGF5U3RhdHVzID09PSAnU2hvd24nKTtcbiAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc1JlZmVyZW5jZXMocmVjb21tZW5kYXRpb25zKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdQcm9maWxlLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gcmVhZEVudHJ5Q29udGVudHMoZW50cnkpLnRoZW4oY29udGVudHMgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMpO1xuICAgICAgICAgICAgICBjb25zdCBwcm9maWxlID0ge1xuICAgICAgICAgICAgICAgIGZpcnN0TmFtZTogZWxlbWVudHNbMV1bMF0sXG4gICAgICAgICAgICAgICAgbGFzdE5hbWU6IGVsZW1lbnRzWzFdWzFdLFxuICAgICAgICAgICAgICAgIG1haWRlbk5hbWU6IGVsZW1lbnRzWzFdWzJdLFxuICAgICAgICAgICAgICAgIGNyZWF0ZWREYXRlOiBlbGVtZW50c1sxXVszXSxcbiAgICAgICAgICAgICAgICBhZGRyZXNzOiBlbGVtZW50c1sxXVs0XSxcbiAgICAgICAgICAgICAgICBiaXJ0aERhdGU6IGVsZW1lbnRzWzFdWzVdLFxuICAgICAgICAgICAgICAgIGNvbnRhY3RJbnN0cnVjdGlvbnM6IGVsZW1lbnRzWzFdWzZdLFxuICAgICAgICAgICAgICAgIG1hcml0YWxTdGF0dXM6IGVsZW1lbnRzWzFdWzddLFxuICAgICAgICAgICAgICAgIGhlYWRsaW5lOiBlbGVtZW50c1sxXVs4XSxcbiAgICAgICAgICAgICAgICBzdW1tYXJ5OiBlbGVtZW50c1sxXVs5XSxcbiAgICAgICAgICAgICAgICBpbmR1c3RyeTogZWxlbWVudHNbMV1bMTBdLFxuICAgICAgICAgICAgICAgIGFzc29jaWF0aW9uOiBlbGVtZW50c1sxXVsxMV1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc1Byb2ZpbGUocHJvZmlsZSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjYXNlICdFbWFpbCBBZGRyZXNzZXMuY3N2JzpcbiAgICAgICAgICAgICAgcmV0dXJuIHJlYWRFbnRyeUNvbnRlbnRzKGVudHJ5KS50aGVuKGNvbnRlbnRzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMsICdcXHQnKTsgLy8geWVzLCByZWNvbW1lbmRhdGlvbnMgdXNlIHRhYi1kZWxpbWl0ZXJcbiAgICAgICAgICAgICAgICBjb25zdCBlbWFpbCA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChlbGVtID0+ICh7XG4gICAgICAgICAgICAgICAgICBhZGRyZXNzOiBlbGVtWzBdLFxuICAgICAgICAgICAgICAgICAgc3RhdHVzOiBlbGVtWzFdLFxuICAgICAgICAgICAgICAgICAgaXNQcmltYXJ5OiBlbGVtWzJdID09PSAnWWVzJyxcbiAgICAgICAgICAgICAgICAgIGRhdGVBZGRlZDogZWxlbVszXSxcbiAgICAgICAgICAgICAgICAgIGRhdGVSZW1vdmVkOiBlbGVtWzRdXG4gICAgICAgICAgICAgICAgfSkpLmZpbHRlcihlbWFpbCA9PiBlbWFpbC5pc1ByaW1hcnkpO1xuICAgICAgICAgICAgICAgIGlmIChlbWFpbC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NFbWFpbChlbWFpbFswXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdJbnRlcmVzdHMuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiByZWFkRW50cnlDb250ZW50cyhlbnRyeSkudGhlbihjb250ZW50cyA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cyk7XG4gICAgICAgICAgICAgIGxldCBpbnRlcmVzdHMgPSBbXTtcbiAgICAgICAgICAgICAgZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkuZm9yRWFjaChlbGVtID0+IHtcbiAgICAgICAgICAgICAgIFx0IGludGVyZXN0cyA9IGludGVyZXN0cy5jb25jYXQoZWxlbVswXS5zcGxpdCgnLCcpKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NJbnRlcmVzdHMoaW50ZXJlc3RzKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdQcm9qZWN0cy5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIHJlYWRFbnRyeUNvbnRlbnRzKGVudHJ5KS50aGVuKGNvbnRlbnRzID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgZWxlbWVudHMgPSBjc3ZUb0FycmF5KGNvbnRlbnRzKTtcbiAgICAgICAgICAgICAgY29uc3QgcHJvamVjdHMgPSBlbGVtZW50cy5zbGljZSgxLCBlbGVtZW50cy5sZW5ndGggLSAxKS5tYXAoZWxlbSA9PiAoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBlbGVtWzBdLFxuXG4gICAgICAgICAgICAgICAgc3RhcnREYXRlOiB7XG4gICAgICAgICAgICAgICAgICB5ZWFyOiBlbGVtWzFdLnNwbGl0KCcvJylbMV0sXG4gICAgICAgICAgICAgICAgICBtb250aDogZWxlbVsxXS5zcGxpdCgnLycpWzBdXG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGVuZERhdGU6IGVsZW1bMl0gPyB7XG4gICAgICAgICAgICAgICAgICB5ZWFyOiBlbGVtWzJdLnNwbGl0KCcvJylbMV0sXG4gICAgICAgICAgICAgICAgICBtb250aDogZWxlbVsyXS5zcGxpdCgnLycpWzBdXG4gICAgICAgICAgICAgICAgfSA6IG51bGwsXG5cbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZWxlbVszXSxcbiAgICAgICAgICAgICAgICB1cmw6IGVsZW1bNF1cbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzUHJvamVjdHMocHJvamVjdHMuc29ydCgocDEscDIpID0+XG4gICAgICAgICAgICAgICAgKCtwMi5zdGFydERhdGUueWVhciAtICtwMS5zdGFydERhdGUueWVhcikgfHwgKCtwMi5zdGFydERhdGUubW9udGggLSArcDEuc3RhcnREYXRlLm1vbnRoKVxuICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XG4gICAgICAgIGZpbGVkcmFnLmlubmVySFRNTCA9ICdEcm9wcGVkISBTZWUgdGhlIHJlc3VsdGluZyBKU09OIFJlc3VtZSBhdCB0aGUgYm90dG9tLic7XG4gICAgICAgIGNvbnN0IG91dHB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdXRwdXQnKTtcbiAgICAgICAgb3V0cHV0LmlubmVySFRNTCA9IEpTT04uc3RyaW5naWZ5KGxpbmtlZGluVG9Kc29uUmVzdW1lLmdldE91dHB1dCgpLCB1bmRlZmluZWQsIDIpO1xuICAgICAgICBQcmlzbS5oaWdobGlnaHRFbGVtZW50KG91dHB1dCk7XG4gICAgICAgIGRvd25sb2FkQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0Jykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGZpbGUgc2VsZWN0XG4gIGZpbGVzZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZmlsZVNlbGVjdEhhbmRsZXIsIGZhbHNlKTtcblxuICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgaWYgKHhoci51cGxvYWQpIHtcbiAgICAvLyBmaWxlIGRyb3BcbiAgICBmaWxlZHJhZy5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGZpbGVEcmFnSG92ZXIsIGZhbHNlKTtcbiAgICBmaWxlZHJhZy5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBmaWxlRHJhZ0hvdmVyLCBmYWxzZSk7XG4gICAgZmlsZWRyYWcuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGZpbGVTZWxlY3RIYW5kbGVyLCBmYWxzZSk7XG4gICAgZmlsZWRyYWcuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gIH0gZWxzZSB7XG4gICAgZmlsZWRyYWcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3QtZmlsZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGZpbGVzZWxlY3QuY2xpY2soKTtcbiAgfSk7XG5cbiAgemlwLndvcmtlclNjcmlwdHNQYXRoID0gYCR7d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lfXZlbmRvci9gO1xufSkpKCk7XG4iXX0=
