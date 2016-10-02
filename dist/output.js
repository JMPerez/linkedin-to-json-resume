(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global module */
/* exported onLinkedInLoad */

// todo: import publications, awards, volunteer
'use strict';

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
          startDate: '' + education.startDate + '-01-01',
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
    key: 'processProjects',
    value: function processProjects(source) {

      function processProjects(project) {

        var p = {
          name: project.title,
          startDate: project.startDate,
          summary: project.description,
          url: project.url
        };
        if (project.endDate) {
          p.endDate = project.endDate;
        }
        return p;
      }

      this.target.projects = source.map(processProjects);
    }
  }]);

  return LinkedInToJsonResume;
})();

module.exports = LinkedInToJsonResume;

},{}],2:[function(require,module,exports){
/* global module */
'use strict';

(function () {
  'use strict';

  // ref: http://stackoverflow.com/a/1293163/2343
  // This will parse a delimited string into an array of
  // arrays. The default delimiter is the comma, but this
  // can be overriden in the second argument.
  function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = strDelimiter || ',';

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(

    // Delimiters.
    '(\\' + strDelimiter + '|\\r?\\n|\\r|^)' +

    // Quoted fields.
    '(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|' +

    // Standard fields.
    '([^\"\\' + strDelimiter + '\\r\\n]*))', 'gi');

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

      var strMatchedValue;

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

},{}],4:[function(require,module,exports){
/* global zip, createTempFile, Prism */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _converterJs = require('./converter.js');

var _converterJs2 = _interopRequireDefault(_converterJs);

var _csvtoarrayJs = require('./csvtoarray.js');

var _csvtoarrayJs2 = _interopRequireDefault(_csvtoarrayJs);

var _fileJs = require('./file.js');

var _fileJs2 = _interopRequireDefault(_fileJs);

(function () {
  'use strict';

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

    model.getEntries(file, function (entries) {

      var promises = entries.map(function (entry) {

        // todo: use promises
        switch (entry.filename) {
          case 'Skills.csv':
            return new Promise(function (resolve) {
              entry.getData(new zip.BlobWriter('text/plain'), function (blob) {
                readBlob(blob, function (contents) {
                  contents = contents.replace(/"/g, '');
                  var elements = contents.split('\n');
                  elements = elements.slice(1, elements.length - 1);
                  linkedinToJsonResume.processSkills(elements);
                  resolve();
                });
              });
            });

          case 'Education.csv':
            return new Promise(function (resolve) {
              entry.getData(new zip.BlobWriter('text/plain'), function (blob) {
                readBlob(blob, function (contents) {
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
                  resolve();
                });
              });
            });

          case 'Positions.csv':
            return new Promise(function (resolve) {
              entry.getData(new zip.BlobWriter('text/plain'), function (blob) {
                readBlob(blob, function (contents) {
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
                  resolve();
                });
              });
            });

          case 'Languages.csv':
            return new Promise(function (resolve) {
              entry.getData(new zip.BlobWriter('text/plain'), function (blob) {
                readBlob(blob, function (contents) {
                  var elements = (0, _csvtoarrayJs2['default'])(contents);
                  var languages = elements.slice(1, elements.length - 1).map(function (elem) {
                    return {
                      name: elem[0],
                      proficiency: elem[1]
                    };
                  });
                  linkedinToJsonResume.processLanguages(languages);
                  resolve();
                });
              });
            });

          case 'Recommendations Received.csv':
            return new Promise(function (resolve) {
              entry.getData(new zip.BlobWriter('text/plain'), function (blob) {
                readBlob(blob, function (contents) {
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
                  resolve();
                });
              });
            });

          case 'Profile.csv':
            return new Promise(function (resolve) {
              entry.getData(new zip.BlobWriter('text/plain'), function (blob) {
                readBlob(blob, function (contents) {
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
                  resolve();
                });
              });
            });

          case 'Email Addresses.csv':
            return new Promise(function (resolve) {
              entry.getData(new zip.BlobWriter('text/plain'), function (blob) {
                readBlob(blob, function (contents) {
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
                  resolve();
                });
              });
            });

          case 'Projects.csv':
            return new Promise(function (resolve) {
              entry.getData(new zip.BlobWriter('text/plain'), function (blob) {
                readBlob(blob, function (contents) {
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
                  resolve();
                });
              });
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

  var filedrag = document.getElementById('filedrag'),
      fileselect = document.getElementById('fileselect'),
      fileName = null;
  // file select
  fileselect.addEventListener('change', fileSelectHandler, false);

  // file drag hover
  function fileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = e.type === 'dragover' ? 'hover' : '';
  }

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

  var model = (function () {
    var URL = window.webkitURL || window.mozURL || window.URL;

    return {
      getEntries: function getEntries(file, onend) {
        zip.createReader(new zip.BlobReader(file), function (zipReader) {
          zipReader.getEntries(onend);
        }, onerror);
      },
      getEntryFile: function getEntryFile(entry, creationMethod, onend, onprogress) {
        var writer, zipFileEntry;

        function getData() {
          entry.getData(writer, function (blob) {
            var blobURL = creationMethod === 'Blob' ? URL.createObjectURL(blob) : zipFileEntry.toURL();
            onend(blobURL);
          }, onprogress);
        }

        if (creationMethod === 'Blob') {
          writer = new zip.BlobWriter();
          getData();
        } else {
          createTempFile(function (fileEntry) {
            zipFileEntry = fileEntry;
            writer = new zip.FileWriter(zipFileEntry);
            getData();
          });
        }
      }
    };
  })();

  zip.workerScriptsPath = window.location.pathname + 'vendor/';

  function readBlob(blob, callback) {
    var reader = new FileReader();
    reader.onload = function (e) {
      callback(e.target.result);
    };
    reader.readAsText(blob);
  }
})();

},{"./converter.js":1,"./csvtoarray.js":2,"./file.js":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam9zZXBoL3dvcmtzcGFjZXMvb25saW5lLWN2L2xpbmtlZGluLXRvLWpzb24tcmVzdW1lL2pzL2NvbnZlcnRlci5qcyIsIi9Vc2Vycy9qb3NlcGgvd29ya3NwYWNlcy9vbmxpbmUtY3YvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvY3N2dG9hcnJheS5qcyIsIi9Vc2Vycy9qb3NlcGgvd29ya3NwYWNlcy9vbmxpbmUtY3YvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvZmlsZS5qcyIsIi9Vc2Vycy9qb3NlcGgvd29ya3NwYWNlcy9vbmxpbmUtY3YvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7SUNJTSxvQkFBb0I7QUFDYixXQURQLG9CQUFvQixHQUNWOzBCQURWLG9CQUFvQjs7QUFFdEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7R0FDbEI7O2VBSEcsb0JBQW9COztXQUtmLHFCQUFHOztBQUVWLFVBQUksYUFBYSxHQUFHLENBQ2xCLFFBQVEsRUFDUixNQUFNLEVBQ04sV0FBVyxFQUNYLFdBQVcsRUFDWCxRQUFRLEVBQ1IsY0FBYyxFQUNkLFFBQVEsRUFDUixXQUFXLEVBQ1gsV0FBVyxFQUNYLFlBQVksRUFDWixVQUFVLENBQ1gsQ0FBQzs7QUFFRixVQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7Ozs7OztBQUN0Qiw2QkFBYyxhQUFhLDhIQUFFO2NBQXBCLENBQUM7O0FBQ1IsY0FBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNwQix3QkFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7V0FDbEM7U0FDRjs7Ozs7Ozs7Ozs7Ozs7OztBQUNELGFBQU8sWUFBWSxDQUFDO0tBQ3JCOzs7V0FFTSxpQkFB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QUFDO1NBQ0o7T0FDRjtLQUNGLENBQUM7R0FDSCxDQUFBLEVBQUcsQ0FBQzs7QUFFTCxLQUFHLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDOztBQUU3RCxXQUFTLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQ2hDLFFBQUksTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7QUFDOUIsVUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMxQixjQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMzQixDQUFDO0FBQ0YsVUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUN6QjtDQUVGLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCBtb2R1bGUgKi9cbi8qIGV4cG9ydGVkIG9uTGlua2VkSW5Mb2FkICovXG5cbi8vIHRvZG86IGltcG9ydCBwdWJsaWNhdGlvbnMsIGF3YXJkcywgdm9sdW50ZWVyXG5jbGFzcyBMaW5rZWRJblRvSnNvblJlc3VtZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudGFyZ2V0ID0ge307XG4gIH1cblxuICBnZXRPdXRwdXQoKSB7XG4gICAgLy8gc29ydCB0aGUgb2JqZWN0XG4gICAgdmFyIHByb3BlcnR5T3JkZXIgPSBbXG4gICAgICAnYmFzaWNzJyxcbiAgICAgICd3b3JrJyxcbiAgICAgICd2b2x1bnRlZXInLFxuICAgICAgJ2VkdWNhdGlvbicsXG4gICAgICAnYXdhcmRzJyxcbiAgICAgICdwdWJsaWNhdGlvbnMnLFxuICAgICAgJ3NraWxscycsXG4gICAgICAnbGFuZ3VhZ2VzJyxcbiAgICAgICdpbnRlcmVzdHMnLFxuICAgICAgJ3JlZmVyZW5jZXMnLFxuICAgICAgJ3Byb2plY3RzJ1xuICAgIF07XG5cbiAgICB2YXIgc29ydGVkVGFyZ2V0ID0ge307XG4gICAgZm9yICh2YXIgcCBvZiBwcm9wZXJ0eU9yZGVyKSB7XG4gICAgICBpZiAocCBpbiB0aGlzLnRhcmdldCkge1xuICAgICAgICBzb3J0ZWRUYXJnZXRbcF0gPSB0aGlzLnRhcmdldFtwXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNvcnRlZFRhcmdldDtcbiAgfVxuXG4gIF9leHRlbmQodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICB0YXJnZXQgPSB0YXJnZXQgfHwge307XG4gICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGtleSA9PiB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldKTtcbiAgfVxuXG4gIHByb2Nlc3NQcm9maWxlKHNvdXJjZSkge1xuICAgIHRoaXMudGFyZ2V0LmJhc2ljcyA9IHRoaXMudGFyZ2V0LmJhc2ljcyB8fCB7fTtcbiAgICB0aGlzLl9leHRlbmQodGhpcy50YXJnZXQuYmFzaWNzLCB7XG4gICAgICBuYW1lOiBzb3VyY2UuZmlyc3ROYW1lICsgJyAnICsgc291cmNlLmxhc3ROYW1lLFxuICAgICAgbGFiZWw6IHNvdXJjZS5oZWFkbGluZSxcbiAgICAgIHBpY3R1cmU6IHNvdXJjZS5waWN0dXJlVXJsLFxuICAgICAgcGhvbmU6IHNvdXJjZS5waG9uZU51bWJlcnMgJiYgc291cmNlLnBob25lTnVtYmVycy5fdG90YWwgPyBzb3VyY2UucGhvbmVOdW1iZXJzLnZhbHVlc1swXS5waG9uZU51bWJlciA6ICcnLFxuICAgICAgd2Vic2l0ZTogJycsXG4gICAgICBzdW1tYXJ5OiBzb3VyY2Uuc3VtbWFyeSxcbiAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIGFkZHJlc3M6IHNvdXJjZS5hZGRyZXNzLFxuICAgICAgICBwb3N0YWxDb2RlOiAnJyxcbiAgICAgICAgY2l0eTogc291cmNlLmxvY2F0aW9uID8gc291cmNlLmxvY2F0aW9uLm5hbWUgOiAnJyxcbiAgICAgICAgY291bnRyeUNvZGU6IHNvdXJjZS5sb2NhdGlvbiA/IHNvdXJjZS5sb2NhdGlvbi5jb3VudHJ5LmNvZGUudG9VcHBlckNhc2UoKSA6ICcnLFxuICAgICAgICByZWdpb246ICcnXG4gICAgICB9LFxuICAgICAgcHJvZmlsZXM6IFtdXG4gICAgfSk7XG4gIH1cblxuICBwcm9jZXNzRW1haWwoc291cmNlKSB7XG4gICAgdGhpcy50YXJnZXQuYmFzaWNzID0gdGhpcy50YXJnZXQuYmFzaWNzIHx8IHt9O1xuICAgIHRoaXMuX2V4dGVuZCh0aGlzLnRhcmdldC5iYXNpY3MsIHsnZW1haWwnOiBzb3VyY2UuYWRkcmVzc30pO1xuICB9XG5cbiAgcHJvY2Vzc1Bvc2l0aW9uKHNvdXJjZSkge1xuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc1Bvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgICBsZXQgb2JqZWN0ID0ge1xuICAgICAgICBjb21wYW55OiBwb3NpdGlvbi5jb21wYW55TmFtZSxcbiAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLnRpdGxlIHx8ICcnLFxuICAgICAgICB3ZWJzaXRlOiAnJyxcbiAgICAgICAgc3RhcnREYXRlOiBwb3NpdGlvbi5zdGFydERhdGUueWVhciArICctJyArIChwb3NpdGlvbi5zdGFydERhdGUubW9udGggPCAxMCA/ICcwJyA6ICcnKSArIHBvc2l0aW9uLnN0YXJ0RGF0ZS5tb250aCArICctMDEnLFxuICAgICAgICBzdW1tYXJ5OiBwb3NpdGlvbi5kZXNjcmlwdGlvbixcbiAgICAgICAgaGlnaGxpZ2h0czogW11cbiAgICAgIH07XG5cbiAgICAgIGlmIChwb3NpdGlvbi5lbmREYXRlKSB7XG4gICAgICAgIG9iamVjdC5lbmREYXRlID0gcG9zaXRpb24uZW5kRGF0ZS55ZWFyICsgJy0nICsgKHBvc2l0aW9uLmVuZERhdGUubW9udGggPCAxMCA/ICcwJyA6ICcnKSArIHBvc2l0aW9uLmVuZERhdGUubW9udGggKyAnLTAxJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICB0aGlzLnRhcmdldC53b3JrID0gc291cmNlLm1hcChwcm9jZXNzUG9zaXRpb24pO1xuICB9XG5cbiAgcHJvY2Vzc0VkdWNhdGlvbihzb3VyY2UpIHtcblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NFZHVjYXRpb24oZWR1Y2F0aW9uKSB7XG4gICAgICBsZXQgb2JqZWN0ID0ge1xuICAgICAgICBpbnN0aXR1dGlvbjogZWR1Y2F0aW9uLnNjaG9vbE5hbWUsXG4gICAgICAgIGFyZWE6ICcnLFxuICAgICAgICBzdHVkeVR5cGU6IGVkdWNhdGlvbi5kZWdyZWUsXG4gICAgICAgIHN0YXJ0RGF0ZTogJycgKyBlZHVjYXRpb24uc3RhcnREYXRlICsgJy0wMS0wMScsXG4gICAgICAgIGdwYTogJycsXG4gICAgICAgIGNvdXJzZXM6IFtdXG4gICAgICB9O1xuXG4gICAgICBpZiAoZWR1Y2F0aW9uLmVuZERhdGUpIHtcbiAgICAgICAgb2JqZWN0LmVuZERhdGUgPSBlZHVjYXRpb24uZW5kRGF0ZSArICctMDEtMDEnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIHRoaXMudGFyZ2V0LmVkdWNhdGlvbiA9IHNvdXJjZS5tYXAocHJvY2Vzc0VkdWNhdGlvbik7XG4gIH1cblxuICBwcm9jZXNzU2tpbGxzKHNraWxscykge1xuXG4gICAgdGhpcy50YXJnZXQuc2tpbGxzID0gc2tpbGxzLm1hcChza2lsbCA9PiAoe1xuICAgICAgICBuYW1lOiBza2lsbCxcbiAgICAgICAgbGV2ZWw6ICcnLFxuICAgICAgICBrZXl3b3JkczogW11cbiAgICAgIH0pKTtcbiAgfVxuXG4gIHByb2Nlc3NMYW5ndWFnZXMoc291cmNlKSB7XG5cbiAgICBmdW5jdGlvbiBjbGVhblByb2ZpY2llbmN5U3RyaW5nKHByb2ZpY2llbmN5KSB7XG4gICAgICBwcm9maWNpZW5jeSA9IHByb2ZpY2llbmN5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXy9nLCAnICcpO1xuICAgICAgcmV0dXJuIHByb2ZpY2llbmN5WzBdLnRvVXBwZXJDYXNlKCkgKyBwcm9maWNpZW5jeS5zdWJzdHIoMSk7XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXQubGFuZ3VhZ2VzID0gc291cmNlLm1hcChsYW5ndWFnZSA9PiAoe1xuICAgICAgbGFuZ3VhZ2U6IGxhbmd1YWdlLm5hbWUsXG4gICAgICBmbHVlbmN5OiBsYW5ndWFnZS5wcm9maWNpZW5jeSA/IGNsZWFuUHJvZmljaWVuY3lTdHJpbmcobGFuZ3VhZ2UucHJvZmljaWVuY3kpIDogbnVsbFxuICAgIH0pKTtcbiAgfVxuXG4gIHByb2Nlc3NSZWZlcmVuY2VzKHNvdXJjZSkge1xuXG4gICAgdGhpcy50YXJnZXQucmVmZXJlbmNlcyA9IHNvdXJjZS5tYXAocmVmZXJlbmNlID0+ICh7XG4gICAgICBuYW1lOiByZWZlcmVuY2UucmVjb21tZW5kZXJGaXJzdE5hbWUgKyAnICcgKyByZWZlcmVuY2UucmVjb21tZW5kZXJMYXN0TmFtZSxcbiAgICAgIHJlZmVyZW5jZTogcmVmZXJlbmNlLnJlY29tbWVuZGF0aW9uQm9keVxuICAgIH0pKTtcbiAgfVxuXG4gIHByb2Nlc3NQcm9qZWN0cyhzb3VyY2UpIHtcblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NQcm9qZWN0cyhwcm9qZWN0KSB7XG5cbiAgICAgICBsZXQgcCA9IHtcbiAgICAgICAgICBuYW1lOiBwcm9qZWN0LnRpdGxlLFxuICAgICAgICAgIHN0YXJ0RGF0ZTogcHJvamVjdC5zdGFydERhdGUsXG4gICAgICAgICAgc3VtbWFyeTogcHJvamVjdC5kZXNjcmlwdGlvbixcbiAgICAgICAgICB1cmw6IHByb2plY3QudXJsXG4gICAgICAgIH07XG4gICAgICAgaWYocHJvamVjdC5lbmREYXRlKSB7XG4gICAgICAgICAgcC5lbmREYXRlID0gcHJvamVjdC5lbmREYXRlO1xuICAgICAgIH1cbiAgICAgICByZXR1cm4gcDtcbiAgICB9XG4gICAgXG4gICAgdGhpcy50YXJnZXQucHJvamVjdHMgPSBzb3VyY2UubWFwKHByb2Nlc3NQcm9qZWN0cylcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGlua2VkSW5Ub0pzb25SZXN1bWU7XG4iLCIvKiBnbG9iYWwgbW9kdWxlICovXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyByZWY6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEyOTMxNjMvMjM0M1xuICAvLyBUaGlzIHdpbGwgcGFyc2UgYSBkZWxpbWl0ZWQgc3RyaW5nIGludG8gYW4gYXJyYXkgb2ZcbiAgLy8gYXJyYXlzLiBUaGUgZGVmYXVsdCBkZWxpbWl0ZXIgaXMgdGhlIGNvbW1hLCBidXQgdGhpc1xuICAvLyBjYW4gYmUgb3ZlcnJpZGVuIGluIHRoZSBzZWNvbmQgYXJndW1lbnQuXG4gIGZ1bmN0aW9uIENTVlRvQXJyYXkoc3RyRGF0YSwgc3RyRGVsaW1pdGVyKSB7XG4gICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBkZWxpbWl0ZXIgaXMgZGVmaW5lZC4gSWYgbm90LFxuICAgIC8vIHRoZW4gZGVmYXVsdCB0byBjb21tYS5cbiAgICBzdHJEZWxpbWl0ZXIgPSAoc3RyRGVsaW1pdGVyIHx8ICcsJyk7XG5cbiAgICAvLyBDcmVhdGUgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gcGFyc2UgdGhlIENTViB2YWx1ZXMuXG4gICAgdmFyIG9ialBhdHRlcm4gPSBuZXcgUmVnRXhwKFxuICAgICAgICAoXG5cbiAgICAgICAgICAgIC8vIERlbGltaXRlcnMuXG4gICAgICAgICAgICAnKFxcXFwnICsgc3RyRGVsaW1pdGVyICsgJ3xcXFxccj9cXFxcbnxcXFxccnxeKScgK1xuXG4gICAgICAgICAgICAvLyBRdW90ZWQgZmllbGRzLlxuICAgICAgICAgICAgJyg/OlxcXCIoW15cXFwiXSooPzpcXFwiXFxcIlteXFxcIl0qKSopXFxcInwnICtcblxuICAgICAgICAgICAgLy8gU3RhbmRhcmQgZmllbGRzLlxuICAgICAgICAgICAgJyhbXlxcXCJcXFxcJyArIHN0ckRlbGltaXRlciArICdcXFxcclxcXFxuXSopKSdcbiAgICAgICAgKSxcbiAgICAgICAgJ2dpJ1xuICAgICAgICApO1xuXG4gICAgLy8gQ3JlYXRlIGFuIGFycmF5IHRvIGhvbGQgb3VyIGRhdGEuIEdpdmUgdGhlIGFycmF5XG4gICAgLy8gYSBkZWZhdWx0IGVtcHR5IGZpcnN0IHJvdy5cbiAgICB2YXIgYXJyRGF0YSA9IFtbXV07XG5cbiAgICAvLyBDcmVhdGUgYW4gYXJyYXkgdG8gaG9sZCBvdXIgaW5kaXZpZHVhbCBwYXR0ZXJuXG4gICAgLy8gbWF0Y2hpbmcgZ3JvdXBzLlxuICAgIHZhciBhcnJNYXRjaGVzID0gbnVsbDtcblxuICAgIC8vIEtlZXAgbG9vcGluZyBvdmVyIHRoZSByZWd1bGFyIGV4cHJlc3Npb24gbWF0Y2hlc1xuICAgIC8vIHVudGlsIHdlIGNhbiBubyBsb25nZXIgZmluZCBhIG1hdGNoLlxuICAgIGRvIHtcbiAgICAgIGFyck1hdGNoZXMgPSBvYmpQYXR0ZXJuLmV4ZWMoc3RyRGF0YSk7XG4gICAgICBpZiAoIWFyck1hdGNoZXMpIHsgYnJlYWs7IH1cblxuICAgICAgLy8gR2V0IHRoZSBkZWxpbWl0ZXIgdGhhdCB3YXMgZm91bmQuXG4gICAgICB2YXIgc3RyTWF0Y2hlZERlbGltaXRlciA9IGFyck1hdGNoZXNbIDEgXTtcblxuICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBnaXZlbiBkZWxpbWl0ZXIgaGFzIGEgbGVuZ3RoXG4gICAgICAvLyAoaXMgbm90IHRoZSBzdGFydCBvZiBzdHJpbmcpIGFuZCBpZiBpdCBtYXRjaGVzXG4gICAgICAvLyBmaWVsZCBkZWxpbWl0ZXIuIElmIGlkIGRvZXMgbm90LCB0aGVuIHdlIGtub3dcbiAgICAgIC8vIHRoYXQgdGhpcyBkZWxpbWl0ZXIgaXMgYSByb3cgZGVsaW1pdGVyLlxuICAgICAgaWYgKFxuICAgICAgICAgIHN0ck1hdGNoZWREZWxpbWl0ZXIubGVuZ3RoICYmXG4gICAgICAgICAgc3RyTWF0Y2hlZERlbGltaXRlciAhPT0gc3RyRGVsaW1pdGVyXG4gICAgICAgICAgKSB7XG5cbiAgICAgICAgLy8gU2luY2Ugd2UgaGF2ZSByZWFjaGVkIGEgbmV3IHJvdyBvZiBkYXRhLFxuICAgICAgICAvLyBhZGQgYW4gZW1wdHkgcm93IHRvIG91ciBkYXRhIGFycmF5LlxuICAgICAgICBhcnJEYXRhLnB1c2goW10pO1xuXG4gICAgICB9XG5cbiAgICAgIHZhciBzdHJNYXRjaGVkVmFsdWU7XG5cbiAgICAgIC8vIE5vdyB0aGF0IHdlIGhhdmUgb3VyIGRlbGltaXRlciBvdXQgb2YgdGhlIHdheSxcbiAgICAgIC8vIGxldCdzIGNoZWNrIHRvIHNlZSB3aGljaCBraW5kIG9mIHZhbHVlIHdlXG4gICAgICAvLyBjYXB0dXJlZCAocXVvdGVkIG9yIHVucXVvdGVkKS5cbiAgICAgIGlmIChhcnJNYXRjaGVzWyAyIF0pIHtcblxuICAgICAgICAvLyBXZSBmb3VuZCBhIHF1b3RlZCB2YWx1ZS4gV2hlbiB3ZSBjYXB0dXJlXG4gICAgICAgIC8vIHRoaXMgdmFsdWUsIHVuZXNjYXBlIGFueSBkb3VibGUgcXVvdGVzLlxuICAgICAgICBzdHJNYXRjaGVkVmFsdWUgPSBhcnJNYXRjaGVzWyAyIF0ucmVwbGFjZShcbiAgICAgICAgICAgIG5ldyBSZWdFeHAoJ1xcXCJcXFwiJywgJ2cnKSxcbiAgICAgICAgICAgICdcXFwiJ1xuICAgICAgICAgICAgKTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICAvLyBXZSBmb3VuZCBhIG5vbi1xdW90ZWQgdmFsdWUuXG4gICAgICAgIHN0ck1hdGNoZWRWYWx1ZSA9IGFyck1hdGNoZXNbIDMgXTtcblxuICAgICAgfVxuXG4gICAgICAvLyBOb3cgdGhhdCB3ZSBoYXZlIG91ciB2YWx1ZSBzdHJpbmcsIGxldCdzIGFkZFxuICAgICAgLy8gaXQgdG8gdGhlIGRhdGEgYXJyYXkuXG4gICAgICBhcnJEYXRhWyBhcnJEYXRhLmxlbmd0aCAtIDEgXS5wdXNoKHN0ck1hdGNoZWRWYWx1ZSA/IHN0ck1hdGNoZWRWYWx1ZS50cmltKCkgOiBzdHJNYXRjaGVkVmFsdWUpO1xuICAgIH0gd2hpbGUgKHRydWUpO1xuXG4gICAgLy8gUmV0dXJuIHRoZSBwYXJzZWQgZGF0YS5cbiAgICByZXR1cm4gYXJyRGF0YTtcbiAgfVxuXG4gIG1vZHVsZS5leHBvcnRzID0gQ1NWVG9BcnJheTtcbn0pKCk7XG4iLCIvKiBnbG9iYWwgVVJMLCBCbG9iLCBtb2R1bGUgKi9cbi8qIGV4cG9ydGVkIHNhdmUgKi9cbnZhciBzYXZlID0gKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gc2F2ZUFzIGZyb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vTXJTd2l0Y2gvMzU1Mjk4NVxuICB2YXIgc2F2ZUFzID0gd2luZG93LnNhdmVBcyB8fCAod2luZG93Lm5hdmlnYXRvci5tc1NhdmVCbG9iID8gZnVuY3Rpb24oYiwgbikge1xuICAgICAgcmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlQmxvYihiLCBuKTtcbiAgICB9IDogZmFsc2UpIHx8IHdpbmRvdy53ZWJraXRTYXZlQXMgfHwgd2luZG93Lm1velNhdmVBcyB8fCB3aW5kb3cubXNTYXZlQXMgfHwgKGZ1bmN0aW9uKCkge1xuXG4gICAgICAvLyBVUkwnc1xuICAgICAgd2luZG93LlVSTCA9IHdpbmRvdy5VUkwgfHwgd2luZG93LndlYmtpdFVSTDtcblxuICAgICAgaWYgKCF3aW5kb3cuVVJMKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGJsb2IsIG5hbWUpIHtcbiAgICAgICAgdmFyIHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cbiAgICAgICAgLy8gVGVzdCBmb3IgZG93bmxvYWQgbGluayBzdXBwb3J0XG4gICAgICAgIGlmICgnZG93bmxvYWQnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSkge1xuXG4gICAgICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB1cmwpO1xuICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIG5hbWUpO1xuXG4gICAgICAgICAgLy8gQ3JlYXRlIENsaWNrIGV2ZW50XG4gICAgICAgICAgdmFyIGNsaWNrRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnTW91c2VFdmVudCcpO1xuICAgICAgICAgIGNsaWNrRXZlbnQuaW5pdE1vdXNlRXZlbnQoJ2NsaWNrJywgdHJ1ZSwgdHJ1ZSwgd2luZG93LCAwLFxuICAgICAgICAgICAgMCwgMCwgMCwgMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIG51bGwpO1xuXG4gICAgICAgICAgLy8gZGlzcGF0Y2ggY2xpY2sgZXZlbnQgdG8gc2ltdWxhdGUgZG93bmxvYWRcbiAgICAgICAgICBhLmRpc3BhdGNoRXZlbnQoY2xpY2tFdmVudCk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBmYWxsb3Zlciwgb3BlbiByZXNvdXJjZSBpbiBuZXcgdGFiLlxuICAgICAgICAgIHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycsICcnKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KSgpO1xuXG4gIGZ1bmN0aW9uIF9zYXZlKHRleHQsIGZpbGVOYW1lKSB7XG4gICAgdmFyIGJsb2IgPSBuZXcgQmxvYihbdGV4dF0sIHtcbiAgICAgIHR5cGU6ICd0ZXh0L3BsYWluJ1xuICAgIH0pO1xuICAgIHNhdmVBcyhibG9iLCBmaWxlTmFtZSB8fCAnc3VidGl0bGUuc3J0Jyk7XG4gIH1cblxuICByZXR1cm4gX3NhdmU7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2F2ZTtcbiIsIi8qIGdsb2JhbCB6aXAsIGNyZWF0ZVRlbXBGaWxlLCBQcmlzbSAqL1xuXG5pbXBvcnQgTGlua2VkSW5Ub0pzb25SZXN1bWUgZnJvbSAnLi9jb252ZXJ0ZXIuanMnO1xuaW1wb3J0IGNzdlRvQXJyYXkgZnJvbSAnLi9jc3Z0b2FycmF5LmpzJztcbmltcG9ydCBzYXZlIGZyb20gJy4vZmlsZS5qcyc7XG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBsaW5rZWRpblRvSnNvblJlc3VtZSA9IG5ldyBMaW5rZWRJblRvSnNvblJlc3VtZSgpO1xuXG4gIHZhciBkb3dubG9hZEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kb3dubG9hZCcpO1xuICBkb3dubG9hZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIHNhdmUoSlNPTi5zdHJpbmdpZnkobGlua2VkaW5Ub0pzb25SZXN1bWUuZ2V0T3V0cHV0KCksIHVuZGVmaW5lZCwgMiksICdyZXN1bWUuanNvbicpO1xuICB9KTtcbiAgZG93bmxvYWRCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAvLyBmaWxlIHNlbGVjdGlvblxuICBmdW5jdGlvbiBmaWxlU2VsZWN0SGFuZGxlcihlKSB7XG4gICAgLy8gY2FuY2VsIGV2ZW50IGFuZCBob3ZlciBzdHlsaW5nXG4gICAgZmlsZURyYWdIb3ZlcihlKTtcblxuICAgIHZhciBkcm9wcGVkRmlsZXMgPSBlLnRhcmdldC5maWxlcyB8fCBlLmRhdGFUcmFuc2Zlci5maWxlcztcblxuICAgIHZhciBmaWxlID0gZHJvcHBlZEZpbGVzWzBdO1xuICAgIGZpbGVOYW1lID0gZmlsZS5uYW1lO1xuXG4gICAgbW9kZWwuZ2V0RW50cmllcyhmaWxlLCBmdW5jdGlvbihlbnRyaWVzKSB7XG5cbiAgICAgIHZhciBwcm9taXNlcyA9IGVudHJpZXMubWFwKGZ1bmN0aW9uKGVudHJ5KSB7XG5cbiAgICAgICAgLy8gdG9kbzogdXNlIHByb21pc2VzXG4gICAgICAgIHN3aXRjaCAoZW50cnkuZmlsZW5hbWUpIHtcbiAgICAgICAgICBjYXNlICdTa2lsbHMuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICByZWFkQmxvYihibG9iLCBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICAgICAgICAgICAgY29udGVudHMgPSBjb250ZW50cy5yZXBsYWNlKC9cIi9nLCAnJyk7XG4gICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBjb250ZW50cy5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICAgICAgICBlbGVtZW50cyA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtMSk7XG4gICAgICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzU2tpbGxzKGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNhc2UgJ0VkdWNhdGlvbi5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgZW50cnkuZ2V0RGF0YShuZXcgemlwLkJsb2JXcml0ZXIoJ3RleHQvcGxhaW4nKSwgZnVuY3Rpb24oYmxvYikge1xuICAgICAgICAgICAgICAgIHJlYWRCbG9iKGJsb2IsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBjc3ZUb0FycmF5KGNvbnRlbnRzKTtcbiAgICAgICAgICAgICAgICAgIHZhciBlZHVjYXRpb24gPSBlbGVtZW50cy5zbGljZSgxLCBlbGVtZW50cy5sZW5ndGggLSAxKS5tYXAoZnVuY3Rpb24oZWxlbSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgIHNjaG9vbE5hbWU6IGVsZW1bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgc3RhcnREYXRlOiBlbGVtWzFdLFxuICAgICAgICAgICAgICAgICAgICAgIGVuZERhdGU6IGVsZW1bMl0sXG4gICAgICAgICAgICAgICAgICAgICAgbm90ZXM6IGVsZW1bM10sXG4gICAgICAgICAgICAgICAgICAgICAgZGVncmVlOiBlbGVtWzRdLFxuICAgICAgICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IGVsZW1bNV1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc0VkdWNhdGlvbihlZHVjYXRpb24uc29ydCgoZTEsZTIpID0+XG4gICAgICAgICAgICAgICAgICAgICgrZTIuc3RhcnREYXRlLnllYXIgLSArZTEuc3RhcnREYXRlLnllYXIpIHx8ICgrZTIuc3RhcnREYXRlLm1vbnRoIC0gK2UxLnN0YXJ0RGF0ZS5tb250aClcbiAgICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2FzZSAnUG9zaXRpb25zLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMpO1xuICAgICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9ucyA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29tcGFueU5hbWU6IGVsZW1bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGVsZW1bMV0sXG4gICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246IGVsZW1bMl0sXG4gICAgICAgICAgICAgICAgICAgICAgc3RhcnREYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ZWFyOiBlbGVtWzNdLnNwbGl0KCcvJylbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aDogZWxlbVszXS5zcGxpdCgnLycpWzBdXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBlbmREYXRlOiBlbGVtWzRdID8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeWVhcjogZWxlbVs0XS5zcGxpdCgnLycpWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6IGVsZW1bNF0uc3BsaXQoJy8nKVswXVxuICAgICAgICAgICAgICAgICAgICAgIH0gOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBlbGVtWzVdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NQb3NpdGlvbihwb3NpdGlvbnMuc29ydCgocDEscDIpID0+XG4gICAgICAgICAgICAgICAgICAgICgrcDIuc3RhcnREYXRlLnllYXIgLSArcDEuc3RhcnREYXRlLnllYXIpIHx8ICgrcDIuc3RhcnREYXRlLm1vbnRoIC0gK3AxLnN0YXJ0RGF0ZS5tb250aClcbiAgICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2FzZSAnTGFuZ3VhZ2VzLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMpO1xuICAgICAgICAgICAgICAgICAgdmFyIGxhbmd1YWdlcyA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogZWxlbVswXSxcbiAgICAgICAgICAgICAgICAgICAgICBwcm9maWNpZW5jeTogZWxlbVsxXVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzTGFuZ3VhZ2VzKGxhbmd1YWdlcyk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdSZWNvbW1lbmRhdGlvbnMgUmVjZWl2ZWQuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICByZWFkQmxvYihibG9iLCBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cywgJ1xcdCcpOyAvLyB5ZXMsIHJlY29tbWVuZGF0aW9ucyB1c2UgdGFiLWRlbGltaXRlclxuICAgICAgICAgICAgICAgICAgdmFyIHJlY29tbWVuZGF0aW9ucyA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25EYXRlOiBlbGVtWzBdLFxuICAgICAgICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uQm9keTogZWxlbVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICByZWNvbW1lbmRlckZpcnN0TmFtZTogZWxlbVsyXSxcbiAgICAgICAgICAgICAgICAgICAgICByZWNvbW1lbmRlckxhc3ROYW1lOiBlbGVtWzNdLFxuICAgICAgICAgICAgICAgICAgICAgIHJlY29tbWVuZGVyQ29tcGFueTogZWxlbVs0XSxcbiAgICAgICAgICAgICAgICAgICAgICByZWNvbW1lbmRlclRpdGxlOiBlbGVtWzVdLFxuICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlTdGF0dXM6IGVsZW1bNl1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIH0pLmZpbHRlcihmdW5jdGlvbihyZWNvbW1lbmRhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjb21tZW5kYXRpb24uZGlzcGxheVN0YXR1cyA9PT0gJ1Nob3duJztcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc1JlZmVyZW5jZXMocmVjb21tZW5kYXRpb25zKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNhc2UgJ1Byb2ZpbGUuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICByZWFkQmxvYihibG9iLCBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cyk7XG4gICAgICAgICAgICAgICAgICB2YXIgcHJvZmlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3ROYW1lOiBlbGVtZW50c1sxXVswXSxcbiAgICAgICAgICAgICAgICAgICAgbGFzdE5hbWU6IGVsZW1lbnRzWzFdWzFdLFxuICAgICAgICAgICAgICAgICAgICBtYWlkZW5OYW1lOiBlbGVtZW50c1sxXVsyXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZERhdGU6IGVsZW1lbnRzWzFdWzNdLFxuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiBlbGVtZW50c1sxXVs0XSxcbiAgICAgICAgICAgICAgICAgICAgYmlydGhEYXRlOiBlbGVtZW50c1sxXVs1XSxcbiAgICAgICAgICAgICAgICAgICAgY29udGFjdEluc3RydWN0aW9uczogZWxlbWVudHNbMV1bNl0sXG4gICAgICAgICAgICAgICAgICAgIG1hcml0YWxTdGF0dXM6IGVsZW1lbnRzWzFdWzddLFxuICAgICAgICAgICAgICAgICAgICBoZWFkbGluZTogZWxlbWVudHNbMV1bOF0sXG4gICAgICAgICAgICAgICAgICAgIHN1bW1hcnk6IGVsZW1lbnRzWzFdWzldLFxuICAgICAgICAgICAgICAgICAgICBpbmR1c3RyeTogZWxlbWVudHNbMV1bMTBdLFxuICAgICAgICAgICAgICAgICAgICBhc3NvY2lhdGlvbjogZWxlbWVudHNbMV1bMTFdXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc1Byb2ZpbGUocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNhc2UgJ0VtYWlsIEFkZHJlc3Nlcy5jc3YnOlxuICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICAgIHJlYWRCbG9iKGJsb2IsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMsICdcXHQnKTsgLy8geWVzLCByZWNvbW1lbmRhdGlvbnMgdXNlIHRhYi1kZWxpbWl0ZXJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVtYWlsID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkubWFwKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogZWxlbVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZWxlbVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUHJpbWFyeTogZWxlbVsyXSA9PT0gJ1llcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlQWRkZWQ6IGVsZW1bM10sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlUmVtb3ZlZDogZWxlbVs0XVxuICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0pLmZpbHRlcihlbWFpbCA9PiBlbWFpbC5pc1ByaW1hcnkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW1haWwubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc0VtYWlsKGVtYWlsWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdQcm9qZWN0cy5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgZW50cnkuZ2V0RGF0YShuZXcgemlwLkJsb2JXcml0ZXIoJ3RleHQvcGxhaW4nKSwgZnVuY3Rpb24oYmxvYikge1xuICAgICAgICAgICAgICAgIHJlYWRCbG9iKGJsb2IsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBjc3ZUb0FycmF5KGNvbnRlbnRzKTtcbiAgICAgICAgICAgICAgICAgIHZhciBwcm9qZWN0cyA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGVsZW1bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgc3RhcnREYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ZWFyOiBlbGVtWzFdLnNwbGl0KCcvJylbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aDogZWxlbVsxXS5zcGxpdCgnLycpWzBdXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBlbmREYXRlOiBlbGVtWzJdID8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeWVhcjogZWxlbVsyXS5zcGxpdCgnLycpWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6IGVsZW1bMl0uc3BsaXQoJy8nKVswXVxuICAgICAgICAgICAgICAgICAgICAgIH0gOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBlbGVtWzNdLFxuICAgICAgICAgICAgICAgICAgICAgIHVybDogZWxlbVs0XVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzUHJvamVjdHMocHJvamVjdHMuc29ydCgocDEscDIpID0+XG4gICAgICAgICAgICAgICAgICAgICgrcDIuc3RhcnREYXRlLnllYXIgLSArcDEuc3RhcnREYXRlLnllYXIpIHx8ICgrcDIuc3RhcnREYXRlLm1vbnRoIC0gK3AxLnN0YXJ0RGF0ZS5tb250aClcbiAgICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGZpbGVkcmFnLmlubmVySFRNTCA9ICdEcm9wcGVkISBTZWUgdGhlIHJlc3VsdGluZyBKU09OIFJlc3VtZSBhdCB0aGUgYm90dG9tLic7XG4gICAgICAgIHZhciBvdXRwdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3V0cHV0Jyk7XG4gICAgICAgIG91dHB1dC5pbm5lckhUTUwgPSBKU09OLnN0cmluZ2lmeShsaW5rZWRpblRvSnNvblJlc3VtZS5nZXRPdXRwdXQoKSwgdW5kZWZpbmVkLCAyKTtcbiAgICAgICAgUHJpc20uaGlnaGxpZ2h0RWxlbWVudChvdXRwdXQpO1xuICAgICAgICBkb3dubG9hZEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICB2YXIgZmlsZWRyYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZWRyYWcnKSxcbiAgICAgIGZpbGVzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZXNlbGVjdCcpLFxuICAgICAgZmlsZU5hbWUgPSBudWxsO1xuICAvLyBmaWxlIHNlbGVjdFxuICBmaWxlc2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZpbGVTZWxlY3RIYW5kbGVyLCBmYWxzZSk7XG5cbiAgLy8gZmlsZSBkcmFnIGhvdmVyXG4gIGZ1bmN0aW9uIGZpbGVEcmFnSG92ZXIoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUudGFyZ2V0LmNsYXNzTmFtZSA9IChlLnR5cGUgPT09ICdkcmFnb3ZlcicgPyAnaG92ZXInIDogJycpO1xuICB9XG5cbiAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICBpZiAoeGhyLnVwbG9hZCkge1xuICAgIC8vIGZpbGUgZHJvcFxuICAgIGZpbGVkcmFnLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZmlsZURyYWdIb3ZlciwgZmFsc2UpO1xuICAgIGZpbGVkcmFnLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGZpbGVEcmFnSG92ZXIsIGZhbHNlKTtcbiAgICBmaWxlZHJhZy5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZmlsZVNlbGVjdEhhbmRsZXIsIGZhbHNlKTtcbiAgICBmaWxlZHJhZy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgfSBlbHNlIHtcbiAgICBmaWxlZHJhZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9XG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdC1maWxlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgZmlsZXNlbGVjdC5jbGljaygpO1xuICB9KTtcblxuICB2YXIgbW9kZWwgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIFVSTCA9IHdpbmRvdy53ZWJraXRVUkwgfHwgd2luZG93Lm1velVSTCB8fCB3aW5kb3cuVVJMO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldEVudHJpZXMgOiBmdW5jdGlvbihmaWxlLCBvbmVuZCkge1xuICAgICAgICB6aXAuY3JlYXRlUmVhZGVyKG5ldyB6aXAuQmxvYlJlYWRlcihmaWxlKSwgZnVuY3Rpb24oemlwUmVhZGVyKSB7XG4gICAgICAgICAgemlwUmVhZGVyLmdldEVudHJpZXMob25lbmQpO1xuICAgICAgICB9LCBvbmVycm9yKTtcbiAgICAgIH0sXG4gICAgICBnZXRFbnRyeUZpbGUgOiBmdW5jdGlvbihlbnRyeSwgY3JlYXRpb25NZXRob2QsIG9uZW5kLCBvbnByb2dyZXNzKSB7XG4gICAgICAgIHZhciB3cml0ZXIsIHppcEZpbGVFbnRyeTtcblxuICAgICAgICBmdW5jdGlvbiBnZXREYXRhKCkge1xuICAgICAgICAgIGVudHJ5LmdldERhdGEod3JpdGVyLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICB2YXIgYmxvYlVSTCA9IGNyZWF0aW9uTWV0aG9kID09PSAnQmxvYicgPyBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpIDogemlwRmlsZUVudHJ5LnRvVVJMKCk7XG4gICAgICAgICAgICBvbmVuZChibG9iVVJMKTtcbiAgICAgICAgICB9LCBvbnByb2dyZXNzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjcmVhdGlvbk1ldGhvZCA9PT0gJ0Jsb2InKSB7XG4gICAgICAgICAgd3JpdGVyID0gbmV3IHppcC5CbG9iV3JpdGVyKCk7XG4gICAgICAgICAgZ2V0RGF0YSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNyZWF0ZVRlbXBGaWxlKGZ1bmN0aW9uKGZpbGVFbnRyeSkge1xuICAgICAgICAgICAgemlwRmlsZUVudHJ5ID0gZmlsZUVudHJ5O1xuICAgICAgICAgICAgd3JpdGVyID0gbmV3IHppcC5GaWxlV3JpdGVyKHppcEZpbGVFbnRyeSk7XG4gICAgICAgICAgICBnZXREYXRhKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9KSgpO1xuXG4gIHppcC53b3JrZXJTY3JpcHRzUGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArICd2ZW5kb3IvJztcblxuICBmdW5jdGlvbiByZWFkQmxvYihibG9iLCBjYWxsYmFjaykge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG4gICAgICBjYWxsYmFjayhlLnRhcmdldC5yZXN1bHQpO1xuICAgIH07XG4gICAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYik7XG4gIH1cblxufSkoKTtcbiJdfQ==
