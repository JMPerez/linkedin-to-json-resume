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
      var propertyOrder = ['basics', 'work', 'volunteer', 'education', 'awards', 'publications', 'skills', 'languages', 'interests', 'references'];

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
          fluency: cleanProficiencyString(language.proficiency)
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
    '(?:"([^"]*(?:""[^"]*)*)"|' +

    // Standard fields.
    '([^"\\' + strDelimiter + '\\r\\n]*))', 'gi');

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
        strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam1wZXJlei9naXRodWIvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvY29udmVydGVyLmpzIiwiL1VzZXJzL2ptcGVyZXovZ2l0aHViL2xpbmtlZGluLXRvLWpzb24tcmVzdW1lL2pzL2NzdnRvYXJyYXkuanMiLCIvVXNlcnMvam1wZXJlei9naXRodWIvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvZmlsZS5qcyIsIi9Vc2Vycy9qbXBlcmV6L2dpdGh1Yi9saW5rZWRpbi10by1qc29uLXJlc3VtZS9qcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0lNLG9CQUFvQjtBQUNiLFdBRFAsb0JBQW9CLEdBQ1Y7MEJBRFYsb0JBQW9COztBQUV0QixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztHQUNsQjs7ZUFIRyxvQkFBb0I7O1dBS2YscUJBQUc7O0FBRVYsVUFBSSxhQUFhLEdBQUcsQ0FDbEIsUUFBUSxFQUNSLE1BQU0sRUFDTixXQUFXLEVBQ1gsV0FBVyxFQUNYLFFBQVEsRUFDUixjQUFjLEVBQ2QsUUFBUSxFQUNSLFdBQVcsRUFDWCxXQUFXLEVBQ1gsWUFBWSxDQUNiLENBQUM7O0FBRUYsVUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFDdEIsNkJBQWMsYUFBYSw4SEFBRTtjQUFwQixDQUFDOztBQUNSLGNBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDcEIsd0JBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1dBQ2xDO1NBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDRCxhQUFPLFlBQVksQ0FBQztLQUNyQjs7O1dBRU0saUJBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtBQUN0QixZQUFNLEdBQUcs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QUFDTCx3QkFBYyxDQUFDLFVBQVMsU0FBUyxFQUFFO0FBQ2pDLHdCQUFZLEdBQUcsU0FBUyxDQUFDO0FBQ3pCLGtCQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzFDLG1CQUFPLEVBQUUsQ0FBQztXQUNYLENBQUMsQ0FBQztTQUNKO09BQ0Y7S0FDRixDQUFDO0dBQ0gsQ0FBQSxFQUFHLENBQUM7O0FBRUwsS0FBRyxDQUFDLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQzs7QUFFN0QsV0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUNoQyxRQUFJLE1BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0FBQzlCLFVBQU0sQ0FBQyxNQUFNLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDMUIsY0FBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDM0IsQ0FBQztBQUNGLFVBQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDekI7Q0FFRixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgbW9kdWxlICovXG4vKiBleHBvcnRlZCBvbkxpbmtlZEluTG9hZCAqL1xuXG4vLyB0b2RvOiBpbXBvcnQgcHVibGljYXRpb25zLCBhd2FyZHMsIHZvbHVudGVlclxuY2xhc3MgTGlua2VkSW5Ub0pzb25SZXN1bWUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnRhcmdldCA9IHt9O1xuICB9XG5cbiAgZ2V0T3V0cHV0KCkge1xuICAgIC8vIHNvcnQgdGhlIG9iamVjdFxuICAgIHZhciBwcm9wZXJ0eU9yZGVyID0gW1xuICAgICAgJ2Jhc2ljcycsXG4gICAgICAnd29yaycsXG4gICAgICAndm9sdW50ZWVyJyxcbiAgICAgICdlZHVjYXRpb24nLFxuICAgICAgJ2F3YXJkcycsXG4gICAgICAncHVibGljYXRpb25zJyxcbiAgICAgICdza2lsbHMnLFxuICAgICAgJ2xhbmd1YWdlcycsXG4gICAgICAnaW50ZXJlc3RzJyxcbiAgICAgICdyZWZlcmVuY2VzJ1xuICAgIF07XG5cbiAgICB2YXIgc29ydGVkVGFyZ2V0ID0ge307XG4gICAgZm9yICh2YXIgcCBvZiBwcm9wZXJ0eU9yZGVyKSB7XG4gICAgICBpZiAocCBpbiB0aGlzLnRhcmdldCkge1xuICAgICAgICBzb3J0ZWRUYXJnZXRbcF0gPSB0aGlzLnRhcmdldFtwXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNvcnRlZFRhcmdldDtcbiAgfVxuXG4gIF9leHRlbmQodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICB0YXJnZXQgPSB0YXJnZXQgfHwge307XG4gICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGtleSA9PiB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldKTtcbiAgfVxuXG4gIHByb2Nlc3NQcm9maWxlKHNvdXJjZSkge1xuICAgIHRoaXMudGFyZ2V0LmJhc2ljcyA9IHRoaXMudGFyZ2V0LmJhc2ljcyB8fCB7fTtcbiAgICB0aGlzLl9leHRlbmQodGhpcy50YXJnZXQuYmFzaWNzLCB7XG4gICAgICBuYW1lOiBzb3VyY2UuZmlyc3ROYW1lICsgJyAnICsgc291cmNlLmxhc3ROYW1lLFxuICAgICAgbGFiZWw6IHNvdXJjZS5oZWFkbGluZSxcbiAgICAgIHBpY3R1cmU6IHNvdXJjZS5waWN0dXJlVXJsLFxuICAgICAgcGhvbmU6IHNvdXJjZS5waG9uZU51bWJlcnMgJiYgc291cmNlLnBob25lTnVtYmVycy5fdG90YWwgPyBzb3VyY2UucGhvbmVOdW1iZXJzLnZhbHVlc1swXS5waG9uZU51bWJlciA6ICcnLFxuICAgICAgd2Vic2l0ZTogJycsXG4gICAgICBzdW1tYXJ5OiBzb3VyY2Uuc3VtbWFyeSxcbiAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIGFkZHJlc3M6IHNvdXJjZS5hZGRyZXNzLFxuICAgICAgICBwb3N0YWxDb2RlOiAnJyxcbiAgICAgICAgY2l0eTogc291cmNlLmxvY2F0aW9uID8gc291cmNlLmxvY2F0aW9uLm5hbWUgOiAnJyxcbiAgICAgICAgY291bnRyeUNvZGU6IHNvdXJjZS5sb2NhdGlvbiA/IHNvdXJjZS5sb2NhdGlvbi5jb3VudHJ5LmNvZGUudG9VcHBlckNhc2UoKSA6ICcnLFxuICAgICAgICByZWdpb246ICcnXG4gICAgICB9LFxuICAgICAgcHJvZmlsZXM6IFtdXG4gICAgfSk7XG4gIH1cblxuICBwcm9jZXNzRW1haWwoc291cmNlKSB7XG4gICAgdGhpcy50YXJnZXQuYmFzaWNzID0gdGhpcy50YXJnZXQuYmFzaWNzIHx8IHt9O1xuICAgIHRoaXMuX2V4dGVuZCh0aGlzLnRhcmdldC5iYXNpY3MsIHsnZW1haWwnOiBzb3VyY2UuYWRkcmVzc30pO1xuICB9XG5cbiAgcHJvY2Vzc1Bvc2l0aW9uKHNvdXJjZSkge1xuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc1Bvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgICBsZXQgb2JqZWN0ID0ge1xuICAgICAgICBjb21wYW55OiBwb3NpdGlvbi5jb21wYW55TmFtZSxcbiAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLnRpdGxlIHx8ICcnLFxuICAgICAgICB3ZWJzaXRlOiAnJyxcbiAgICAgICAgc3RhcnREYXRlOiBwb3NpdGlvbi5zdGFydERhdGUueWVhciArICctJyArIChwb3NpdGlvbi5zdGFydERhdGUubW9udGggPCAxMCA/ICcwJyA6ICcnKSArIHBvc2l0aW9uLnN0YXJ0RGF0ZS5tb250aCArICctMDEnLFxuICAgICAgICBzdW1tYXJ5OiBwb3NpdGlvbi5kZXNjcmlwdGlvbixcbiAgICAgICAgaGlnaGxpZ2h0czogW11cbiAgICAgIH07XG5cbiAgICAgIGlmIChwb3NpdGlvbi5lbmREYXRlKSB7XG4gICAgICAgIG9iamVjdC5lbmREYXRlID0gcG9zaXRpb24uZW5kRGF0ZS55ZWFyICsgJy0nICsgKHBvc2l0aW9uLmVuZERhdGUubW9udGggPCAxMCA/ICcwJyA6ICcnKSArIHBvc2l0aW9uLmVuZERhdGUubW9udGggKyAnLTAxJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICB0aGlzLnRhcmdldC53b3JrID0gc291cmNlLm1hcChwcm9jZXNzUG9zaXRpb24pO1xuICB9XG5cbiAgcHJvY2Vzc0VkdWNhdGlvbihzb3VyY2UpIHtcblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NFZHVjYXRpb24oZWR1Y2F0aW9uKSB7XG4gICAgICBsZXQgb2JqZWN0ID0ge1xuICAgICAgICBpbnN0aXR1dGlvbjogZWR1Y2F0aW9uLnNjaG9vbE5hbWUsXG4gICAgICAgIGFyZWE6ICcnLFxuICAgICAgICBzdHVkeVR5cGU6IGVkdWNhdGlvbi5kZWdyZWUsXG4gICAgICAgIHN0YXJ0RGF0ZTogJycgKyBlZHVjYXRpb24uc3RhcnREYXRlICsgJy0wMS0wMScsXG4gICAgICAgIGdwYTogJycsXG4gICAgICAgIGNvdXJzZXM6IFtdXG4gICAgICB9O1xuXG4gICAgICBpZiAoZWR1Y2F0aW9uLmVuZERhdGUpIHtcbiAgICAgICAgb2JqZWN0LmVuZERhdGUgPSBlZHVjYXRpb24uZW5kRGF0ZSArICctMDEtMDEnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIHRoaXMudGFyZ2V0LmVkdWNhdGlvbiA9IHNvdXJjZS5tYXAocHJvY2Vzc0VkdWNhdGlvbik7XG4gIH1cblxuICBwcm9jZXNzU2tpbGxzKHNraWxscykge1xuXG4gICAgdGhpcy50YXJnZXQuc2tpbGxzID0gc2tpbGxzLm1hcChza2lsbCA9PiAoe1xuICAgICAgICBuYW1lOiBza2lsbCxcbiAgICAgICAgbGV2ZWw6ICcnLFxuICAgICAgICBrZXl3b3JkczogW11cbiAgICAgIH0pKTtcbiAgfVxuXG4gIHByb2Nlc3NMYW5ndWFnZXMoc291cmNlKSB7XG5cbiAgICBmdW5jdGlvbiBjbGVhblByb2ZpY2llbmN5U3RyaW5nKHByb2ZpY2llbmN5KSB7XG4gICAgICBwcm9maWNpZW5jeSA9IHByb2ZpY2llbmN5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXy9nLCAnICcpO1xuICAgICAgcmV0dXJuIHByb2ZpY2llbmN5WzBdLnRvVXBwZXJDYXNlKCkgKyBwcm9maWNpZW5jeS5zdWJzdHIoMSk7XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXQubGFuZ3VhZ2VzID0gc291cmNlLm1hcChsYW5ndWFnZSA9PiAoe1xuICAgICAgbGFuZ3VhZ2U6IGxhbmd1YWdlLm5hbWUsXG4gICAgICBmbHVlbmN5OiBjbGVhblByb2ZpY2llbmN5U3RyaW5nKGxhbmd1YWdlLnByb2ZpY2llbmN5KVxuICAgIH0pKTtcbiAgfVxuXG4gIHByb2Nlc3NSZWZlcmVuY2VzKHNvdXJjZSkge1xuXG4gICAgdGhpcy50YXJnZXQucmVmZXJlbmNlcyA9IHNvdXJjZS5tYXAocmVmZXJlbmNlID0+ICh7XG4gICAgICBuYW1lOiByZWZlcmVuY2UucmVjb21tZW5kZXJGaXJzdE5hbWUgKyAnICcgKyByZWZlcmVuY2UucmVjb21tZW5kZXJMYXN0TmFtZSxcbiAgICAgIHJlZmVyZW5jZTogcmVmZXJlbmNlLnJlY29tbWVuZGF0aW9uQm9keVxuICAgIH0pKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmtlZEluVG9Kc29uUmVzdW1lO1xuIiwiLyogZ2xvYmFsIG1vZHVsZSAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gcmVmOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMjkzMTYzLzIzNDNcbiAgLy8gVGhpcyB3aWxsIHBhcnNlIGEgZGVsaW1pdGVkIHN0cmluZyBpbnRvIGFuIGFycmF5IG9mXG4gIC8vIGFycmF5cy4gVGhlIGRlZmF1bHQgZGVsaW1pdGVyIGlzIHRoZSBjb21tYSwgYnV0IHRoaXNcbiAgLy8gY2FuIGJlIG92ZXJyaWRlbiBpbiB0aGUgc2Vjb25kIGFyZ3VtZW50LlxuICBmdW5jdGlvbiBDU1ZUb0FycmF5KHN0ckRhdGEsIHN0ckRlbGltaXRlcikge1xuICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZGVsaW1pdGVyIGlzIGRlZmluZWQuIElmIG5vdCxcbiAgICAvLyB0aGVuIGRlZmF1bHQgdG8gY29tbWEuXG4gICAgc3RyRGVsaW1pdGVyID0gKHN0ckRlbGltaXRlciB8fCAnLCcpO1xuXG4gICAgLy8gQ3JlYXRlIGEgcmVndWxhciBleHByZXNzaW9uIHRvIHBhcnNlIHRoZSBDU1YgdmFsdWVzLlxuICAgIHZhciBvYmpQYXR0ZXJuID0gbmV3IFJlZ0V4cChcbiAgICAgICAgKFxuXG4gICAgICAgICAgICAvLyBEZWxpbWl0ZXJzLlxuICAgICAgICAgICAgJyhcXFxcJyArIHN0ckRlbGltaXRlciArICd8XFxcXHI/XFxcXG58XFxcXHJ8XiknICtcblxuICAgICAgICAgICAgLy8gUXVvdGVkIGZpZWxkcy5cbiAgICAgICAgICAgICcoPzpcXFwiKFteXFxcIl0qKD86XFxcIlxcXCJbXlxcXCJdKikqKVxcXCJ8JyArXG5cbiAgICAgICAgICAgIC8vIFN0YW5kYXJkIGZpZWxkcy5cbiAgICAgICAgICAgICcoW15cXFwiXFxcXCcgKyBzdHJEZWxpbWl0ZXIgKyAnXFxcXHJcXFxcbl0qKSknXG4gICAgICAgICksXG4gICAgICAgICdnaSdcbiAgICAgICAgKTtcblxuICAgIC8vIENyZWF0ZSBhbiBhcnJheSB0byBob2xkIG91ciBkYXRhLiBHaXZlIHRoZSBhcnJheVxuICAgIC8vIGEgZGVmYXVsdCBlbXB0eSBmaXJzdCByb3cuXG4gICAgdmFyIGFyckRhdGEgPSBbW11dO1xuXG4gICAgLy8gQ3JlYXRlIGFuIGFycmF5IHRvIGhvbGQgb3VyIGluZGl2aWR1YWwgcGF0dGVyblxuICAgIC8vIG1hdGNoaW5nIGdyb3Vwcy5cbiAgICB2YXIgYXJyTWF0Y2hlcyA9IG51bGw7XG5cbiAgICAvLyBLZWVwIGxvb3Bpbmcgb3ZlciB0aGUgcmVndWxhciBleHByZXNzaW9uIG1hdGNoZXNcbiAgICAvLyB1bnRpbCB3ZSBjYW4gbm8gbG9uZ2VyIGZpbmQgYSBtYXRjaC5cbiAgICBkbyB7XG4gICAgICBhcnJNYXRjaGVzID0gb2JqUGF0dGVybi5leGVjKHN0ckRhdGEpO1xuICAgICAgaWYgKCFhcnJNYXRjaGVzKSB7IGJyZWFrOyB9XG5cbiAgICAgIC8vIEdldCB0aGUgZGVsaW1pdGVyIHRoYXQgd2FzIGZvdW5kLlxuICAgICAgdmFyIHN0ck1hdGNoZWREZWxpbWl0ZXIgPSBhcnJNYXRjaGVzWyAxIF07XG5cbiAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZ2l2ZW4gZGVsaW1pdGVyIGhhcyBhIGxlbmd0aFxuICAgICAgLy8gKGlzIG5vdCB0aGUgc3RhcnQgb2Ygc3RyaW5nKSBhbmQgaWYgaXQgbWF0Y2hlc1xuICAgICAgLy8gZmllbGQgZGVsaW1pdGVyLiBJZiBpZCBkb2VzIG5vdCwgdGhlbiB3ZSBrbm93XG4gICAgICAvLyB0aGF0IHRoaXMgZGVsaW1pdGVyIGlzIGEgcm93IGRlbGltaXRlci5cbiAgICAgIGlmIChcbiAgICAgICAgICBzdHJNYXRjaGVkRGVsaW1pdGVyLmxlbmd0aCAmJlxuICAgICAgICAgIHN0ck1hdGNoZWREZWxpbWl0ZXIgIT09IHN0ckRlbGltaXRlclxuICAgICAgICAgICkge1xuXG4gICAgICAgIC8vIFNpbmNlIHdlIGhhdmUgcmVhY2hlZCBhIG5ldyByb3cgb2YgZGF0YSxcbiAgICAgICAgLy8gYWRkIGFuIGVtcHR5IHJvdyB0byBvdXIgZGF0YSBhcnJheS5cbiAgICAgICAgYXJyRGF0YS5wdXNoKFtdKTtcblxuICAgICAgfVxuXG4gICAgICB2YXIgc3RyTWF0Y2hlZFZhbHVlO1xuXG4gICAgICAvLyBOb3cgdGhhdCB3ZSBoYXZlIG91ciBkZWxpbWl0ZXIgb3V0IG9mIHRoZSB3YXksXG4gICAgICAvLyBsZXQncyBjaGVjayB0byBzZWUgd2hpY2gga2luZCBvZiB2YWx1ZSB3ZVxuICAgICAgLy8gY2FwdHVyZWQgKHF1b3RlZCBvciB1bnF1b3RlZCkuXG4gICAgICBpZiAoYXJyTWF0Y2hlc1sgMiBdKSB7XG5cbiAgICAgICAgLy8gV2UgZm91bmQgYSBxdW90ZWQgdmFsdWUuIFdoZW4gd2UgY2FwdHVyZVxuICAgICAgICAvLyB0aGlzIHZhbHVlLCB1bmVzY2FwZSBhbnkgZG91YmxlIHF1b3Rlcy5cbiAgICAgICAgc3RyTWF0Y2hlZFZhbHVlID0gYXJyTWF0Y2hlc1sgMiBdLnJlcGxhY2UoXG4gICAgICAgICAgICBuZXcgUmVnRXhwKCdcXFwiXFxcIicsICdnJyksXG4gICAgICAgICAgICAnXFxcIidcbiAgICAgICAgICAgICk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgLy8gV2UgZm91bmQgYSBub24tcXVvdGVkIHZhbHVlLlxuICAgICAgICBzdHJNYXRjaGVkVmFsdWUgPSBhcnJNYXRjaGVzWyAzIF07XG5cbiAgICAgIH1cblxuICAgICAgLy8gTm93IHRoYXQgd2UgaGF2ZSBvdXIgdmFsdWUgc3RyaW5nLCBsZXQncyBhZGRcbiAgICAgIC8vIGl0IHRvIHRoZSBkYXRhIGFycmF5LlxuICAgICAgYXJyRGF0YVsgYXJyRGF0YS5sZW5ndGggLSAxIF0ucHVzaChzdHJNYXRjaGVkVmFsdWUgPyBzdHJNYXRjaGVkVmFsdWUudHJpbSgpIDogc3RyTWF0Y2hlZFZhbHVlKTtcbiAgICB9IHdoaWxlICh0cnVlKTtcblxuICAgIC8vIFJldHVybiB0aGUgcGFyc2VkIGRhdGEuXG4gICAgcmV0dXJuIGFyckRhdGE7XG4gIH1cblxuICBtb2R1bGUuZXhwb3J0cyA9IENTVlRvQXJyYXk7XG59KSgpO1xuIiwiLyogZ2xvYmFsIFVSTCwgQmxvYiwgbW9kdWxlICovXG4vKiBleHBvcnRlZCBzYXZlICovXG52YXIgc2F2ZSA9IChmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIHNhdmVBcyBmcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL01yU3dpdGNoLzM1NTI5ODVcbiAgdmFyIHNhdmVBcyA9IHdpbmRvdy5zYXZlQXMgfHwgKHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlQmxvYiA/IGZ1bmN0aW9uKGIsIG4pIHtcbiAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZUJsb2IoYiwgbik7XG4gICAgfSA6IGZhbHNlKSB8fCB3aW5kb3cud2Via2l0U2F2ZUFzIHx8IHdpbmRvdy5tb3pTYXZlQXMgfHwgd2luZG93Lm1zU2F2ZUFzIHx8IChmdW5jdGlvbigpIHtcblxuICAgICAgLy8gVVJMJ3NcbiAgICAgIHdpbmRvdy5VUkwgPSB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkw7XG5cbiAgICAgIGlmICghd2luZG93LlVSTCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbihibG9iLCBuYW1lKSB7XG4gICAgICAgIHZhciB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG4gICAgICAgIC8vIFRlc3QgZm9yIGRvd25sb2FkIGxpbmsgc3VwcG9ydFxuICAgICAgICBpZiAoJ2Rvd25sb2FkJyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJykpIHtcblxuICAgICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdocmVmJywgdXJsKTtcbiAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBuYW1lKTtcblxuICAgICAgICAgIC8vIENyZWF0ZSBDbGljayBldmVudFxuICAgICAgICAgIHZhciBjbGlja0V2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ01vdXNlRXZlbnQnKTtcbiAgICAgICAgICBjbGlja0V2ZW50LmluaXRNb3VzZUV2ZW50KCdjbGljaycsIHRydWUsIHRydWUsIHdpbmRvdywgMCxcbiAgICAgICAgICAgIDAsIDAsIDAsIDAsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCAwLCBudWxsKTtcblxuICAgICAgICAgIC8vIGRpc3BhdGNoIGNsaWNrIGV2ZW50IHRvIHNpbXVsYXRlIGRvd25sb2FkXG4gICAgICAgICAgYS5kaXNwYXRjaEV2ZW50KGNsaWNrRXZlbnQpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZmFsbG92ZXIsIG9wZW4gcmVzb3VyY2UgaW4gbmV3IHRhYi5cbiAgICAgICAgICB3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnLCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkoKTtcblxuICBmdW5jdGlvbiBfc2F2ZSh0ZXh0LCBmaWxlTmFtZSkge1xuICAgIHZhciBibG9iID0gbmV3IEJsb2IoW3RleHRdLCB7XG4gICAgICB0eXBlOiAndGV4dC9wbGFpbidcbiAgICB9KTtcbiAgICBzYXZlQXMoYmxvYiwgZmlsZU5hbWUgfHwgJ3N1YnRpdGxlLnNydCcpO1xuICB9XG5cbiAgcmV0dXJuIF9zYXZlO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNhdmU7XG4iLCIvKiBnbG9iYWwgemlwLCBjcmVhdGVUZW1wRmlsZSwgUHJpc20gKi9cblxuaW1wb3J0IExpbmtlZEluVG9Kc29uUmVzdW1lIGZyb20gJy4vY29udmVydGVyLmpzJztcbmltcG9ydCBjc3ZUb0FycmF5IGZyb20gJy4vY3N2dG9hcnJheS5qcyc7XG5pbXBvcnQgc2F2ZSBmcm9tICcuL2ZpbGUuanMnO1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgbGlua2VkaW5Ub0pzb25SZXN1bWUgPSBuZXcgTGlua2VkSW5Ub0pzb25SZXN1bWUoKTtcblxuICB2YXIgZG93bmxvYWRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZG93bmxvYWQnKTtcbiAgZG93bmxvYWRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBzYXZlKEpTT04uc3RyaW5naWZ5KGxpbmtlZGluVG9Kc29uUmVzdW1lLmdldE91dHB1dCgpLCB1bmRlZmluZWQsIDIpLCAncmVzdW1lLmpzb24nKTtcbiAgfSk7XG4gIGRvd25sb2FkQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgLy8gZmlsZSBzZWxlY3Rpb25cbiAgZnVuY3Rpb24gZmlsZVNlbGVjdEhhbmRsZXIoZSkge1xuICAgIC8vIGNhbmNlbCBldmVudCBhbmQgaG92ZXIgc3R5bGluZ1xuICAgIGZpbGVEcmFnSG92ZXIoZSk7XG5cbiAgICB2YXIgZHJvcHBlZEZpbGVzID0gZS50YXJnZXQuZmlsZXMgfHwgZS5kYXRhVHJhbnNmZXIuZmlsZXM7XG5cbiAgICB2YXIgZmlsZSA9IGRyb3BwZWRGaWxlc1swXTtcbiAgICBmaWxlTmFtZSA9IGZpbGUubmFtZTtcblxuICAgIG1vZGVsLmdldEVudHJpZXMoZmlsZSwgZnVuY3Rpb24oZW50cmllcykge1xuXG4gICAgICB2YXIgcHJvbWlzZXMgPSBlbnRyaWVzLm1hcChmdW5jdGlvbihlbnRyeSkge1xuXG4gICAgICAgIC8vIHRvZG86IHVzZSBwcm9taXNlc1xuICAgICAgICBzd2l0Y2ggKGVudHJ5LmZpbGVuYW1lKSB7XG4gICAgICAgICAgY2FzZSAnU2tpbGxzLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnRlbnRzID0gY29udGVudHMucmVwbGFjZSgvXCIvZywgJycpO1xuICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY29udGVudHMuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgICAgICAgZWxlbWVudHMgPSBlbGVtZW50cy5zbGljZSgxLCBlbGVtZW50cy5sZW5ndGggLTEpO1xuICAgICAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc1NraWxscyhlbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdFZHVjYXRpb24uY3N2JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICByZWFkQmxvYihibG9iLCBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cyk7XG4gICAgICAgICAgICAgICAgICB2YXIgZWR1Y2F0aW9uID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkubWFwKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICBzY2hvb2xOYW1lOiBlbGVtWzBdLFxuICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0RGF0ZTogZWxlbVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICBlbmREYXRlOiBlbGVtWzJdLFxuICAgICAgICAgICAgICAgICAgICAgIG5vdGVzOiBlbGVtWzNdLFxuICAgICAgICAgICAgICAgICAgICAgIGRlZ3JlZTogZWxlbVs0XSxcbiAgICAgICAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBlbGVtWzVdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NFZHVjYXRpb24oZWR1Y2F0aW9uLnNvcnQoKGUxLGUyKSA9PlxuICAgICAgICAgICAgICAgICAgICAoK2UyLnN0YXJ0RGF0ZS55ZWFyIC0gK2UxLnN0YXJ0RGF0ZS55ZWFyKSB8fCAoK2UyLnN0YXJ0RGF0ZS5tb250aCAtICtlMS5zdGFydERhdGUubW9udGgpXG4gICAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNhc2UgJ1Bvc2l0aW9ucy5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgZW50cnkuZ2V0RGF0YShuZXcgemlwLkJsb2JXcml0ZXIoJ3RleHQvcGxhaW4nKSwgZnVuY3Rpb24oYmxvYikge1xuICAgICAgICAgICAgICAgIHJlYWRCbG9iKGJsb2IsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBjc3ZUb0FycmF5KGNvbnRlbnRzKTtcbiAgICAgICAgICAgICAgICAgIHZhciBwb3NpdGlvbnMgPSBlbGVtZW50cy5zbGljZSgxLCBlbGVtZW50cy5sZW5ndGggLSAxKS5tYXAoZnVuY3Rpb24oZWxlbSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbXBhbnlOYW1lOiBlbGVtWzBdLFxuICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBlbGVtWzFdLFxuICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBlbGVtWzJdLFxuICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0RGF0ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgeWVhcjogZWxlbVszXS5zcGxpdCgnLycpWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6IGVsZW1bM10uc3BsaXQoJy8nKVswXVxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgZW5kRGF0ZTogZWxlbVs0XSA/IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHllYXI6IGVsZW1bNF0uc3BsaXQoJy8nKVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoOiBlbGVtWzRdLnNwbGl0KCcvJylbMF1cbiAgICAgICAgICAgICAgICAgICAgICB9IDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogZWxlbVs1XVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzUG9zaXRpb24ocG9zaXRpb25zLnNvcnQoKHAxLHAyKSA9PlxuICAgICAgICAgICAgICAgICAgICAoK3AyLnN0YXJ0RGF0ZS55ZWFyIC0gK3AxLnN0YXJ0RGF0ZS55ZWFyKSB8fCAoK3AyLnN0YXJ0RGF0ZS5tb250aCAtICtwMS5zdGFydERhdGUubW9udGgpXG4gICAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNhc2UgJ0xhbmd1YWdlcy5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgZW50cnkuZ2V0RGF0YShuZXcgemlwLkJsb2JXcml0ZXIoJ3RleHQvcGxhaW4nKSwgZnVuY3Rpb24oYmxvYikge1xuICAgICAgICAgICAgICAgIHJlYWRCbG9iKGJsb2IsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBjc3ZUb0FycmF5KGNvbnRlbnRzKTtcbiAgICAgICAgICAgICAgICAgIHZhciBsYW5ndWFnZXMgPSBlbGVtZW50cy5zbGljZSgxLCBlbGVtZW50cy5sZW5ndGggLSAxKS5tYXAoZnVuY3Rpb24oZWxlbSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGVsZW1bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgcHJvZmljaWVuY3k6IGVsZW1bMV1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc0xhbmd1YWdlcyhsYW5ndWFnZXMpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2FzZSAnUmVjb21tZW5kYXRpb25zIFJlY2VpdmVkLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMsICdcXHQnKTsgLy8geWVzLCByZWNvbW1lbmRhdGlvbnMgdXNlIHRhYi1kZWxpbWl0ZXJcbiAgICAgICAgICAgICAgICAgIHZhciByZWNvbW1lbmRhdGlvbnMgPSBlbGVtZW50cy5zbGljZSgxLCBlbGVtZW50cy5sZW5ndGggLSAxKS5tYXAoZnVuY3Rpb24oZWxlbSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uRGF0ZTogZWxlbVswXSxcbiAgICAgICAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbkJvZHk6IGVsZW1bMV0sXG4gICAgICAgICAgICAgICAgICAgICAgcmVjb21tZW5kZXJGaXJzdE5hbWU6IGVsZW1bMl0sXG4gICAgICAgICAgICAgICAgICAgICAgcmVjb21tZW5kZXJMYXN0TmFtZTogZWxlbVszXSxcbiAgICAgICAgICAgICAgICAgICAgICByZWNvbW1lbmRlckNvbXBhbnk6IGVsZW1bNF0sXG4gICAgICAgICAgICAgICAgICAgICAgcmVjb21tZW5kZXJUaXRsZTogZWxlbVs1XSxcbiAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5U3RhdHVzOiBlbGVtWzZdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICB9KS5maWx0ZXIoZnVuY3Rpb24ocmVjb21tZW5kYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlY29tbWVuZGF0aW9uLmRpc3BsYXlTdGF0dXMgPT09ICdTaG93bic7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NSZWZlcmVuY2VzKHJlY29tbWVuZGF0aW9ucyk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdQcm9maWxlLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMpO1xuICAgICAgICAgICAgICAgICAgdmFyIHByb2ZpbGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0TmFtZTogZWxlbWVudHNbMV1bMF0sXG4gICAgICAgICAgICAgICAgICAgIGxhc3ROYW1lOiBlbGVtZW50c1sxXVsxXSxcbiAgICAgICAgICAgICAgICAgICAgbWFpZGVuTmFtZTogZWxlbWVudHNbMV1bMl0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZWREYXRlOiBlbGVtZW50c1sxXVszXSxcbiAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogZWxlbWVudHNbMV1bNF0sXG4gICAgICAgICAgICAgICAgICAgIGJpcnRoRGF0ZTogZWxlbWVudHNbMV1bNV0sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhY3RJbnN0cnVjdGlvbnM6IGVsZW1lbnRzWzFdWzZdLFxuICAgICAgICAgICAgICAgICAgICBtYXJpdGFsU3RhdHVzOiBlbGVtZW50c1sxXVs3XSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGxpbmU6IGVsZW1lbnRzWzFdWzhdLFxuICAgICAgICAgICAgICAgICAgICBzdW1tYXJ5OiBlbGVtZW50c1sxXVs5XSxcbiAgICAgICAgICAgICAgICAgICAgaW5kdXN0cnk6IGVsZW1lbnRzWzFdWzEwXSxcbiAgICAgICAgICAgICAgICAgICAgYXNzb2NpYXRpb246IGVsZW1lbnRzWzFdWzExXVxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NQcm9maWxlKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjYXNlICdFbWFpbCBBZGRyZXNzZXMuY3N2JzpcbiAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgICByZWFkQmxvYihibG9iLCBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBjc3ZUb0FycmF5KGNvbnRlbnRzLCAnXFx0Jyk7IC8vIHllcywgcmVjb21tZW5kYXRpb25zIHVzZSB0YWItZGVsaW1pdGVyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbWFpbCA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IGVsZW1bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGVsZW1bMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1ByaW1hcnk6IGVsZW1bMl0gPT09ICdZZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZUFkZGVkOiBlbGVtWzNdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZVJlbW92ZWQ6IGVsZW1bNF1cbiAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9KS5maWx0ZXIoZW1haWwgPT4gZW1haWwuaXNQcmltYXJ5KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVtYWlsLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NFbWFpbChlbWFpbFswXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBmaWxlZHJhZy5pbm5lckhUTUwgPSAnRHJvcHBlZCEgU2VlIHRoZSByZXN1bHRpbmcgSlNPTiBSZXN1bWUgYXQgdGhlIGJvdHRvbS4nO1xuICAgICAgICB2YXIgb3V0cHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ291dHB1dCcpO1xuICAgICAgICBvdXRwdXQuaW5uZXJIVE1MID0gSlNPTi5zdHJpbmdpZnkobGlua2VkaW5Ub0pzb25SZXN1bWUuZ2V0T3V0cHV0KCksIHVuZGVmaW5lZCwgMik7XG4gICAgICAgIFByaXNtLmhpZ2hsaWdodEVsZW1lbnQob3V0cHV0KTtcbiAgICAgICAgZG93bmxvYWRCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIGZpbGVkcmFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGVkcmFnJyksXG4gICAgICBmaWxlc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGVzZWxlY3QnKSxcbiAgICAgIGZpbGVOYW1lID0gbnVsbDtcbiAgLy8gZmlsZSBzZWxlY3RcbiAgZmlsZXNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmaWxlU2VsZWN0SGFuZGxlciwgZmFsc2UpO1xuXG4gIC8vIGZpbGUgZHJhZyBob3ZlclxuICBmdW5jdGlvbiBmaWxlRHJhZ0hvdmVyKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnRhcmdldC5jbGFzc05hbWUgPSAoZS50eXBlID09PSAnZHJhZ292ZXInID8gJ2hvdmVyJyA6ICcnKTtcbiAgfVxuXG4gIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgaWYgKHhoci51cGxvYWQpIHtcbiAgICAvLyBmaWxlIGRyb3BcbiAgICBmaWxlZHJhZy5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGZpbGVEcmFnSG92ZXIsIGZhbHNlKTtcbiAgICBmaWxlZHJhZy5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBmaWxlRHJhZ0hvdmVyLCBmYWxzZSk7XG4gICAgZmlsZWRyYWcuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGZpbGVTZWxlY3RIYW5kbGVyLCBmYWxzZSk7XG4gICAgZmlsZWRyYWcuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gIH0gZWxzZSB7XG4gICAgZmlsZWRyYWcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3QtZmlsZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIGZpbGVzZWxlY3QuY2xpY2soKTtcbiAgfSk7XG5cbiAgdmFyIG1vZGVsID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBVUkwgPSB3aW5kb3cud2Via2l0VVJMIHx8IHdpbmRvdy5tb3pVUkwgfHwgd2luZG93LlVSTDtcblxuICAgIHJldHVybiB7XG4gICAgICBnZXRFbnRyaWVzIDogZnVuY3Rpb24oZmlsZSwgb25lbmQpIHtcbiAgICAgICAgemlwLmNyZWF0ZVJlYWRlcihuZXcgemlwLkJsb2JSZWFkZXIoZmlsZSksIGZ1bmN0aW9uKHppcFJlYWRlcikge1xuICAgICAgICAgIHppcFJlYWRlci5nZXRFbnRyaWVzKG9uZW5kKTtcbiAgICAgICAgfSwgb25lcnJvcik7XG4gICAgICB9LFxuICAgICAgZ2V0RW50cnlGaWxlIDogZnVuY3Rpb24oZW50cnksIGNyZWF0aW9uTWV0aG9kLCBvbmVuZCwgb25wcm9ncmVzcykge1xuICAgICAgICB2YXIgd3JpdGVyLCB6aXBGaWxlRW50cnk7XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0RGF0YSgpIHtcbiAgICAgICAgICBlbnRyeS5nZXREYXRhKHdyaXRlciwgZnVuY3Rpb24oYmxvYikge1xuICAgICAgICAgICAgdmFyIGJsb2JVUkwgPSBjcmVhdGlvbk1ldGhvZCA9PT0gJ0Jsb2InID8gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSA6IHppcEZpbGVFbnRyeS50b1VSTCgpO1xuICAgICAgICAgICAgb25lbmQoYmxvYlVSTCk7XG4gICAgICAgICAgfSwgb25wcm9ncmVzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3JlYXRpb25NZXRob2QgPT09ICdCbG9iJykge1xuICAgICAgICAgIHdyaXRlciA9IG5ldyB6aXAuQmxvYldyaXRlcigpO1xuICAgICAgICAgIGdldERhdGEoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjcmVhdGVUZW1wRmlsZShmdW5jdGlvbihmaWxlRW50cnkpIHtcbiAgICAgICAgICAgIHppcEZpbGVFbnRyeSA9IGZpbGVFbnRyeTtcbiAgICAgICAgICAgIHdyaXRlciA9IG5ldyB6aXAuRmlsZVdyaXRlcih6aXBGaWxlRW50cnkpO1xuICAgICAgICAgICAgZ2V0RGF0YSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSkoKTtcblxuICB6aXAud29ya2VyU2NyaXB0c1BhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyAndmVuZG9yLyc7XG5cbiAgZnVuY3Rpb24gcmVhZEJsb2IoYmxvYiwgY2FsbGJhY2spIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZSkge1xuICAgICAgY2FsbGJhY2soZS50YXJnZXQucmVzdWx0KTtcbiAgICB9O1xuICAgIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IpO1xuICB9XG5cbn0pKCk7XG4iXX0=
