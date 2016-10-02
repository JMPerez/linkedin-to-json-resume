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

          case 'Interests.csv':
            return new Promise(function (resolve) {
              entry.getData(new zip.BlobWriter('text/plain'), function (blob) {
                readBlob(blob, function (contents) {
                  var elements = (0, _csvtoarrayJs2['default'])(contents);
                  var interests = [];
                  elements.slice(1, elements.length - 1).forEach(function (elem) {
                    interests.concat(elem[0].split(','));
                  });
                  linkedinToJsonResume.processInterests(interests);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam9zZXBoL3dvcmtzcGFjZXMvb25saW5lLWN2L2xpbmtlZGluLXRvLWpzb24tcmVzdW1lL2pzL2NvbnZlcnRlci5qcyIsIi9Vc2Vycy9qb3NlcGgvd29ya3NwYWNlcy9vbmxpbmUtY3YvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvY3N2dG9hcnJheS5qcyIsIi9Vc2Vycy9qb3NlcGgvd29ya3NwYWNlcy9vbmxpbmUtY3YvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvZmlsZS5qcyIsIi9Vc2Vycy9qb3NlcGgvd29ya3NwYWNlcy9vbmxpbmUtY3YvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7SUNJTSxvQkFBb0I7QUFDYixXQURQLG9CQUFvQixHQUNWOzBCQURWLG9CQUFvQjs7QUFFdEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7R0FDbEI7O2VBSEcsb0JBQW9COztXQUtmLHFCQUFHOztBQUVWLFVBQUksYUFBYSxHQUFHLENBQ2xCLFFBQVEsRUFDUixNQUFNLEVBQ04sV0FBVyxFQUNYLFdBQVcsRUFDWCxRQUFRLEVBQ1IsY0FBYyxFQUNkLFFBQVEsRUFDUixXQUFXLEVBQ1gsV0FBVyxFQUNYLFlBQVksRUFDWixVQUFVLENBQ1gsQ0FBQzs7QUFFRixVQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7Ozs7OztBQUN0Qiw2QkFBYyxhQUFhLDhIQUFFO2NBQXBCLENBQUM7O0FBQ1IsY0FBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNwQix3QkFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7V0FDbEM7U0FDRjs7Ozs7Ozs7Ozs7Ozs7OztBQUNELGFBQU8sWUFBWSxDQUFDO0tBQ3JCOzs7V0FFTSxpQkFB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QztBQUN6QixrQkFBTSxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMxQyxtQkFBTyxFQUFFLENBQUM7V0FDWCxDQUFDLENBQUM7U0FDSjtPQUNGO0tBQ0YsQ0FBQztHQUNILENBQUEsRUFBRyxDQUFDOztBQUVMLEtBQUcsQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7O0FBRTdELFdBQVMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDaEMsUUFBSSxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUM5QixVQUFNLENBQUMsTUFBTSxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzFCLGNBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzNCLENBQUM7QUFDRixVQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3pCO0NBRUYsQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIG1vZHVsZSAqL1xuLyogZXhwb3J0ZWQgb25MaW5rZWRJbkxvYWQgKi9cblxuLy8gdG9kbzogaW1wb3J0IHB1YmxpY2F0aW9ucywgYXdhcmRzLCB2b2x1bnRlZXJcbmNsYXNzIExpbmtlZEluVG9Kc29uUmVzdW1lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50YXJnZXQgPSB7fTtcbiAgfVxuXG4gIGdldE91dHB1dCgpIHtcbiAgICAvLyBzb3J0IHRoZSBvYmplY3RcbiAgICB2YXIgcHJvcGVydHlPcmRlciA9IFtcbiAgICAgICdiYXNpY3MnLFxuICAgICAgJ3dvcmsnLFxuICAgICAgJ3ZvbHVudGVlcicsXG4gICAgICAnZWR1Y2F0aW9uJyxcbiAgICAgICdhd2FyZHMnLFxuICAgICAgJ3B1YmxpY2F0aW9ucycsXG4gICAgICAnc2tpbGxzJyxcbiAgICAgICdsYW5ndWFnZXMnLFxuICAgICAgJ2ludGVyZXN0cycsXG4gICAgICAncmVmZXJlbmNlcycsXG4gICAgICAncHJvamVjdHMnXG4gICAgXTtcblxuICAgIHZhciBzb3J0ZWRUYXJnZXQgPSB7fTtcbiAgICBmb3IgKHZhciBwIG9mIHByb3BlcnR5T3JkZXIpIHtcbiAgICAgIGlmIChwIGluIHRoaXMudGFyZ2V0KSB7XG4gICAgICAgIHNvcnRlZFRhcmdldFtwXSA9IHRoaXMudGFyZ2V0W3BdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc29ydGVkVGFyZ2V0O1xuICB9XG5cbiAgX2V4dGVuZCh0YXJnZXQsIHNvdXJjZSkge1xuICAgIHRhcmdldCA9IHRhcmdldCB8fCB7fTtcbiAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goa2V5ID0+IHRhcmdldFtrZXldID0gc291cmNlW2tleV0pO1xuICB9XG5cbiAgcHJvY2Vzc1Byb2ZpbGUoc291cmNlKSB7XG4gICAgdGhpcy50YXJnZXQuYmFzaWNzID0gdGhpcy50YXJnZXQuYmFzaWNzIHx8IHt9O1xuICAgIHRoaXMuX2V4dGVuZCh0aGlzLnRhcmdldC5iYXNpY3MsIHtcbiAgICAgIG5hbWU6IHNvdXJjZS5maXJzdE5hbWUgKyAnICcgKyBzb3VyY2UubGFzdE5hbWUsXG4gICAgICBsYWJlbDogc291cmNlLmhlYWRsaW5lLFxuICAgICAgcGljdHVyZTogc291cmNlLnBpY3R1cmVVcmwsXG4gICAgICBwaG9uZTogc291cmNlLnBob25lTnVtYmVycyAmJiBzb3VyY2UucGhvbmVOdW1iZXJzLl90b3RhbCA/IHNvdXJjZS5waG9uZU51bWJlcnMudmFsdWVzWzBdLnBob25lTnVtYmVyIDogJycsXG4gICAgICB3ZWJzaXRlOiAnJyxcbiAgICAgIHN1bW1hcnk6IHNvdXJjZS5zdW1tYXJ5LFxuICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgYWRkcmVzczogc291cmNlLmFkZHJlc3MsXG4gICAgICAgIHBvc3RhbENvZGU6ICcnLFxuICAgICAgICBjaXR5OiBzb3VyY2UubG9jYXRpb24gPyBzb3VyY2UubG9jYXRpb24ubmFtZSA6ICcnLFxuICAgICAgICBjb3VudHJ5Q29kZTogc291cmNlLmxvY2F0aW9uID8gc291cmNlLmxvY2F0aW9uLmNvdW50cnkuY29kZS50b1VwcGVyQ2FzZSgpIDogJycsXG4gICAgICAgIHJlZ2lvbjogJydcbiAgICAgIH0sXG4gICAgICBwcm9maWxlczogW11cbiAgICB9KTtcbiAgfVxuXG4gIHByb2Nlc3NFbWFpbChzb3VyY2UpIHtcbiAgICB0aGlzLnRhcmdldC5iYXNpY3MgPSB0aGlzLnRhcmdldC5iYXNpY3MgfHwge307XG4gICAgdGhpcy5fZXh0ZW5kKHRoaXMudGFyZ2V0LmJhc2ljcywgeydlbWFpbCc6IHNvdXJjZS5hZGRyZXNzfSk7XG4gIH1cblxuICBwcm9jZXNzUG9zaXRpb24oc291cmNlKSB7XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzUG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICAgIGxldCBvYmplY3QgPSB7XG4gICAgICAgIGNvbXBhbnk6IHBvc2l0aW9uLmNvbXBhbnlOYW1lLFxuICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24udGl0bGUgfHwgJycsXG4gICAgICAgIHdlYnNpdGU6ICcnLFxuICAgICAgICBzdGFydERhdGU6IHBvc2l0aW9uLnN0YXJ0RGF0ZS55ZWFyICsgJy0nICsgKHBvc2l0aW9uLnN0YXJ0RGF0ZS5tb250aCA8IDEwID8gJzAnIDogJycpICsgcG9zaXRpb24uc3RhcnREYXRlLm1vbnRoICsgJy0wMScsXG4gICAgICAgIHN1bW1hcnk6IHBvc2l0aW9uLmRlc2NyaXB0aW9uLFxuICAgICAgICBoaWdobGlnaHRzOiBbXVxuICAgICAgfTtcblxuICAgICAgaWYgKHBvc2l0aW9uLmVuZERhdGUpIHtcbiAgICAgICAgb2JqZWN0LmVuZERhdGUgPSBwb3NpdGlvbi5lbmREYXRlLnllYXIgKyAnLScgKyAocG9zaXRpb24uZW5kRGF0ZS5tb250aCA8IDEwID8gJzAnIDogJycpICsgcG9zaXRpb24uZW5kRGF0ZS5tb250aCArICctMDEnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIHRoaXMudGFyZ2V0LndvcmsgPSBzb3VyY2UubWFwKHByb2Nlc3NQb3NpdGlvbik7XG4gIH1cblxuICBwcm9jZXNzRWR1Y2F0aW9uKHNvdXJjZSkge1xuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc0VkdWNhdGlvbihlZHVjYXRpb24pIHtcbiAgICAgIGxldCBvYmplY3QgPSB7XG4gICAgICAgIGluc3RpdHV0aW9uOiBlZHVjYXRpb24uc2Nob29sTmFtZSxcbiAgICAgICAgYXJlYTogJycsXG4gICAgICAgIHN0dWR5VHlwZTogZWR1Y2F0aW9uLmRlZ3JlZSxcbiAgICAgICAgc3RhcnREYXRlOiAnJyArIGVkdWNhdGlvbi5zdGFydERhdGUgKyAnLTAxLTAxJyxcbiAgICAgICAgZ3BhOiAnJyxcbiAgICAgICAgY291cnNlczogW11cbiAgICAgIH07XG5cbiAgICAgIGlmIChlZHVjYXRpb24uZW5kRGF0ZSkge1xuICAgICAgICBvYmplY3QuZW5kRGF0ZSA9IGVkdWNhdGlvbi5lbmREYXRlICsgJy0wMS0wMSc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXQuZWR1Y2F0aW9uID0gc291cmNlLm1hcChwcm9jZXNzRWR1Y2F0aW9uKTtcbiAgfVxuXG4gIHByb2Nlc3NTa2lsbHMoc2tpbGxzKSB7XG5cbiAgICB0aGlzLnRhcmdldC5za2lsbHMgPSBza2lsbHMubWFwKHNraWxsID0+ICh7XG4gICAgICAgIG5hbWU6IHNraWxsLFxuICAgICAgICBsZXZlbDogJycsXG4gICAgICAgIGtleXdvcmRzOiBbXVxuICAgICAgfSkpO1xuICB9XG5cbiAgcHJvY2Vzc0xhbmd1YWdlcyhzb3VyY2UpIHtcblxuICAgIGZ1bmN0aW9uIGNsZWFuUHJvZmljaWVuY3lTdHJpbmcocHJvZmljaWVuY3kpIHtcbiAgICAgIHByb2ZpY2llbmN5ID0gcHJvZmljaWVuY3kudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9fL2csICcgJyk7XG4gICAgICByZXR1cm4gcHJvZmljaWVuY3lbMF0udG9VcHBlckNhc2UoKSArIHByb2ZpY2llbmN5LnN1YnN0cigxKTtcbiAgICB9XG5cbiAgICB0aGlzLnRhcmdldC5sYW5ndWFnZXMgPSBzb3VyY2UubWFwKGxhbmd1YWdlID0+ICh7XG4gICAgICBsYW5ndWFnZTogbGFuZ3VhZ2UubmFtZSxcbiAgICAgIGZsdWVuY3k6IGxhbmd1YWdlLnByb2ZpY2llbmN5ID8gY2xlYW5Qcm9maWNpZW5jeVN0cmluZyhsYW5ndWFnZS5wcm9maWNpZW5jeSkgOiBudWxsXG4gICAgfSkpO1xuICB9XG5cbiAgcHJvY2Vzc1JlZmVyZW5jZXMoc291cmNlKSB7XG5cbiAgICB0aGlzLnRhcmdldC5yZWZlcmVuY2VzID0gc291cmNlLm1hcChyZWZlcmVuY2UgPT4gKHtcbiAgICAgIG5hbWU6IHJlZmVyZW5jZS5yZWNvbW1lbmRlckZpcnN0TmFtZSArICcgJyArIHJlZmVyZW5jZS5yZWNvbW1lbmRlckxhc3ROYW1lLFxuICAgICAgcmVmZXJlbmNlOiByZWZlcmVuY2UucmVjb21tZW5kYXRpb25Cb2R5XG4gICAgfSkpO1xuICB9XG4gIFxuICBwcm9jZXNzSW50ZXJlc3RzKHNvdXJjZSkge1xuXG4gICAgdGhpcy50YXJnZXQuaW50ZXJlc3RzID0gc291cmNlLm1hcChpbnRlcmVzdCA9PiAoe1xuICAgICAgbmFtZTogaW50ZXJlc3QsXG4gICAgICBrZXl3b3JkczogW11cbiAgICB9KSk7XG4gIH1cblxuICBwcm9jZXNzUHJvamVjdHMoc291cmNlKSB7XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzUHJvamVjdHMocHJvamVjdCkge1xuXG4gICAgICAgbGV0IHAgPSB7XG4gICAgICAgICAgbmFtZTogcHJvamVjdC50aXRsZSxcbiAgICAgICAgICBzdGFydERhdGU6IHByb2plY3Quc3RhcnREYXRlLnllYXIgKyAnLScgKyAocHJvamVjdC5zdGFydERhdGUubW9udGggPCAxMCA/ICcwJyA6ICcnKSArIHByb2plY3Quc3RhcnREYXRlLm1vbnRoICsgJy0wMScsXG4gICAgICAgICAgc3VtbWFyeTogcHJvamVjdC5kZXNjcmlwdGlvbixcbiAgICAgICAgICB1cmw6IHByb2plY3QudXJsXG4gICAgICAgIH07XG4gICAgICAgaWYocHJvamVjdC5lbmREYXRlKSB7XG4gICAgICAgICAgcC5lbmREYXRlID0gcHJvamVjdC5lbmREYXRlLnllYXIgKyAnLScgKyAocHJvamVjdC5lbmREYXRlLm1vbnRoIDwgMTAgPyAnMCcgOiAnJykgKyBwcm9qZWN0LmVuZERhdGUubW9udGggKyAnLTAxJztcbiAgICAgICB9XG4gICAgICAgcmV0dXJuIHA7XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXQucHJvamVjdHMgPSBzb3VyY2UubWFwKHByb2Nlc3NQcm9qZWN0cylcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGlua2VkSW5Ub0pzb25SZXN1bWU7XG4iLCIvKiBnbG9iYWwgbW9kdWxlICovXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyByZWY6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEyOTMxNjMvMjM0M1xuICAvLyBUaGlzIHdpbGwgcGFyc2UgYSBkZWxpbWl0ZWQgc3RyaW5nIGludG8gYW4gYXJyYXkgb2ZcbiAgLy8gYXJyYXlzLiBUaGUgZGVmYXVsdCBkZWxpbWl0ZXIgaXMgdGhlIGNvbW1hLCBidXQgdGhpc1xuICAvLyBjYW4gYmUgb3ZlcnJpZGVuIGluIHRoZSBzZWNvbmQgYXJndW1lbnQuXG4gIGZ1bmN0aW9uIENTVlRvQXJyYXkoc3RyRGF0YSwgc3RyRGVsaW1pdGVyKSB7XG4gICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBkZWxpbWl0ZXIgaXMgZGVmaW5lZC4gSWYgbm90LFxuICAgIC8vIHRoZW4gZGVmYXVsdCB0byBjb21tYS5cbiAgICBzdHJEZWxpbWl0ZXIgPSAoc3RyRGVsaW1pdGVyIHx8ICcsJyk7XG5cbiAgICAvLyBDcmVhdGUgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gcGFyc2UgdGhlIENTViB2YWx1ZXMuXG4gICAgdmFyIG9ialBhdHRlcm4gPSBuZXcgUmVnRXhwKFxuICAgICAgICAoXG5cbiAgICAgICAgICAgIC8vIERlbGltaXRlcnMuXG4gICAgICAgICAgICAnKFxcXFwnICsgc3RyRGVsaW1pdGVyICsgJ3xcXFxccj9cXFxcbnxcXFxccnxeKScgK1xuXG4gICAgICAgICAgICAvLyBRdW90ZWQgZmllbGRzLlxuICAgICAgICAgICAgJyg/OlxcXCIoW15cXFwiXSooPzpcXFwiXFxcIlteXFxcIl0qKSopXFxcInwnICtcblxuICAgICAgICAgICAgLy8gU3RhbmRhcmQgZmllbGRzLlxuICAgICAgICAgICAgJyhbXlxcXCJcXFxcJyArIHN0ckRlbGltaXRlciArICdcXFxcclxcXFxuXSopKSdcbiAgICAgICAgKSxcbiAgICAgICAgJ2dpJ1xuICAgICAgICApO1xuXG4gICAgLy8gQ3JlYXRlIGFuIGFycmF5IHRvIGhvbGQgb3VyIGRhdGEuIEdpdmUgdGhlIGFycmF5XG4gICAgLy8gYSBkZWZhdWx0IGVtcHR5IGZpcnN0IHJvdy5cbiAgICB2YXIgYXJyRGF0YSA9IFtbXV07XG5cbiAgICAvLyBDcmVhdGUgYW4gYXJyYXkgdG8gaG9sZCBvdXIgaW5kaXZpZHVhbCBwYXR0ZXJuXG4gICAgLy8gbWF0Y2hpbmcgZ3JvdXBzLlxuICAgIHZhciBhcnJNYXRjaGVzID0gbnVsbDtcblxuICAgIC8vIEtlZXAgbG9vcGluZyBvdmVyIHRoZSByZWd1bGFyIGV4cHJlc3Npb24gbWF0Y2hlc1xuICAgIC8vIHVudGlsIHdlIGNhbiBubyBsb25nZXIgZmluZCBhIG1hdGNoLlxuICAgIGRvIHtcbiAgICAgIGFyck1hdGNoZXMgPSBvYmpQYXR0ZXJuLmV4ZWMoc3RyRGF0YSk7XG4gICAgICBpZiAoIWFyck1hdGNoZXMpIHsgYnJlYWs7IH1cblxuICAgICAgLy8gR2V0IHRoZSBkZWxpbWl0ZXIgdGhhdCB3YXMgZm91bmQuXG4gICAgICB2YXIgc3RyTWF0Y2hlZERlbGltaXRlciA9IGFyck1hdGNoZXNbIDEgXTtcblxuICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBnaXZlbiBkZWxpbWl0ZXIgaGFzIGEgbGVuZ3RoXG4gICAgICAvLyAoaXMgbm90IHRoZSBzdGFydCBvZiBzdHJpbmcpIGFuZCBpZiBpdCBtYXRjaGVzXG4gICAgICAvLyBmaWVsZCBkZWxpbWl0ZXIuIElmIGlkIGRvZXMgbm90LCB0aGVuIHdlIGtub3dcbiAgICAgIC8vIHRoYXQgdGhpcyBkZWxpbWl0ZXIgaXMgYSByb3cgZGVsaW1pdGVyLlxuICAgICAgaWYgKFxuICAgICAgICAgIHN0ck1hdGNoZWREZWxpbWl0ZXIubGVuZ3RoICYmXG4gICAgICAgICAgc3RyTWF0Y2hlZERlbGltaXRlciAhPT0gc3RyRGVsaW1pdGVyXG4gICAgICAgICAgKSB7XG5cbiAgICAgICAgLy8gU2luY2Ugd2UgaGF2ZSByZWFjaGVkIGEgbmV3IHJvdyBvZiBkYXRhLFxuICAgICAgICAvLyBhZGQgYW4gZW1wdHkgcm93IHRvIG91ciBkYXRhIGFycmF5LlxuICAgICAgICBhcnJEYXRhLnB1c2goW10pO1xuXG4gICAgICB9XG5cbiAgICAgIHZhciBzdHJNYXRjaGVkVmFsdWU7XG5cbiAgICAgIC8vIE5vdyB0aGF0IHdlIGhhdmUgb3VyIGRlbGltaXRlciBvdXQgb2YgdGhlIHdheSxcbiAgICAgIC8vIGxldCdzIGNoZWNrIHRvIHNlZSB3aGljaCBraW5kIG9mIHZhbHVlIHdlXG4gICAgICAvLyBjYXB0dXJlZCAocXVvdGVkIG9yIHVucXVvdGVkKS5cbiAgICAgIGlmIChhcnJNYXRjaGVzWyAyIF0pIHtcblxuICAgICAgICAvLyBXZSBmb3VuZCBhIHF1b3RlZCB2YWx1ZS4gV2hlbiB3ZSBjYXB0dXJlXG4gICAgICAgIC8vIHRoaXMgdmFsdWUsIHVuZXNjYXBlIGFueSBkb3VibGUgcXVvdGVzLlxuICAgICAgICBzdHJNYXRjaGVkVmFsdWUgPSBhcnJNYXRjaGVzWyAyIF0ucmVwbGFjZShcbiAgICAgICAgICAgIG5ldyBSZWdFeHAoJ1xcXCJcXFwiJywgJ2cnKSxcbiAgICAgICAgICAgICdcXFwiJ1xuICAgICAgICAgICAgKTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICAvLyBXZSBmb3VuZCBhIG5vbi1xdW90ZWQgdmFsdWUuXG4gICAgICAgIHN0ck1hdGNoZWRWYWx1ZSA9IGFyck1hdGNoZXNbIDMgXTtcblxuICAgICAgfVxuXG4gICAgICAvLyBOb3cgdGhhdCB3ZSBoYXZlIG91ciB2YWx1ZSBzdHJpbmcsIGxldCdzIGFkZFxuICAgICAgLy8gaXQgdG8gdGhlIGRhdGEgYXJyYXkuXG4gICAgICBhcnJEYXRhWyBhcnJEYXRhLmxlbmd0aCAtIDEgXS5wdXNoKHN0ck1hdGNoZWRWYWx1ZSA/IHN0ck1hdGNoZWRWYWx1ZS50cmltKCkgOiBzdHJNYXRjaGVkVmFsdWUpO1xuICAgIH0gd2hpbGUgKHRydWUpO1xuXG4gICAgLy8gUmV0dXJuIHRoZSBwYXJzZWQgZGF0YS5cbiAgICByZXR1cm4gYXJyRGF0YTtcbiAgfVxuXG4gIG1vZHVsZS5leHBvcnRzID0gQ1NWVG9BcnJheTtcbn0pKCk7XG4iLCIvKiBnbG9iYWwgVVJMLCBCbG9iLCBtb2R1bGUgKi9cbi8qIGV4cG9ydGVkIHNhdmUgKi9cbnZhciBzYXZlID0gKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gc2F2ZUFzIGZyb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vTXJTd2l0Y2gvMzU1Mjk4NVxuICB2YXIgc2F2ZUFzID0gd2luZG93LnNhdmVBcyB8fCAod2luZG93Lm5hdmlnYXRvci5tc1NhdmVCbG9iID8gZnVuY3Rpb24oYiwgbikge1xuICAgICAgcmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlQmxvYihiLCBuKTtcbiAgICB9IDogZmFsc2UpIHx8IHdpbmRvdy53ZWJraXRTYXZlQXMgfHwgd2luZG93Lm1velNhdmVBcyB8fCB3aW5kb3cubXNTYXZlQXMgfHwgKGZ1bmN0aW9uKCkge1xuXG4gICAgICAvLyBVUkwnc1xuICAgICAgd2luZG93LlVSTCA9IHdpbmRvdy5VUkwgfHwgd2luZG93LndlYmtpdFVSTDtcblxuICAgICAgaWYgKCF3aW5kb3cuVVJMKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGJsb2IsIG5hbWUpIHtcbiAgICAgICAgdmFyIHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cbiAgICAgICAgLy8gVGVzdCBmb3IgZG93bmxvYWQgbGluayBzdXBwb3J0XG4gICAgICAgIGlmICgnZG93bmxvYWQnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSkge1xuXG4gICAgICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB1cmwpO1xuICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIG5hbWUpO1xuXG4gICAgICAgICAgLy8gQ3JlYXRlIENsaWNrIGV2ZW50XG4gICAgICAgICAgdmFyIGNsaWNrRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnTW91c2VFdmVudCcpO1xuICAgICAgICAgIGNsaWNrRXZlbnQuaW5pdE1vdXNlRXZlbnQoJ2NsaWNrJywgdHJ1ZSwgdHJ1ZSwgd2luZG93LCAwLFxuICAgICAgICAgICAgMCwgMCwgMCwgMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIG51bGwpO1xuXG4gICAgICAgICAgLy8gZGlzcGF0Y2ggY2xpY2sgZXZlbnQgdG8gc2ltdWxhdGUgZG93bmxvYWRcbiAgICAgICAgICBhLmRpc3BhdGNoRXZlbnQoY2xpY2tFdmVudCk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBmYWxsb3Zlciwgb3BlbiByZXNvdXJjZSBpbiBuZXcgdGFiLlxuICAgICAgICAgIHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycsICcnKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KSgpO1xuXG4gIGZ1bmN0aW9uIF9zYXZlKHRleHQsIGZpbGVOYW1lKSB7XG4gICAgdmFyIGJsb2IgPSBuZXcgQmxvYihbdGV4dF0sIHtcbiAgICAgIHR5cGU6ICd0ZXh0L3BsYWluJ1xuICAgIH0pO1xuICAgIHNhdmVBcyhibG9iLCBmaWxlTmFtZSB8fCAnc3VidGl0bGUuc3J0Jyk7XG4gIH1cblxuICByZXR1cm4gX3NhdmU7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2F2ZTtcbiIsIi8qIGdsb2JhbCB6aXAsIGNyZWF0ZVRlbXBGaWxlLCBQcmlzbSAqL1xuXG5pbXBvcnQgTGlua2VkSW5Ub0pzb25SZXN1bWUgZnJvbSAnLi9jb252ZXJ0ZXIuanMnO1xuaW1wb3J0IGNzdlRvQXJyYXkgZnJvbSAnLi9jc3Z0b2FycmF5LmpzJztcbmltcG9ydCBzYXZlIGZyb20gJy4vZmlsZS5qcyc7XG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBsaW5rZWRpblRvSnNvblJlc3VtZSA9IG5ldyBMaW5rZWRJblRvSnNvblJlc3VtZSgpO1xuXG4gIHZhciBkb3dubG9hZEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kb3dubG9hZCcpO1xuICBkb3dubG9hZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIHNhdmUoSlNPTi5zdHJpbmdpZnkobGlua2VkaW5Ub0pzb25SZXN1bWUuZ2V0T3V0cHV0KCksIHVuZGVmaW5lZCwgMiksICdyZXN1bWUuanNvbicpO1xuICB9KTtcbiAgZG93bmxvYWRCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAvLyBmaWxlIHNlbGVjdGlvblxuICBmdW5jdGlvbiBmaWxlU2VsZWN0SGFuZGxlcihlKSB7XG4gICAgLy8gY2FuY2VsIGV2ZW50IGFuZCBob3ZlciBzdHlsaW5nXG4gICAgZmlsZURyYWdIb3ZlcihlKTtcblxuICAgIHZhciBkcm9wcGVkRmlsZXMgPSBlLnRhcmdldC5maWxlcyB8fCBlLmRhdGFUcmFuc2Zlci5maWxlcztcblxuICAgIHZhciBmaWxlID0gZHJvcHBlZEZpbGVzWzBdO1xuICAgIGZpbGVOYW1lID0gZmlsZS5uYW1lO1xuXG4gICAgbW9kZWwuZ2V0RW50cmllcyhmaWxlLCBmdW5jdGlvbihlbnRyaWVzKSB7XG5cbiAgICAgIHZhciBwcm9taXNlcyA9IGVudHJpZXMubWFwKGZ1bmN0aW9uKGVudHJ5KSB7XG5cbiAgICAgICAgLy8gdG9kbzogdXNlIHByb21pc2VzXG4gICAgICAgIHN3aXRjaCAoZW50cnkuZmlsZW5hbWUpIHtcbiAgICAgICAgICBjYXNlICdTa2lsbHMuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICByZWFkQmxvYihibG9iLCBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICAgICAgICAgICAgY29udGVudHMgPSBjb250ZW50cy5yZXBsYWNlKC9cIi9nLCAnJyk7XG4gICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBjb250ZW50cy5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICAgICAgICBlbGVtZW50cyA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtMSk7XG4gICAgICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzU2tpbGxzKGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNhc2UgJ0VkdWNhdGlvbi5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgZW50cnkuZ2V0RGF0YShuZXcgemlwLkJsb2JXcml0ZXIoJ3RleHQvcGxhaW4nKSwgZnVuY3Rpb24oYmxvYikge1xuICAgICAgICAgICAgICAgIHJlYWRCbG9iKGJsb2IsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBjc3ZUb0FycmF5KGNvbnRlbnRzKTtcbiAgICAgICAgICAgICAgICAgIHZhciBlZHVjYXRpb24gPSBlbGVtZW50cy5zbGljZSgxLCBlbGVtZW50cy5sZW5ndGggLSAxKS5tYXAoZnVuY3Rpb24oZWxlbSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgIHNjaG9vbE5hbWU6IGVsZW1bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgc3RhcnREYXRlOiBlbGVtWzFdLFxuICAgICAgICAgICAgICAgICAgICAgIGVuZERhdGU6IGVsZW1bMl0sXG4gICAgICAgICAgICAgICAgICAgICAgbm90ZXM6IGVsZW1bM10sXG4gICAgICAgICAgICAgICAgICAgICAgZGVncmVlOiBlbGVtWzRdLFxuICAgICAgICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IGVsZW1bNV1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc0VkdWNhdGlvbihlZHVjYXRpb24uc29ydCgoZTEsZTIpID0+XG4gICAgICAgICAgICAgICAgICAgICgrZTIuc3RhcnREYXRlLnllYXIgLSArZTEuc3RhcnREYXRlLnllYXIpIHx8ICgrZTIuc3RhcnREYXRlLm1vbnRoIC0gK2UxLnN0YXJ0RGF0ZS5tb250aClcbiAgICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2FzZSAnUG9zaXRpb25zLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMpO1xuICAgICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9ucyA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29tcGFueU5hbWU6IGVsZW1bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGVsZW1bMV0sXG4gICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246IGVsZW1bMl0sXG4gICAgICAgICAgICAgICAgICAgICAgc3RhcnREYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ZWFyOiBlbGVtWzNdLnNwbGl0KCcvJylbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aDogZWxlbVszXS5zcGxpdCgnLycpWzBdXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBlbmREYXRlOiBlbGVtWzRdID8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeWVhcjogZWxlbVs0XS5zcGxpdCgnLycpWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6IGVsZW1bNF0uc3BsaXQoJy8nKVswXVxuICAgICAgICAgICAgICAgICAgICAgIH0gOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBlbGVtWzVdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NQb3NpdGlvbihwb3NpdGlvbnMuc29ydCgocDEscDIpID0+XG4gICAgICAgICAgICAgICAgICAgICgrcDIuc3RhcnREYXRlLnllYXIgLSArcDEuc3RhcnREYXRlLnllYXIpIHx8ICgrcDIuc3RhcnREYXRlLm1vbnRoIC0gK3AxLnN0YXJ0RGF0ZS5tb250aClcbiAgICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2FzZSAnTGFuZ3VhZ2VzLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMpO1xuICAgICAgICAgICAgICAgICAgdmFyIGxhbmd1YWdlcyA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogZWxlbVswXSxcbiAgICAgICAgICAgICAgICAgICAgICBwcm9maWNpZW5jeTogZWxlbVsxXVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzTGFuZ3VhZ2VzKGxhbmd1YWdlcyk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdSZWNvbW1lbmRhdGlvbnMgUmVjZWl2ZWQuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICByZWFkQmxvYihibG9iLCBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cywgJ1xcdCcpOyAvLyB5ZXMsIHJlY29tbWVuZGF0aW9ucyB1c2UgdGFiLWRlbGltaXRlclxuICAgICAgICAgICAgICAgICAgdmFyIHJlY29tbWVuZGF0aW9ucyA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25EYXRlOiBlbGVtWzBdLFxuICAgICAgICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uQm9keTogZWxlbVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICByZWNvbW1lbmRlckZpcnN0TmFtZTogZWxlbVsyXSxcbiAgICAgICAgICAgICAgICAgICAgICByZWNvbW1lbmRlckxhc3ROYW1lOiBlbGVtWzNdLFxuICAgICAgICAgICAgICAgICAgICAgIHJlY29tbWVuZGVyQ29tcGFueTogZWxlbVs0XSxcbiAgICAgICAgICAgICAgICAgICAgICByZWNvbW1lbmRlclRpdGxlOiBlbGVtWzVdLFxuICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlTdGF0dXM6IGVsZW1bNl1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIH0pLmZpbHRlcihmdW5jdGlvbihyZWNvbW1lbmRhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjb21tZW5kYXRpb24uZGlzcGxheVN0YXR1cyA9PT0gJ1Nob3duJztcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc1JlZmVyZW5jZXMocmVjb21tZW5kYXRpb25zKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNhc2UgJ1Byb2ZpbGUuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICByZWFkQmxvYihibG9iLCBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cyk7XG4gICAgICAgICAgICAgICAgICB2YXIgcHJvZmlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3ROYW1lOiBlbGVtZW50c1sxXVswXSxcbiAgICAgICAgICAgICAgICAgICAgbGFzdE5hbWU6IGVsZW1lbnRzWzFdWzFdLFxuICAgICAgICAgICAgICAgICAgICBtYWlkZW5OYW1lOiBlbGVtZW50c1sxXVsyXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZERhdGU6IGVsZW1lbnRzWzFdWzNdLFxuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiBlbGVtZW50c1sxXVs0XSxcbiAgICAgICAgICAgICAgICAgICAgYmlydGhEYXRlOiBlbGVtZW50c1sxXVs1XSxcbiAgICAgICAgICAgICAgICAgICAgY29udGFjdEluc3RydWN0aW9uczogZWxlbWVudHNbMV1bNl0sXG4gICAgICAgICAgICAgICAgICAgIG1hcml0YWxTdGF0dXM6IGVsZW1lbnRzWzFdWzddLFxuICAgICAgICAgICAgICAgICAgICBoZWFkbGluZTogZWxlbWVudHNbMV1bOF0sXG4gICAgICAgICAgICAgICAgICAgIHN1bW1hcnk6IGVsZW1lbnRzWzFdWzldLFxuICAgICAgICAgICAgICAgICAgICBpbmR1c3RyeTogZWxlbWVudHNbMV1bMTBdLFxuICAgICAgICAgICAgICAgICAgICBhc3NvY2lhdGlvbjogZWxlbWVudHNbMV1bMTFdXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc1Byb2ZpbGUocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNhc2UgJ0VtYWlsIEFkZHJlc3Nlcy5jc3YnOlxuICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICAgIHJlYWRCbG9iKGJsb2IsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMsICdcXHQnKTsgLy8geWVzLCByZWNvbW1lbmRhdGlvbnMgdXNlIHRhYi1kZWxpbWl0ZXJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVtYWlsID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkubWFwKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogZWxlbVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZWxlbVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUHJpbWFyeTogZWxlbVsyXSA9PT0gJ1llcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlQWRkZWQ6IGVsZW1bM10sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlUmVtb3ZlZDogZWxlbVs0XVxuICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0pLmZpbHRlcihlbWFpbCA9PiBlbWFpbC5pc1ByaW1hcnkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW1haWwubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc0VtYWlsKGVtYWlsWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdJbnRlcmVzdHMuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICByZWFkQmxvYihibG9iLCBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cyk7XG4gICAgICAgICAgICAgICAgICB2YXIgaW50ZXJlc3RzID0gW107XG4gICAgICAgICAgICAgICAgICBlbGVtZW50cy5zbGljZSgxLCBlbGVtZW50cy5sZW5ndGggLSAxKS5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICBcdCBpbnRlcmVzdHMuY29uY2F0KGVsZW1bMF0uc3BsaXQoJywnKSk7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NJbnRlcmVzdHMoaW50ZXJlc3RzKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNhc2UgJ1Byb2plY3RzLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMpO1xuICAgICAgICAgICAgICAgICAgdmFyIHByb2plY3RzID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkubWFwKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogZWxlbVswXSxcbiAgICAgICAgICAgICAgICAgICAgICBzdGFydERhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHllYXI6IGVsZW1bMV0uc3BsaXQoJy8nKVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoOiBlbGVtWzFdLnNwbGl0KCcvJylbMF1cbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIGVuZERhdGU6IGVsZW1bMl0gPyB7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ZWFyOiBlbGVtWzJdLnNwbGl0KCcvJylbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aDogZWxlbVsyXS5zcGxpdCgnLycpWzBdXG4gICAgICAgICAgICAgICAgICAgICAgfSA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGVsZW1bM10sXG4gICAgICAgICAgICAgICAgICAgICAgdXJsOiBlbGVtWzRdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NQcm9qZWN0cyhwcm9qZWN0cy5zb3J0KChwMSxwMikgPT5cbiAgICAgICAgICAgICAgICAgICAgKCtwMi5zdGFydERhdGUueWVhciAtICtwMS5zdGFydERhdGUueWVhcikgfHwgKCtwMi5zdGFydERhdGUubW9udGggLSArcDEuc3RhcnREYXRlLm1vbnRoKVxuICAgICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgZmlsZWRyYWcuaW5uZXJIVE1MID0gJ0Ryb3BwZWQhIFNlZSB0aGUgcmVzdWx0aW5nIEpTT04gUmVzdW1lIGF0IHRoZSBib3R0b20uJztcbiAgICAgICAgdmFyIG91dHB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdXRwdXQnKTtcbiAgICAgICAgb3V0cHV0LmlubmVySFRNTCA9IEpTT04uc3RyaW5naWZ5KGxpbmtlZGluVG9Kc29uUmVzdW1lLmdldE91dHB1dCgpLCB1bmRlZmluZWQsIDIpO1xuICAgICAgICBQcmlzbS5oaWdobGlnaHRFbGVtZW50KG91dHB1dCk7XG4gICAgICAgIGRvd25sb2FkQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0Jykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBmaWxlZHJhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlZHJhZycpLFxuICAgICAgZmlsZXNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlc2VsZWN0JyksXG4gICAgICBmaWxlTmFtZSA9IG51bGw7XG4gIC8vIGZpbGUgc2VsZWN0XG4gIGZpbGVzZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZmlsZVNlbGVjdEhhbmRsZXIsIGZhbHNlKTtcblxuICAvLyBmaWxlIGRyYWcgaG92ZXJcbiAgZnVuY3Rpb24gZmlsZURyYWdIb3ZlcihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS50YXJnZXQuY2xhc3NOYW1lID0gKGUudHlwZSA9PT0gJ2RyYWdvdmVyJyA/ICdob3ZlcicgOiAnJyk7XG4gIH1cblxuICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIGlmICh4aHIudXBsb2FkKSB7XG4gICAgLy8gZmlsZSBkcm9wXG4gICAgZmlsZWRyYWcuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBmaWxlRHJhZ0hvdmVyLCBmYWxzZSk7XG4gICAgZmlsZWRyYWcuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgZmlsZURyYWdIb3ZlciwgZmFsc2UpO1xuICAgIGZpbGVkcmFnLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBmaWxlU2VsZWN0SGFuZGxlciwgZmFsc2UpO1xuICAgIGZpbGVkcmFnLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICB9IGVsc2Uge1xuICAgIGZpbGVkcmFnLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH1cblxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0LWZpbGUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBmaWxlc2VsZWN0LmNsaWNrKCk7XG4gIH0pO1xuXG4gIHZhciBtb2RlbCA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgVVJMID0gd2luZG93LndlYmtpdFVSTCB8fCB3aW5kb3cubW96VVJMIHx8IHdpbmRvdy5VUkw7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0RW50cmllcyA6IGZ1bmN0aW9uKGZpbGUsIG9uZW5kKSB7XG4gICAgICAgIHppcC5jcmVhdGVSZWFkZXIobmV3IHppcC5CbG9iUmVhZGVyKGZpbGUpLCBmdW5jdGlvbih6aXBSZWFkZXIpIHtcbiAgICAgICAgICB6aXBSZWFkZXIuZ2V0RW50cmllcyhvbmVuZCk7XG4gICAgICAgIH0sIG9uZXJyb3IpO1xuICAgICAgfSxcbiAgICAgIGdldEVudHJ5RmlsZSA6IGZ1bmN0aW9uKGVudHJ5LCBjcmVhdGlvbk1ldGhvZCwgb25lbmQsIG9ucHJvZ3Jlc3MpIHtcbiAgICAgICAgdmFyIHdyaXRlciwgemlwRmlsZUVudHJ5O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldERhdGEoKSB7XG4gICAgICAgICAgZW50cnkuZ2V0RGF0YSh3cml0ZXIsIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgIHZhciBibG9iVVJMID0gY3JlYXRpb25NZXRob2QgPT09ICdCbG9iJyA/IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYikgOiB6aXBGaWxlRW50cnkudG9VUkwoKTtcbiAgICAgICAgICAgIG9uZW5kKGJsb2JVUkwpO1xuICAgICAgICAgIH0sIG9ucHJvZ3Jlc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNyZWF0aW9uTWV0aG9kID09PSAnQmxvYicpIHtcbiAgICAgICAgICB3cml0ZXIgPSBuZXcgemlwLkJsb2JXcml0ZXIoKTtcbiAgICAgICAgICBnZXREYXRhKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3JlYXRlVGVtcEZpbGUoZnVuY3Rpb24oZmlsZUVudHJ5KSB7XG4gICAgICAgICAgICB6aXBGaWxlRW50cnkgPSBmaWxlRW50cnk7XG4gICAgICAgICAgICB3cml0ZXIgPSBuZXcgemlwLkZpbGVXcml0ZXIoemlwRmlsZUVudHJ5KTtcbiAgICAgICAgICAgIGdldERhdGEoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH0pKCk7XG5cbiAgemlwLndvcmtlclNjcmlwdHNQYXRoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgJ3ZlbmRvci8nO1xuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iKGJsb2IsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGNhbGxiYWNrKGUudGFyZ2V0LnJlc3VsdCk7XG4gICAgfTtcbiAgICByZWFkZXIucmVhZEFzVGV4dChibG9iKTtcbiAgfVxuXG59KSgpO1xuIl19
