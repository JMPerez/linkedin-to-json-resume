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
          address: '',
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
// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
"use strict";

function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = strDelimiter || ",";

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))", "gi");

    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;

    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

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
            strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];
        }

        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue ? strMatchedValue.trim() : strMatchedValue);
    }

    // Return the parsed data.
    return arrData;
}
module.exports = CSVToArray;

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
            return new Promise(function (resolve, reject) {
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
            return new Promise(function (resolve, reject) {
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
            return new Promise(function (resolve, reject) {
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
            return new Promise(function (resolve, reject) {
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
            return new Promise(function (resolve, reject) {
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
            return new Promise(function (resolve, reject) {
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
            return new Promise(function (resolve, reject) {
              entry.getData(new zip.BlobWriter('text/plain'), function (blob) {
                readBlob(blob, function (contents) {
                  var elements = (0, _csvtoarrayJs2['default'])(contents, '\t'); // yes, recommendations use tab-delimiter
                  var email = elements.slice(1, elements.length - 1).map(function (elem) {
                    return {
                      address: elem[0],
                      status: elem[1],
                      isPrimary: elem[2] == 'Yes',
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
})();

},{"./converter.js":1,"./csvtoarray.js":2,"./file.js":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9jbGVtc29zL0Rldi9jbGVtZW50cmVuYXVkLmNvbS9saW5rZWRpbi10by1qc29uLXJlc3VtZS9qcy9jb252ZXJ0ZXIuanMiLCIvaG9tZS9jbGVtc29zL0Rldi9jbGVtZW50cmVuYXVkLmNvbS9saW5rZWRpbi10by1qc29uLXJlc3VtZS9qcy9jc3Z0b2FycmF5LmpzIiwiL2hvbWUvY2xlbXNvcy9EZXYvY2xlbWVudHJlbmF1ZC5jb20vbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvZmlsZS5qcyIsIi9ob21lL2NsZW1zb3MvRGV2L2NsZW1lbnRyZW5hdWQuY29tL2xpbmtlZGluLXRvLWpzb24tcmVzdW1lL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDSU0sb0JBQW9CO0FBQ2IsV0FEUCxvQkFBb0IsR0FDVjswQkFEVixvQkFBb0I7O0FBRXRCLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0dBQ2xCOztlQUhHLG9CQUFvQjs7V0FLZixxQkFBRzs7QUFFVixVQUFJLGFBQWEsR0FBRyxDQUNsQixRQUFRLEVBQ1IsTUFBTSxFQUNOLFdBQVcsRUFDWCxXQUFXLEVBQ1gsUUFBUSxFQUNSLGNBQWMsRUFDZCxRQUFRLEVBQ1IsV0FBVyxFQUNYLFdBQVcsRUFDWCxZQUFZLENBQ2IsQ0FBQzs7QUFFRixVQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7Ozs7OztBQUN0Qiw2QkFBYyxhQUFhLDhIQUFFO2NBQXBCLENBQUM7O0FBQ1IsY0FBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNwQix3QkFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7V0FDbEM7U0FDRjs7Ozs7Ozs7Ozs7Ozs7OztBQUNELGFBQU8sWUFBWSxDQUFD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QUFDLEVBQUUsQ0FBQyxDQUFDO0FBQUEsU0FDOUI7T0FDRixDQUFDLENBQUM7O0FBRUgsYUFBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBVztBQUNwQyxnQkFBUSxDQUFDLFNBQVMsR0FBRyx1REFBdUQsQ0FBQztBQUM3RSxZQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9DLGNBQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEYsYUFBSyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLHNCQUFjLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkMsZ0JBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7T0FDM0QsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0dBRUo7Q0FFRixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgbW9kdWxlICovXG4vKiBleHBvcnRlZCBvbkxpbmtlZEluTG9hZCAqL1xuXG4vLyB0b2RvOiBpbXBvcnQgcHVibGljYXRpb25zLCBhd2FyZHMsIHZvbHVudGVlclxuY2xhc3MgTGlua2VkSW5Ub0pzb25SZXN1bWUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnRhcmdldCA9IHt9O1xuICB9XG5cbiAgZ2V0T3V0cHV0KCkge1xuICAgIC8vIHNvcnQgdGhlIG9iamVjdFxuICAgIHZhciBwcm9wZXJ0eU9yZGVyID0gW1xuICAgICAgJ2Jhc2ljcycsXG4gICAgICAnd29yaycsXG4gICAgICAndm9sdW50ZWVyJyxcbiAgICAgICdlZHVjYXRpb24nLFxuICAgICAgJ2F3YXJkcycsXG4gICAgICAncHVibGljYXRpb25zJyxcbiAgICAgICdza2lsbHMnLFxuICAgICAgJ2xhbmd1YWdlcycsXG4gICAgICAnaW50ZXJlc3RzJyxcbiAgICAgICdyZWZlcmVuY2VzJ1xuICAgIF07XG5cbiAgICB2YXIgc29ydGVkVGFyZ2V0ID0ge307XG4gICAgZm9yICh2YXIgcCBvZiBwcm9wZXJ0eU9yZGVyKSB7XG4gICAgICBpZiAocCBpbiB0aGlzLnRhcmdldCkge1xuICAgICAgICBzb3J0ZWRUYXJnZXRbcF0gPSB0aGlzLnRhcmdldFtwXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNvcnRlZFRhcmdldDtcbiAgfVxuXG4gIF9leHRlbmQodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICB0YXJnZXQgPSB0YXJnZXQgfHwge307XG4gICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGtleSA9PiB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldKTtcbiAgfVxuXG4gIHByb2Nlc3NQcm9maWxlKHNvdXJjZSkge1xuICAgIHRoaXMudGFyZ2V0LmJhc2ljcyA9IHRoaXMudGFyZ2V0LmJhc2ljcyB8fCB7fTtcbiAgICB0aGlzLl9leHRlbmQodGhpcy50YXJnZXQuYmFzaWNzLCB7XG4gICAgICBuYW1lOiBzb3VyY2UuZmlyc3ROYW1lICsgJyAnICsgc291cmNlLmxhc3ROYW1lLFxuICAgICAgbGFiZWw6IHNvdXJjZS5oZWFkbGluZSxcbiAgICAgIHBpY3R1cmU6IHNvdXJjZS5waWN0dXJlVXJsLFxuICAgICAgcGhvbmU6IHNvdXJjZS5waG9uZU51bWJlcnMgJiYgc291cmNlLnBob25lTnVtYmVycy5fdG90YWwgPyBzb3VyY2UucGhvbmVOdW1iZXJzLnZhbHVlc1swXS5waG9uZU51bWJlciA6ICcnLFxuICAgICAgd2Vic2l0ZTogJycsXG4gICAgICBzdW1tYXJ5OiBzb3VyY2Uuc3VtbWFyeSxcbiAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIGFkZHJlc3M6ICcnLFxuICAgICAgICBwb3N0YWxDb2RlOiAnJyxcbiAgICAgICAgY2l0eTogc291cmNlLmxvY2F0aW9uID8gc291cmNlLmxvY2F0aW9uLm5hbWUgOiAnJyxcbiAgICAgICAgY291bnRyeUNvZGU6IHNvdXJjZS5sb2NhdGlvbiA/IHNvdXJjZS5sb2NhdGlvbi5jb3VudHJ5LmNvZGUudG9VcHBlckNhc2UoKSA6ICcnLFxuICAgICAgICByZWdpb246ICcnXG4gICAgICB9LFxuICAgICAgcHJvZmlsZXM6IFtdXG4gICAgfSk7XG4gIH1cblxuICBwcm9jZXNzRW1haWwoc291cmNlKSB7XG4gICAgdGhpcy50YXJnZXQuYmFzaWNzID0gdGhpcy50YXJnZXQuYmFzaWNzIHx8IHt9O1xuICAgIHRoaXMuX2V4dGVuZCh0aGlzLnRhcmdldC5iYXNpY3MsIHsnZW1haWwnOiBzb3VyY2UuYWRkcmVzc30pO1xuICB9XG5cbiAgcHJvY2Vzc1Bvc2l0aW9uKHNvdXJjZSkge1xuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc1Bvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgICBsZXQgb2JqZWN0ID0ge1xuICAgICAgICBjb21wYW55OiBwb3NpdGlvbi5jb21wYW55TmFtZSxcbiAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLnRpdGxlIHx8ICcnLFxuICAgICAgICB3ZWJzaXRlOiAnJyxcbiAgICAgICAgc3RhcnREYXRlOiBwb3NpdGlvbi5zdGFydERhdGUueWVhciArICctJyArIChwb3NpdGlvbi5zdGFydERhdGUubW9udGggPCAxMCA/ICcwJyA6ICcnKSArIHBvc2l0aW9uLnN0YXJ0RGF0ZS5tb250aCArICctMDEnLFxuICAgICAgICBzdW1tYXJ5OiBwb3NpdGlvbi5kZXNjcmlwdGlvbixcbiAgICAgICAgaGlnaGxpZ2h0czogW11cbiAgICAgIH07XG5cbiAgICAgIGlmIChwb3NpdGlvbi5lbmREYXRlKSB7XG4gICAgICAgIG9iamVjdC5lbmREYXRlID0gcG9zaXRpb24uZW5kRGF0ZS55ZWFyICsgJy0nICsgKHBvc2l0aW9uLmVuZERhdGUubW9udGggPCAxMCA/ICcwJyA6ICcnKSArIHBvc2l0aW9uLmVuZERhdGUubW9udGggKyAnLTAxJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICB0aGlzLnRhcmdldC53b3JrID0gc291cmNlLm1hcChwcm9jZXNzUG9zaXRpb24pO1xuICB9XG5cbiAgcHJvY2Vzc0VkdWNhdGlvbihzb3VyY2UpIHtcblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NFZHVjYXRpb24oZWR1Y2F0aW9uKSB7XG4gICAgICBsZXQgb2JqZWN0ID0ge1xuICAgICAgICBpbnN0aXR1dGlvbjogZWR1Y2F0aW9uLnNjaG9vbE5hbWUsXG4gICAgICAgIGFyZWE6ICcnLFxuICAgICAgICBzdHVkeVR5cGU6IGVkdWNhdGlvbi5kZWdyZWUsXG4gICAgICAgIHN0YXJ0RGF0ZTogJycgKyBlZHVjYXRpb24uc3RhcnREYXRlICsgJy0wMS0wMScsXG4gICAgICAgIGdwYTogJycsXG4gICAgICAgIGNvdXJzZXM6IFtdXG4gICAgICB9O1xuXG4gICAgICBpZiAoZWR1Y2F0aW9uLmVuZERhdGUpIHtcbiAgICAgICAgb2JqZWN0LmVuZERhdGUgPSBlZHVjYXRpb24uZW5kRGF0ZSArICctMDEtMDEnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIHRoaXMudGFyZ2V0LmVkdWNhdGlvbiA9IHNvdXJjZS5tYXAocHJvY2Vzc0VkdWNhdGlvbik7XG4gIH1cblxuICBwcm9jZXNzU2tpbGxzKHNraWxscykge1xuXG4gICAgdGhpcy50YXJnZXQuc2tpbGxzID0gc2tpbGxzLm1hcChza2lsbCA9PiAoe1xuICAgICAgICBuYW1lOiBza2lsbCxcbiAgICAgICAgbGV2ZWw6ICcnLFxuICAgICAgICBrZXl3b3JkczogW11cbiAgICAgIH0pKTtcbiAgfVxuXG4gIHByb2Nlc3NMYW5ndWFnZXMoc291cmNlKSB7XG5cbiAgICBmdW5jdGlvbiBjbGVhblByb2ZpY2llbmN5U3RyaW5nKHByb2ZpY2llbmN5KSB7XG4gICAgICBwcm9maWNpZW5jeSA9IHByb2ZpY2llbmN5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXy9nLCAnICcpO1xuICAgICAgcmV0dXJuIHByb2ZpY2llbmN5WzBdLnRvVXBwZXJDYXNlKCkgKyBwcm9maWNpZW5jeS5zdWJzdHIoMSk7XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXQubGFuZ3VhZ2VzID0gc291cmNlLm1hcChsYW5ndWFnZSA9PiAoe1xuICAgICAgbGFuZ3VhZ2U6IGxhbmd1YWdlLm5hbWUsXG4gICAgICBmbHVlbmN5OiBjbGVhblByb2ZpY2llbmN5U3RyaW5nKGxhbmd1YWdlLnByb2ZpY2llbmN5KVxuICAgIH0pKTtcbiAgfVxuXG4gIHByb2Nlc3NSZWZlcmVuY2VzKHNvdXJjZSkge1xuXG4gICAgdGhpcy50YXJnZXQucmVmZXJlbmNlcyA9IHNvdXJjZS5tYXAocmVmZXJlbmNlID0+ICh7XG4gICAgICBuYW1lOiByZWZlcmVuY2UucmVjb21tZW5kZXJGaXJzdE5hbWUgKyAnICcgKyByZWZlcmVuY2UucmVjb21tZW5kZXJMYXN0TmFtZSxcbiAgICAgIHJlZmVyZW5jZTogcmVmZXJlbmNlLnJlY29tbWVuZGF0aW9uQm9keVxuICAgIH0pKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmtlZEluVG9Kc29uUmVzdW1lO1xuIiwiLy8gcmVmOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMjkzMTYzLzIzNDNcbi8vIFRoaXMgd2lsbCBwYXJzZSBhIGRlbGltaXRlZCBzdHJpbmcgaW50byBhbiBhcnJheSBvZlxuLy8gYXJyYXlzLiBUaGUgZGVmYXVsdCBkZWxpbWl0ZXIgaXMgdGhlIGNvbW1hLCBidXQgdGhpc1xuLy8gY2FuIGJlIG92ZXJyaWRlbiBpbiB0aGUgc2Vjb25kIGFyZ3VtZW50LlxuZnVuY3Rpb24gQ1NWVG9BcnJheSggc3RyRGF0YSwgc3RyRGVsaW1pdGVyICl7XG4gICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBkZWxpbWl0ZXIgaXMgZGVmaW5lZC4gSWYgbm90LFxuICAgIC8vIHRoZW4gZGVmYXVsdCB0byBjb21tYS5cbiAgICBzdHJEZWxpbWl0ZXIgPSAoc3RyRGVsaW1pdGVyIHx8IFwiLFwiKTtcblxuICAgIC8vIENyZWF0ZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBwYXJzZSB0aGUgQ1NWIHZhbHVlcy5cbiAgICB2YXIgb2JqUGF0dGVybiA9IG5ldyBSZWdFeHAoXG4gICAgICAgIChcbiAgICAgICAgICAgIC8vIERlbGltaXRlcnMuXG4gICAgICAgICAgICBcIihcXFxcXCIgKyBzdHJEZWxpbWl0ZXIgKyBcInxcXFxccj9cXFxcbnxcXFxccnxeKVwiICtcblxuICAgICAgICAgICAgLy8gUXVvdGVkIGZpZWxkcy5cbiAgICAgICAgICAgIFwiKD86XFxcIihbXlxcXCJdKig/OlxcXCJcXFwiW15cXFwiXSopKilcXFwifFwiICtcblxuICAgICAgICAgICAgLy8gU3RhbmRhcmQgZmllbGRzLlxuICAgICAgICAgICAgXCIoW15cXFwiXFxcXFwiICsgc3RyRGVsaW1pdGVyICsgXCJcXFxcclxcXFxuXSopKVwiXG4gICAgICAgICksXG4gICAgICAgIFwiZ2lcIlxuICAgICAgICApO1xuXG5cbiAgICAvLyBDcmVhdGUgYW4gYXJyYXkgdG8gaG9sZCBvdXIgZGF0YS4gR2l2ZSB0aGUgYXJyYXlcbiAgICAvLyBhIGRlZmF1bHQgZW1wdHkgZmlyc3Qgcm93LlxuICAgIHZhciBhcnJEYXRhID0gW1tdXTtcblxuICAgIC8vIENyZWF0ZSBhbiBhcnJheSB0byBob2xkIG91ciBpbmRpdmlkdWFsIHBhdHRlcm5cbiAgICAvLyBtYXRjaGluZyBncm91cHMuXG4gICAgdmFyIGFyck1hdGNoZXMgPSBudWxsO1xuXG5cbiAgICAvLyBLZWVwIGxvb3Bpbmcgb3ZlciB0aGUgcmVndWxhciBleHByZXNzaW9uIG1hdGNoZXNcbiAgICAvLyB1bnRpbCB3ZSBjYW4gbm8gbG9uZ2VyIGZpbmQgYSBtYXRjaC5cbiAgICB3aGlsZSAoYXJyTWF0Y2hlcyA9IG9ialBhdHRlcm4uZXhlYyggc3RyRGF0YSApKXtcblxuICAgICAgICAvLyBHZXQgdGhlIGRlbGltaXRlciB0aGF0IHdhcyBmb3VuZC5cbiAgICAgICAgdmFyIHN0ck1hdGNoZWREZWxpbWl0ZXIgPSBhcnJNYXRjaGVzWyAxIF07XG5cbiAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBnaXZlbiBkZWxpbWl0ZXIgaGFzIGEgbGVuZ3RoXG4gICAgICAgIC8vIChpcyBub3QgdGhlIHN0YXJ0IG9mIHN0cmluZykgYW5kIGlmIGl0IG1hdGNoZXNcbiAgICAgICAgLy8gZmllbGQgZGVsaW1pdGVyLiBJZiBpZCBkb2VzIG5vdCwgdGhlbiB3ZSBrbm93XG4gICAgICAgIC8vIHRoYXQgdGhpcyBkZWxpbWl0ZXIgaXMgYSByb3cgZGVsaW1pdGVyLlxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBzdHJNYXRjaGVkRGVsaW1pdGVyLmxlbmd0aCAmJlxuICAgICAgICAgICAgc3RyTWF0Y2hlZERlbGltaXRlciAhPT0gc3RyRGVsaW1pdGVyXG4gICAgICAgICAgICApe1xuXG4gICAgICAgICAgICAvLyBTaW5jZSB3ZSBoYXZlIHJlYWNoZWQgYSBuZXcgcm93IG9mIGRhdGEsXG4gICAgICAgICAgICAvLyBhZGQgYW4gZW1wdHkgcm93IHRvIG91ciBkYXRhIGFycmF5LlxuICAgICAgICAgICAgYXJyRGF0YS5wdXNoKCBbXSApO1xuXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RyTWF0Y2hlZFZhbHVlO1xuXG4gICAgICAgIC8vIE5vdyB0aGF0IHdlIGhhdmUgb3VyIGRlbGltaXRlciBvdXQgb2YgdGhlIHdheSxcbiAgICAgICAgLy8gbGV0J3MgY2hlY2sgdG8gc2VlIHdoaWNoIGtpbmQgb2YgdmFsdWUgd2VcbiAgICAgICAgLy8gY2FwdHVyZWQgKHF1b3RlZCBvciB1bnF1b3RlZCkuXG4gICAgICAgIGlmIChhcnJNYXRjaGVzWyAyIF0pe1xuXG4gICAgICAgICAgICAvLyBXZSBmb3VuZCBhIHF1b3RlZCB2YWx1ZS4gV2hlbiB3ZSBjYXB0dXJlXG4gICAgICAgICAgICAvLyB0aGlzIHZhbHVlLCB1bmVzY2FwZSBhbnkgZG91YmxlIHF1b3Rlcy5cbiAgICAgICAgICAgIHN0ck1hdGNoZWRWYWx1ZSA9IGFyck1hdGNoZXNbIDIgXS5yZXBsYWNlKFxuICAgICAgICAgICAgICAgIG5ldyBSZWdFeHAoIFwiXFxcIlxcXCJcIiwgXCJnXCIgKSxcbiAgICAgICAgICAgICAgICBcIlxcXCJcIlxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8gV2UgZm91bmQgYSBub24tcXVvdGVkIHZhbHVlLlxuICAgICAgICAgICAgc3RyTWF0Y2hlZFZhbHVlID0gYXJyTWF0Y2hlc1sgMyBdO1xuXG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIE5vdyB0aGF0IHdlIGhhdmUgb3VyIHZhbHVlIHN0cmluZywgbGV0J3MgYWRkXG4gICAgICAgIC8vIGl0IHRvIHRoZSBkYXRhIGFycmF5LlxuICAgICAgICBhcnJEYXRhWyBhcnJEYXRhLmxlbmd0aCAtIDEgXS5wdXNoKCBzdHJNYXRjaGVkVmFsdWUgPyBzdHJNYXRjaGVkVmFsdWUudHJpbSgpIDogc3RyTWF0Y2hlZFZhbHVlICk7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBwYXJzZWQgZGF0YS5cbiAgICByZXR1cm4oIGFyckRhdGEgKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gQ1NWVG9BcnJheTsiLCIvKiBnbG9iYWwgVVJMLCBCbG9iLCBtb2R1bGUgKi9cbi8qIGV4cG9ydGVkIHNhdmUgKi9cbnZhciBzYXZlID0gKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gc2F2ZUFzIGZyb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vTXJTd2l0Y2gvMzU1Mjk4NVxuICB2YXIgc2F2ZUFzID0gd2luZG93LnNhdmVBcyB8fCAod2luZG93Lm5hdmlnYXRvci5tc1NhdmVCbG9iID8gZnVuY3Rpb24gKGIsIG4pIHtcbiAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZUJsb2IoYiwgbik7XG4gICAgfSA6IGZhbHNlKSB8fCB3aW5kb3cud2Via2l0U2F2ZUFzIHx8IHdpbmRvdy5tb3pTYXZlQXMgfHwgd2luZG93Lm1zU2F2ZUFzIHx8IChmdW5jdGlvbiAoKSB7XG5cbiAgICAgIC8vIFVSTCdzXG4gICAgICB3aW5kb3cuVVJMID0gd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMO1xuXG4gICAgICBpZiAoIXdpbmRvdy5VUkwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGJsb2IsIG5hbWUpIHtcbiAgICAgICAgdmFyIHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cbiAgICAgICAgLy8gVGVzdCBmb3IgZG93bmxvYWQgbGluayBzdXBwb3J0XG4gICAgICAgIGlmICgnZG93bmxvYWQnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSkge1xuXG4gICAgICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB1cmwpO1xuICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIG5hbWUpO1xuXG4gICAgICAgICAgLy8gQ3JlYXRlIENsaWNrIGV2ZW50XG4gICAgICAgICAgdmFyIGNsaWNrRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnTW91c2VFdmVudCcpO1xuICAgICAgICAgIGNsaWNrRXZlbnQuaW5pdE1vdXNlRXZlbnQoJ2NsaWNrJywgdHJ1ZSwgdHJ1ZSwgd2luZG93LCAwLFxuICAgICAgICAgICAgMCwgMCwgMCwgMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIG51bGwpO1xuXG4gICAgICAgICAgLy8gZGlzcGF0Y2ggY2xpY2sgZXZlbnQgdG8gc2ltdWxhdGUgZG93bmxvYWRcbiAgICAgICAgICBhLmRpc3BhdGNoRXZlbnQoY2xpY2tFdmVudCk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBmYWxsb3Zlciwgb3BlbiByZXNvdXJjZSBpbiBuZXcgdGFiLlxuICAgICAgICAgIHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycsICcnKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KSgpO1xuXG4gIGZ1bmN0aW9uIF9zYXZlICh0ZXh0LCBmaWxlTmFtZSkge1xuICAgIHZhciBibG9iID0gbmV3IEJsb2IoW3RleHRdLCB7XG4gICAgICB0eXBlOiAndGV4dC9wbGFpbidcbiAgICB9KTtcbiAgICBzYXZlQXMoYmxvYiwgZmlsZU5hbWUgfHwgJ3N1YnRpdGxlLnNydCcpO1xuICB9XG5cbiAgcmV0dXJuIF9zYXZlO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNhdmU7IiwiLyogZ2xvYmFsIHppcCwgY3JlYXRlVGVtcEZpbGUsIFByaXNtICovXG5cbmltcG9ydCBMaW5rZWRJblRvSnNvblJlc3VtZSBmcm9tICcuL2NvbnZlcnRlci5qcyc7XG5pbXBvcnQgY3N2VG9BcnJheSBmcm9tICcuL2NzdnRvYXJyYXkuanMnO1xuaW1wb3J0IHNhdmUgZnJvbSAnLi9maWxlLmpzJztcblxuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGxpbmtlZGluVG9Kc29uUmVzdW1lID0gbmV3IExpbmtlZEluVG9Kc29uUmVzdW1lKCk7XG5cbiAgdmFyIGRvd25sb2FkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRvd25sb2FkJyk7XG4gIGRvd25sb2FkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgc2F2ZShKU09OLnN0cmluZ2lmeShsaW5rZWRpblRvSnNvblJlc3VtZS5nZXRPdXRwdXQoKSwgdW5kZWZpbmVkLCAyKSwgJ3Jlc3VtZS5qc29uJyk7XG4gIH0pO1xuICBkb3dubG9hZEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gIHZhciBmaWxlZHJhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlZHJhZycpLFxuICAgICAgZmlsZXNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlc2VsZWN0JyksXG4gICAgICBmaWxlTmFtZSA9IG51bGw7XG4gICAvLyBmaWxlIHNlbGVjdFxuICBmaWxlc2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZpbGVTZWxlY3RIYW5kbGVyLCBmYWxzZSk7XG5cbiAgLy8gZmlsZSBkcmFnIGhvdmVyXG4gIGZ1bmN0aW9uIGZpbGVEcmFnSG92ZXIoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUudGFyZ2V0LmNsYXNzTmFtZSA9IChlLnR5cGUgPT09ICdkcmFnb3ZlcicgPyAnaG92ZXInIDogJycpO1xuICB9XG5cbiAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICBpZiAoeGhyLnVwbG9hZCkge1xuICAgIC8vIGZpbGUgZHJvcFxuICAgIGZpbGVkcmFnLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZmlsZURyYWdIb3ZlciwgZmFsc2UpO1xuICAgIGZpbGVkcmFnLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGZpbGVEcmFnSG92ZXIsIGZhbHNlKTtcbiAgICBmaWxlZHJhZy5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZmlsZVNlbGVjdEhhbmRsZXIsIGZhbHNlKTtcbiAgICBmaWxlZHJhZy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgfSBlbHNlIHtcbiAgICBmaWxlZHJhZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9XG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdC1maWxlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgZmlsZXNlbGVjdC5jbGljaygpO1xuICB9KTtcblxuICB2YXIgbW9kZWwgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIFVSTCA9IHdpbmRvdy53ZWJraXRVUkwgfHwgd2luZG93Lm1velVSTCB8fCB3aW5kb3cuVVJMO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldEVudHJpZXMgOiBmdW5jdGlvbihmaWxlLCBvbmVuZCkge1xuICAgICAgICB6aXAuY3JlYXRlUmVhZGVyKG5ldyB6aXAuQmxvYlJlYWRlcihmaWxlKSwgZnVuY3Rpb24oemlwUmVhZGVyKSB7XG4gICAgICAgICAgemlwUmVhZGVyLmdldEVudHJpZXMob25lbmQpO1xuICAgICAgICB9LCBvbmVycm9yKTtcbiAgICAgIH0sXG4gICAgICBnZXRFbnRyeUZpbGUgOiBmdW5jdGlvbihlbnRyeSwgY3JlYXRpb25NZXRob2QsIG9uZW5kLCBvbnByb2dyZXNzKSB7XG4gICAgICAgIHZhciB3cml0ZXIsIHppcEZpbGVFbnRyeTtcblxuICAgICAgICBmdW5jdGlvbiBnZXREYXRhKCkge1xuICAgICAgICAgIGVudHJ5LmdldERhdGEod3JpdGVyLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICB2YXIgYmxvYlVSTCA9IGNyZWF0aW9uTWV0aG9kID09PSAnQmxvYicgPyBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpIDogemlwRmlsZUVudHJ5LnRvVVJMKCk7XG4gICAgICAgICAgICBvbmVuZChibG9iVVJMKTtcbiAgICAgICAgICB9LCBvbnByb2dyZXNzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjcmVhdGlvbk1ldGhvZCA9PT0gJ0Jsb2InKSB7XG4gICAgICAgICAgd3JpdGVyID0gbmV3IHppcC5CbG9iV3JpdGVyKCk7XG4gICAgICAgICAgZ2V0RGF0YSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNyZWF0ZVRlbXBGaWxlKGZ1bmN0aW9uKGZpbGVFbnRyeSkge1xuICAgICAgICAgICAgemlwRmlsZUVudHJ5ID0gZmlsZUVudHJ5O1xuICAgICAgICAgICAgd3JpdGVyID0gbmV3IHppcC5GaWxlV3JpdGVyKHppcEZpbGVFbnRyeSk7XG4gICAgICAgICAgICBnZXREYXRhKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9KSgpO1xuXG4gIHppcC53b3JrZXJTY3JpcHRzUGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArICd2ZW5kb3IvJztcblxuICBmdW5jdGlvbiByZWFkQmxvYihibG9iLCBjYWxsYmFjaykge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG4gICAgICBjYWxsYmFjayhlLnRhcmdldC5yZXN1bHQpO1xuICAgIH07XG4gICAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYik7XG4gIH1cblxuICAvLyBmaWxlIHNlbGVjdGlvblxuICBmdW5jdGlvbiBmaWxlU2VsZWN0SGFuZGxlcihlKSB7XG4gICAgLy8gY2FuY2VsIGV2ZW50IGFuZCBob3ZlciBzdHlsaW5nXG4gICAgZmlsZURyYWdIb3ZlcihlKTtcblxuICAgIHZhciBkcm9wcGVkRmlsZXMgPSBlLnRhcmdldC5maWxlcyB8fCBlLmRhdGFUcmFuc2Zlci5maWxlcztcblxuICAgIHZhciBmaWxlID0gZHJvcHBlZEZpbGVzWzBdO1xuICAgIGZpbGVOYW1lID0gZmlsZS5uYW1lO1xuXG4gICAgbW9kZWwuZ2V0RW50cmllcyhmaWxlLCBmdW5jdGlvbihlbnRyaWVzKSB7XG5cbiAgICAgIHZhciBwcm9taXNlcyA9IGVudHJpZXMubWFwKGZ1bmN0aW9uKGVudHJ5KSB7XG5cbiAgICAgICAgLy8gdG9kbzogdXNlIHByb21pc2VzXG4gICAgICAgIHN3aXRjaCAoZW50cnkuZmlsZW5hbWUpIHtcbiAgICAgICAgICBjYXNlICdTa2lsbHMuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgZW50cnkuZ2V0RGF0YShuZXcgemlwLkJsb2JXcml0ZXIoJ3RleHQvcGxhaW4nKSwgZnVuY3Rpb24oYmxvYikge1xuICAgICAgICAgICAgICAgIHJlYWRCbG9iKGJsb2IsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgICBjb250ZW50cyA9IGNvbnRlbnRzLnJlcGxhY2UoL1wiL2csICcnKTtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNvbnRlbnRzLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0xKTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NTa2lsbHMoZWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2FzZSAnRWR1Y2F0aW9uLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICByZWFkQmxvYihibG9iLCBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cyk7XG4gICAgICAgICAgICAgICAgICB2YXIgZWR1Y2F0aW9uID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkubWFwKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICBzY2hvb2xOYW1lOiBlbGVtWzBdLFxuICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0RGF0ZTogZWxlbVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICBlbmREYXRlOiBlbGVtWzJdLFxuICAgICAgICAgICAgICAgICAgICAgIG5vdGVzOiBlbGVtWzNdLFxuICAgICAgICAgICAgICAgICAgICAgIGRlZ3JlZTogZWxlbVs0XSxcbiAgICAgICAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBlbGVtWzVdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NFZHVjYXRpb24oZWR1Y2F0aW9uLnNvcnQoKGUxLGUyKSA9PlxuICAgICAgICAgICAgICAgICAgICAoK2UyLnN0YXJ0RGF0ZS55ZWFyIC0gK2UxLnN0YXJ0RGF0ZS55ZWFyKSB8fCAoK2UyLnN0YXJ0RGF0ZS5tb250aCAtICtlMS5zdGFydERhdGUubW9udGgpXG4gICAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNhc2UgJ1Bvc2l0aW9ucy5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMpO1xuICAgICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9ucyA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29tcGFueU5hbWU6IGVsZW1bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGVsZW1bMV0sXG4gICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246IGVsZW1bMl0sXG4gICAgICAgICAgICAgICAgICAgICAgc3RhcnREYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ZWFyOiBlbGVtWzNdLnNwbGl0KCcvJylbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aDogZWxlbVszXS5zcGxpdCgnLycpWzBdXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBlbmREYXRlOiBlbGVtWzRdID8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeWVhcjogZWxlbVs0XS5zcGxpdCgnLycpWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6IGVsZW1bNF0uc3BsaXQoJy8nKVswXVxuICAgICAgICAgICAgICAgICAgICAgIH0gOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBlbGVtWzVdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NQb3NpdGlvbihwb3NpdGlvbnMuc29ydCgocDEscDIpID0+IFxuICAgICAgICAgICAgICAgICAgICAoK3AyLnN0YXJ0RGF0ZS55ZWFyIC0gK3AxLnN0YXJ0RGF0ZS55ZWFyKSB8fCAoK3AyLnN0YXJ0RGF0ZS5tb250aCAtICtwMS5zdGFydERhdGUubW9udGgpXG4gICAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNhc2UgJ0xhbmd1YWdlcy5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMpO1xuICAgICAgICAgICAgICAgICAgdmFyIGxhbmd1YWdlcyA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogZWxlbVswXSxcbiAgICAgICAgICAgICAgICAgICAgICBwcm9maWNpZW5jeTogZWxlbVsxXVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzTGFuZ3VhZ2VzKGxhbmd1YWdlcyk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdSZWNvbW1lbmRhdGlvbnMgUmVjZWl2ZWQuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgZW50cnkuZ2V0RGF0YShuZXcgemlwLkJsb2JXcml0ZXIoJ3RleHQvcGxhaW4nKSwgZnVuY3Rpb24oYmxvYikge1xuICAgICAgICAgICAgICAgIHJlYWRCbG9iKGJsb2IsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBjc3ZUb0FycmF5KGNvbnRlbnRzLCAnXFx0Jyk7IC8vIHllcywgcmVjb21tZW5kYXRpb25zIHVzZSB0YWItZGVsaW1pdGVyXG4gICAgICAgICAgICAgICAgICB2YXIgcmVjb21tZW5kYXRpb25zID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkubWFwKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbkRhdGU6IGVsZW1bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25Cb2R5OiBlbGVtWzFdLFxuICAgICAgICAgICAgICAgICAgICAgIHJlY29tbWVuZGVyRmlyc3ROYW1lOiBlbGVtWzJdLFxuICAgICAgICAgICAgICAgICAgICAgIHJlY29tbWVuZGVyTGFzdE5hbWU6IGVsZW1bM10sXG4gICAgICAgICAgICAgICAgICAgICAgcmVjb21tZW5kZXJDb21wYW55OiBlbGVtWzRdLFxuICAgICAgICAgICAgICAgICAgICAgIHJlY29tbWVuZGVyVGl0bGU6IGVsZW1bNV0sXG4gICAgICAgICAgICAgICAgICAgICAgZGlzcGxheVN0YXR1czogZWxlbVs2XVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uKHJlY29tbWVuZGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNvbW1lbmRhdGlvbi5kaXNwbGF5U3RhdHVzID09PSAnU2hvd24nO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzUmVmZXJlbmNlcyhyZWNvbW1lbmRhdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2FzZSAnUHJvZmlsZS5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMpO1xuICAgICAgICAgICAgICAgICAgdmFyIHByb2ZpbGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0TmFtZTogZWxlbWVudHNbMV1bMF0sXG4gICAgICAgICAgICAgICAgICAgIGxhc3ROYW1lOiBlbGVtZW50c1sxXVsxXSxcbiAgICAgICAgICAgICAgICAgICAgbWFpZGVuTmFtZTogZWxlbWVudHNbMV1bMl0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZWREYXRlOiBlbGVtZW50c1sxXVszXSxcbiAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogZWxlbWVudHNbMV1bNF0sXG4gICAgICAgICAgICAgICAgICAgIGJpcnRoRGF0ZTogZWxlbWVudHNbMV1bNV0sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhY3RJbnN0cnVjdGlvbnM6IGVsZW1lbnRzWzFdWzZdLFxuICAgICAgICAgICAgICAgICAgICBtYXJpdGFsU3RhdHVzOiBlbGVtZW50c1sxXVs3XSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGxpbmU6IGVsZW1lbnRzWzFdWzhdLFxuICAgICAgICAgICAgICAgICAgICBzdW1tYXJ5OiBlbGVtZW50c1sxXVs5XSxcbiAgICAgICAgICAgICAgICAgICAgaW5kdXN0cnk6IGVsZW1lbnRzWzFdWzEwXSxcbiAgICAgICAgICAgICAgICAgICAgYXNzb2NpYXRpb246IGVsZW1lbnRzWzFdWzExXVxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NQcm9maWxlKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjYXNlICdFbWFpbCBBZGRyZXNzZXMuY3N2JzpcbiAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICAgIHJlYWRCbG9iKGJsb2IsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMsICdcXHQnKTsgLy8geWVzLCByZWNvbW1lbmRhdGlvbnMgdXNlIHRhYi1kZWxpbWl0ZXJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVtYWlsID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkubWFwKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogZWxlbVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZWxlbVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUHJpbWFyeTogZWxlbVsyXSA9PSAnWWVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGVBZGRlZDogZWxlbVszXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGVSZW1vdmVkOiBlbGVtWzRdXG4gICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSkuZmlsdGVyKGVtYWlsID0+IGVtYWlsLmlzUHJpbWFyeSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbWFpbC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzRW1haWwoZW1haWxbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgZmlsZWRyYWcuaW5uZXJIVE1MID0gJ0Ryb3BwZWQhIFNlZSB0aGUgcmVzdWx0aW5nIEpTT04gUmVzdW1lIGF0IHRoZSBib3R0b20uJztcbiAgICAgICAgdmFyIG91dHB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdXRwdXQnKTtcbiAgICAgICAgb3V0cHV0LmlubmVySFRNTCA9IEpTT04uc3RyaW5naWZ5KGxpbmtlZGluVG9Kc29uUmVzdW1lLmdldE91dHB1dCgpLCB1bmRlZmluZWQsIDIpO1xuICAgICAgICBQcmlzbS5oaWdobGlnaHRFbGVtZW50KG91dHB1dCk7XG4gICAgICAgIGRvd25sb2FkQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0Jykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9XG5cbn0pKCk7XG4iXX0=
