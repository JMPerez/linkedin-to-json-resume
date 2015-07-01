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
      console.log(source);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9jbGVtc29zL0Rldi9jbGVtZW50cmVuYXVkLmNvbS9saW5rZWRpbi10by1qc29uLXJlc3VtZS9qcy9jb252ZXJ0ZXIuanMiLCIvaG9tZS9jbGVtc29zL0Rldi9jbGVtZW50cmVuYXVkLmNvbS9saW5rZWRpbi10by1qc29uLXJlc3VtZS9qcy9jc3Z0b2FycmF5LmpzIiwiL2hvbWUvY2xlbXNvcy9EZXYvY2xlbWVudHJlbmF1ZC5jb20vbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvZmlsZS5qcyIsIi9ob21lL2NsZW1zb3MvRGV2L2NsZW1lbnRyZW5hdWQuY29tL2xpbmtlZGluLXRvLWpzb24tcmVzdW1lL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDSU0sb0JBQW9CO0FBQ2IsV0FEUCxvQkFBb0IsR0FDVjswQkFEVixvQkFBb0I7O0FBRXRCLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0dBQ2xCOztlQUhHLG9CQUFvQjs7V0FLZixxQkFBRzs7QUFFVixVQUFJLGFBQWEsR0FBRyxDQUNsQixRQUFRLEVBQ1IsTUFBTSxFQUNOLFdBQVcsRUFDWCxXQUFXLEVBQ1gsUUFBUSxFQUNSLGNBQWMsRUFDZCxRQUFRLEVBQ1IsV0FBVyxFQUNYLFdBQVcsRUFDWCxZQUFZLENBQ2IsQ0FBQzs7QUFFRixVQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7Ozs7OztBQUN0Qiw2QkFBYyxhQUFhLDhIQUFFO2NBQXBCLENBQUM7O0FBQ1IsY0FBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNwQix3QkFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7V0FDbEM7U0FDRjs7Ozs7Ozs7Ozs7Ozs7OztBQUNELGFBQU8sWUFBWSxDQUFD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YUFDSixDQUFDLENBQUM7QUFBQSxBQUNQO0FBQ0UsbUJBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUFBLFNBQzlCO09BQ0YsQ0FBQyxDQUFDOztBQUVILGFBQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVc7QUFDcEMsZ0JBQVEsQ0FBQyxTQUFTLEdBQUcsdURBQXVELENBQUM7QUFDN0UsWUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQyxjQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsU0FBUyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xGLGFBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvQixzQkFBYyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZDLGdCQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO09BQzNELENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUVKO0NBRUYsQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIG1vZHVsZSAqL1xuLyogZXhwb3J0ZWQgb25MaW5rZWRJbkxvYWQgKi9cblxuLy8gdG9kbzogaW1wb3J0IHB1YmxpY2F0aW9ucywgYXdhcmRzLCB2b2x1bnRlZXJcbmNsYXNzIExpbmtlZEluVG9Kc29uUmVzdW1lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50YXJnZXQgPSB7fTtcbiAgfVxuXG4gIGdldE91dHB1dCgpIHtcbiAgICAvLyBzb3J0IHRoZSBvYmplY3RcbiAgICB2YXIgcHJvcGVydHlPcmRlciA9IFtcbiAgICAgICdiYXNpY3MnLFxuICAgICAgJ3dvcmsnLFxuICAgICAgJ3ZvbHVudGVlcicsXG4gICAgICAnZWR1Y2F0aW9uJyxcbiAgICAgICdhd2FyZHMnLFxuICAgICAgJ3B1YmxpY2F0aW9ucycsXG4gICAgICAnc2tpbGxzJyxcbiAgICAgICdsYW5ndWFnZXMnLFxuICAgICAgJ2ludGVyZXN0cycsXG4gICAgICAncmVmZXJlbmNlcydcbiAgICBdO1xuXG4gICAgdmFyIHNvcnRlZFRhcmdldCA9IHt9O1xuICAgIGZvciAodmFyIHAgb2YgcHJvcGVydHlPcmRlcikge1xuICAgICAgaWYgKHAgaW4gdGhpcy50YXJnZXQpIHtcbiAgICAgICAgc29ydGVkVGFyZ2V0W3BdID0gdGhpcy50YXJnZXRbcF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzb3J0ZWRUYXJnZXQ7XG4gIH1cblxuICBfZXh0ZW5kKHRhcmdldCwgc291cmNlKSB7XG4gICAgdGFyZ2V0ID0gdGFyZ2V0IHx8IHt9O1xuICAgIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChrZXkgPT4gdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XSk7XG4gIH1cblxuICBwcm9jZXNzUHJvZmlsZShzb3VyY2UpIHtcbiAgICB0aGlzLnRhcmdldC5iYXNpY3MgPSB0aGlzLnRhcmdldC5iYXNpY3MgfHwge307XG4gICAgY29uc29sZS5sb2coc291cmNlKTtcbiAgICB0aGlzLl9leHRlbmQodGhpcy50YXJnZXQuYmFzaWNzLCB7XG4gICAgICBuYW1lOiBzb3VyY2UuZmlyc3ROYW1lICsgJyAnICsgc291cmNlLmxhc3ROYW1lLFxuICAgICAgbGFiZWw6IHNvdXJjZS5oZWFkbGluZSxcbiAgICAgIHBpY3R1cmU6IHNvdXJjZS5waWN0dXJlVXJsLFxuICAgICAgcGhvbmU6IHNvdXJjZS5waG9uZU51bWJlcnMgJiYgc291cmNlLnBob25lTnVtYmVycy5fdG90YWwgPyBzb3VyY2UucGhvbmVOdW1iZXJzLnZhbHVlc1swXS5waG9uZU51bWJlciA6ICcnLFxuICAgICAgd2Vic2l0ZTogJycsXG4gICAgICBzdW1tYXJ5OiBzb3VyY2Uuc3VtbWFyeSxcbiAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIGFkZHJlc3M6IHNvdXJjZS5hZGRyZXNzLFxuICAgICAgICBwb3N0YWxDb2RlOiAnJyxcbiAgICAgICAgY2l0eTogc291cmNlLmxvY2F0aW9uID8gc291cmNlLmxvY2F0aW9uLm5hbWUgOiAnJyxcbiAgICAgICAgY291bnRyeUNvZGU6IHNvdXJjZS5sb2NhdGlvbiA/IHNvdXJjZS5sb2NhdGlvbi5jb3VudHJ5LmNvZGUudG9VcHBlckNhc2UoKSA6ICcnLFxuICAgICAgICByZWdpb246ICcnXG4gICAgICB9LFxuICAgICAgcHJvZmlsZXM6IFtdXG4gICAgfSk7XG4gIH1cblxuICBwcm9jZXNzRW1haWwoc291cmNlKSB7XG4gICAgdGhpcy50YXJnZXQuYmFzaWNzID0gdGhpcy50YXJnZXQuYmFzaWNzIHx8IHt9O1xuICAgIHRoaXMuX2V4dGVuZCh0aGlzLnRhcmdldC5iYXNpY3MsIHsnZW1haWwnOiBzb3VyY2UuYWRkcmVzc30pO1xuICB9XG5cbiAgcHJvY2Vzc1Bvc2l0aW9uKHNvdXJjZSkge1xuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc1Bvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgICBsZXQgb2JqZWN0ID0ge1xuICAgICAgICBjb21wYW55OiBwb3NpdGlvbi5jb21wYW55TmFtZSxcbiAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLnRpdGxlIHx8ICcnLFxuICAgICAgICB3ZWJzaXRlOiAnJyxcbiAgICAgICAgc3RhcnREYXRlOiBwb3NpdGlvbi5zdGFydERhdGUueWVhciArICctJyArIChwb3NpdGlvbi5zdGFydERhdGUubW9udGggPCAxMCA/ICcwJyA6ICcnKSArIHBvc2l0aW9uLnN0YXJ0RGF0ZS5tb250aCArICctMDEnLFxuICAgICAgICBzdW1tYXJ5OiBwb3NpdGlvbi5kZXNjcmlwdGlvbixcbiAgICAgICAgaGlnaGxpZ2h0czogW11cbiAgICAgIH07XG5cbiAgICAgIGlmIChwb3NpdGlvbi5lbmREYXRlKSB7XG4gICAgICAgIG9iamVjdC5lbmREYXRlID0gcG9zaXRpb24uZW5kRGF0ZS55ZWFyICsgJy0nICsgKHBvc2l0aW9uLmVuZERhdGUubW9udGggPCAxMCA/ICcwJyA6ICcnKSArIHBvc2l0aW9uLmVuZERhdGUubW9udGggKyAnLTAxJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICB0aGlzLnRhcmdldC53b3JrID0gc291cmNlLm1hcChwcm9jZXNzUG9zaXRpb24pO1xuICB9XG5cbiAgcHJvY2Vzc0VkdWNhdGlvbihzb3VyY2UpIHtcblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NFZHVjYXRpb24oZWR1Y2F0aW9uKSB7XG4gICAgICBsZXQgb2JqZWN0ID0ge1xuICAgICAgICBpbnN0aXR1dGlvbjogZWR1Y2F0aW9uLnNjaG9vbE5hbWUsXG4gICAgICAgIGFyZWE6ICcnLFxuICAgICAgICBzdHVkeVR5cGU6IGVkdWNhdGlvbi5kZWdyZWUsXG4gICAgICAgIHN0YXJ0RGF0ZTogJycgKyBlZHVjYXRpb24uc3RhcnREYXRlICsgJy0wMS0wMScsXG4gICAgICAgIGdwYTogJycsXG4gICAgICAgIGNvdXJzZXM6IFtdXG4gICAgICB9O1xuXG4gICAgICBpZiAoZWR1Y2F0aW9uLmVuZERhdGUpIHtcbiAgICAgICAgb2JqZWN0LmVuZERhdGUgPSBlZHVjYXRpb24uZW5kRGF0ZSArICctMDEtMDEnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIHRoaXMudGFyZ2V0LmVkdWNhdGlvbiA9IHNvdXJjZS5tYXAocHJvY2Vzc0VkdWNhdGlvbik7XG4gIH1cblxuICBwcm9jZXNzU2tpbGxzKHNraWxscykge1xuXG4gICAgdGhpcy50YXJnZXQuc2tpbGxzID0gc2tpbGxzLm1hcChza2lsbCA9PiAoe1xuICAgICAgICBuYW1lOiBza2lsbCxcbiAgICAgICAgbGV2ZWw6ICcnLFxuICAgICAgICBrZXl3b3JkczogW11cbiAgICAgIH0pKTtcbiAgfVxuXG4gIHByb2Nlc3NMYW5ndWFnZXMoc291cmNlKSB7XG5cbiAgICBmdW5jdGlvbiBjbGVhblByb2ZpY2llbmN5U3RyaW5nKHByb2ZpY2llbmN5KSB7XG4gICAgICBwcm9maWNpZW5jeSA9IHByb2ZpY2llbmN5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXy9nLCAnICcpO1xuICAgICAgcmV0dXJuIHByb2ZpY2llbmN5WzBdLnRvVXBwZXJDYXNlKCkgKyBwcm9maWNpZW5jeS5zdWJzdHIoMSk7XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXQubGFuZ3VhZ2VzID0gc291cmNlLm1hcChsYW5ndWFnZSA9PiAoe1xuICAgICAgbGFuZ3VhZ2U6IGxhbmd1YWdlLm5hbWUsXG4gICAgICBmbHVlbmN5OiBjbGVhblByb2ZpY2llbmN5U3RyaW5nKGxhbmd1YWdlLnByb2ZpY2llbmN5KVxuICAgIH0pKTtcbiAgfVxuXG4gIHByb2Nlc3NSZWZlcmVuY2VzKHNvdXJjZSkge1xuXG4gICAgdGhpcy50YXJnZXQucmVmZXJlbmNlcyA9IHNvdXJjZS5tYXAocmVmZXJlbmNlID0+ICh7XG4gICAgICBuYW1lOiByZWZlcmVuY2UucmVjb21tZW5kZXJGaXJzdE5hbWUgKyAnICcgKyByZWZlcmVuY2UucmVjb21tZW5kZXJMYXN0TmFtZSxcbiAgICAgIHJlZmVyZW5jZTogcmVmZXJlbmNlLnJlY29tbWVuZGF0aW9uQm9keVxuICAgIH0pKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmtlZEluVG9Kc29uUmVzdW1lO1xuIiwiLy8gcmVmOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMjkzMTYzLzIzNDNcbi8vIFRoaXMgd2lsbCBwYXJzZSBhIGRlbGltaXRlZCBzdHJpbmcgaW50byBhbiBhcnJheSBvZlxuLy8gYXJyYXlzLiBUaGUgZGVmYXVsdCBkZWxpbWl0ZXIgaXMgdGhlIGNvbW1hLCBidXQgdGhpc1xuLy8gY2FuIGJlIG92ZXJyaWRlbiBpbiB0aGUgc2Vjb25kIGFyZ3VtZW50LlxuZnVuY3Rpb24gQ1NWVG9BcnJheSggc3RyRGF0YSwgc3RyRGVsaW1pdGVyICl7XG4gICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBkZWxpbWl0ZXIgaXMgZGVmaW5lZC4gSWYgbm90LFxuICAgIC8vIHRoZW4gZGVmYXVsdCB0byBjb21tYS5cbiAgICBzdHJEZWxpbWl0ZXIgPSAoc3RyRGVsaW1pdGVyIHx8IFwiLFwiKTtcblxuICAgIC8vIENyZWF0ZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBwYXJzZSB0aGUgQ1NWIHZhbHVlcy5cbiAgICB2YXIgb2JqUGF0dGVybiA9IG5ldyBSZWdFeHAoXG4gICAgICAgIChcbiAgICAgICAgICAgIC8vIERlbGltaXRlcnMuXG4gICAgICAgICAgICBcIihcXFxcXCIgKyBzdHJEZWxpbWl0ZXIgKyBcInxcXFxccj9cXFxcbnxcXFxccnxeKVwiICtcblxuICAgICAgICAgICAgLy8gUXVvdGVkIGZpZWxkcy5cbiAgICAgICAgICAgIFwiKD86XFxcIihbXlxcXCJdKig/OlxcXCJcXFwiW15cXFwiXSopKilcXFwifFwiICtcblxuICAgICAgICAgICAgLy8gU3RhbmRhcmQgZmllbGRzLlxuICAgICAgICAgICAgXCIoW15cXFwiXFxcXFwiICsgc3RyRGVsaW1pdGVyICsgXCJcXFxcclxcXFxuXSopKVwiXG4gICAgICAgICksXG4gICAgICAgIFwiZ2lcIlxuICAgICAgICApO1xuXG5cbiAgICAvLyBDcmVhdGUgYW4gYXJyYXkgdG8gaG9sZCBvdXIgZGF0YS4gR2l2ZSB0aGUgYXJyYXlcbiAgICAvLyBhIGRlZmF1bHQgZW1wdHkgZmlyc3Qgcm93LlxuICAgIHZhciBhcnJEYXRhID0gW1tdXTtcblxuICAgIC8vIENyZWF0ZSBhbiBhcnJheSB0byBob2xkIG91ciBpbmRpdmlkdWFsIHBhdHRlcm5cbiAgICAvLyBtYXRjaGluZyBncm91cHMuXG4gICAgdmFyIGFyck1hdGNoZXMgPSBudWxsO1xuXG5cbiAgICAvLyBLZWVwIGxvb3Bpbmcgb3ZlciB0aGUgcmVndWxhciBleHByZXNzaW9uIG1hdGNoZXNcbiAgICAvLyB1bnRpbCB3ZSBjYW4gbm8gbG9uZ2VyIGZpbmQgYSBtYXRjaC5cbiAgICB3aGlsZSAoYXJyTWF0Y2hlcyA9IG9ialBhdHRlcm4uZXhlYyggc3RyRGF0YSApKXtcblxuICAgICAgICAvLyBHZXQgdGhlIGRlbGltaXRlciB0aGF0IHdhcyBmb3VuZC5cbiAgICAgICAgdmFyIHN0ck1hdGNoZWREZWxpbWl0ZXIgPSBhcnJNYXRjaGVzWyAxIF07XG5cbiAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBnaXZlbiBkZWxpbWl0ZXIgaGFzIGEgbGVuZ3RoXG4gICAgICAgIC8vIChpcyBub3QgdGhlIHN0YXJ0IG9mIHN0cmluZykgYW5kIGlmIGl0IG1hdGNoZXNcbiAgICAgICAgLy8gZmllbGQgZGVsaW1pdGVyLiBJZiBpZCBkb2VzIG5vdCwgdGhlbiB3ZSBrbm93XG4gICAgICAgIC8vIHRoYXQgdGhpcyBkZWxpbWl0ZXIgaXMgYSByb3cgZGVsaW1pdGVyLlxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBzdHJNYXRjaGVkRGVsaW1pdGVyLmxlbmd0aCAmJlxuICAgICAgICAgICAgc3RyTWF0Y2hlZERlbGltaXRlciAhPT0gc3RyRGVsaW1pdGVyXG4gICAgICAgICAgICApe1xuXG4gICAgICAgICAgICAvLyBTaW5jZSB3ZSBoYXZlIHJlYWNoZWQgYSBuZXcgcm93IG9mIGRhdGEsXG4gICAgICAgICAgICAvLyBhZGQgYW4gZW1wdHkgcm93IHRvIG91ciBkYXRhIGFycmF5LlxuICAgICAgICAgICAgYXJyRGF0YS5wdXNoKCBbXSApO1xuXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RyTWF0Y2hlZFZhbHVlO1xuXG4gICAgICAgIC8vIE5vdyB0aGF0IHdlIGhhdmUgb3VyIGRlbGltaXRlciBvdXQgb2YgdGhlIHdheSxcbiAgICAgICAgLy8gbGV0J3MgY2hlY2sgdG8gc2VlIHdoaWNoIGtpbmQgb2YgdmFsdWUgd2VcbiAgICAgICAgLy8gY2FwdHVyZWQgKHF1b3RlZCBvciB1bnF1b3RlZCkuXG4gICAgICAgIGlmIChhcnJNYXRjaGVzWyAyIF0pe1xuXG4gICAgICAgICAgICAvLyBXZSBmb3VuZCBhIHF1b3RlZCB2YWx1ZS4gV2hlbiB3ZSBjYXB0dXJlXG4gICAgICAgICAgICAvLyB0aGlzIHZhbHVlLCB1bmVzY2FwZSBhbnkgZG91YmxlIHF1b3Rlcy5cbiAgICAgICAgICAgIHN0ck1hdGNoZWRWYWx1ZSA9IGFyck1hdGNoZXNbIDIgXS5yZXBsYWNlKFxuICAgICAgICAgICAgICAgIG5ldyBSZWdFeHAoIFwiXFxcIlxcXCJcIiwgXCJnXCIgKSxcbiAgICAgICAgICAgICAgICBcIlxcXCJcIlxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8gV2UgZm91bmQgYSBub24tcXVvdGVkIHZhbHVlLlxuICAgICAgICAgICAgc3RyTWF0Y2hlZFZhbHVlID0gYXJyTWF0Y2hlc1sgMyBdO1xuXG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIE5vdyB0aGF0IHdlIGhhdmUgb3VyIHZhbHVlIHN0cmluZywgbGV0J3MgYWRkXG4gICAgICAgIC8vIGl0IHRvIHRoZSBkYXRhIGFycmF5LlxuICAgICAgICBhcnJEYXRhWyBhcnJEYXRhLmxlbmd0aCAtIDEgXS5wdXNoKCBzdHJNYXRjaGVkVmFsdWUgPyBzdHJNYXRjaGVkVmFsdWUudHJpbSgpIDogc3RyTWF0Y2hlZFZhbHVlICk7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBwYXJzZWQgZGF0YS5cbiAgICByZXR1cm4oIGFyckRhdGEgKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gQ1NWVG9BcnJheTsiLCIvKiBnbG9iYWwgVVJMLCBCbG9iLCBtb2R1bGUgKi9cbi8qIGV4cG9ydGVkIHNhdmUgKi9cbnZhciBzYXZlID0gKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gc2F2ZUFzIGZyb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vTXJTd2l0Y2gvMzU1Mjk4NVxuICB2YXIgc2F2ZUFzID0gd2luZG93LnNhdmVBcyB8fCAod2luZG93Lm5hdmlnYXRvci5tc1NhdmVCbG9iID8gZnVuY3Rpb24gKGIsIG4pIHtcbiAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZUJsb2IoYiwgbik7XG4gICAgfSA6IGZhbHNlKSB8fCB3aW5kb3cud2Via2l0U2F2ZUFzIHx8IHdpbmRvdy5tb3pTYXZlQXMgfHwgd2luZG93Lm1zU2F2ZUFzIHx8IChmdW5jdGlvbiAoKSB7XG5cbiAgICAgIC8vIFVSTCdzXG4gICAgICB3aW5kb3cuVVJMID0gd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMO1xuXG4gICAgICBpZiAoIXdpbmRvdy5VUkwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGJsb2IsIG5hbWUpIHtcbiAgICAgICAgdmFyIHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cbiAgICAgICAgLy8gVGVzdCBmb3IgZG93bmxvYWQgbGluayBzdXBwb3J0XG4gICAgICAgIGlmICgnZG93bmxvYWQnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSkge1xuXG4gICAgICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB1cmwpO1xuICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIG5hbWUpO1xuXG4gICAgICAgICAgLy8gQ3JlYXRlIENsaWNrIGV2ZW50XG4gICAgICAgICAgdmFyIGNsaWNrRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnTW91c2VFdmVudCcpO1xuICAgICAgICAgIGNsaWNrRXZlbnQuaW5pdE1vdXNlRXZlbnQoJ2NsaWNrJywgdHJ1ZSwgdHJ1ZSwgd2luZG93LCAwLFxuICAgICAgICAgICAgMCwgMCwgMCwgMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIG51bGwpO1xuXG4gICAgICAgICAgLy8gZGlzcGF0Y2ggY2xpY2sgZXZlbnQgdG8gc2ltdWxhdGUgZG93bmxvYWRcbiAgICAgICAgICBhLmRpc3BhdGNoRXZlbnQoY2xpY2tFdmVudCk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBmYWxsb3Zlciwgb3BlbiByZXNvdXJjZSBpbiBuZXcgdGFiLlxuICAgICAgICAgIHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycsICcnKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KSgpO1xuXG4gIGZ1bmN0aW9uIF9zYXZlICh0ZXh0LCBmaWxlTmFtZSkge1xuICAgIHZhciBibG9iID0gbmV3IEJsb2IoW3RleHRdLCB7XG4gICAgICB0eXBlOiAndGV4dC9wbGFpbidcbiAgICB9KTtcbiAgICBzYXZlQXMoYmxvYiwgZmlsZU5hbWUgfHwgJ3N1YnRpdGxlLnNydCcpO1xuICB9XG5cbiAgcmV0dXJuIF9zYXZlO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNhdmU7IiwiLyogZ2xvYmFsIHppcCwgY3JlYXRlVGVtcEZpbGUsIFByaXNtICovXG5cbmltcG9ydCBMaW5rZWRJblRvSnNvblJlc3VtZSBmcm9tICcuL2NvbnZlcnRlci5qcyc7XG5pbXBvcnQgY3N2VG9BcnJheSBmcm9tICcuL2NzdnRvYXJyYXkuanMnO1xuaW1wb3J0IHNhdmUgZnJvbSAnLi9maWxlLmpzJztcblxuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGxpbmtlZGluVG9Kc29uUmVzdW1lID0gbmV3IExpbmtlZEluVG9Kc29uUmVzdW1lKCk7XG5cbiAgdmFyIGRvd25sb2FkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRvd25sb2FkJyk7XG4gIGRvd25sb2FkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgc2F2ZShKU09OLnN0cmluZ2lmeShsaW5rZWRpblRvSnNvblJlc3VtZS5nZXRPdXRwdXQoKSwgdW5kZWZpbmVkLCAyKSwgJ3Jlc3VtZS5qc29uJyk7XG4gIH0pO1xuICBkb3dubG9hZEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gIHZhciBmaWxlZHJhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlZHJhZycpLFxuICAgICAgZmlsZXNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlc2VsZWN0JyksXG4gICAgICBmaWxlTmFtZSA9IG51bGw7XG4gICAvLyBmaWxlIHNlbGVjdFxuICBmaWxlc2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZpbGVTZWxlY3RIYW5kbGVyLCBmYWxzZSk7XG5cbiAgLy8gZmlsZSBkcmFnIGhvdmVyXG4gIGZ1bmN0aW9uIGZpbGVEcmFnSG92ZXIoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUudGFyZ2V0LmNsYXNzTmFtZSA9IChlLnR5cGUgPT09ICdkcmFnb3ZlcicgPyAnaG92ZXInIDogJycpO1xuICB9XG5cbiAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICBpZiAoeGhyLnVwbG9hZCkge1xuICAgIC8vIGZpbGUgZHJvcFxuICAgIGZpbGVkcmFnLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZmlsZURyYWdIb3ZlciwgZmFsc2UpO1xuICAgIGZpbGVkcmFnLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGZpbGVEcmFnSG92ZXIsIGZhbHNlKTtcbiAgICBmaWxlZHJhZy5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZmlsZVNlbGVjdEhhbmRsZXIsIGZhbHNlKTtcbiAgICBmaWxlZHJhZy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgfSBlbHNlIHtcbiAgICBmaWxlZHJhZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9XG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdC1maWxlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgZmlsZXNlbGVjdC5jbGljaygpO1xuICB9KTtcblxuICB2YXIgbW9kZWwgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIFVSTCA9IHdpbmRvdy53ZWJraXRVUkwgfHwgd2luZG93Lm1velVSTCB8fCB3aW5kb3cuVVJMO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldEVudHJpZXMgOiBmdW5jdGlvbihmaWxlLCBvbmVuZCkge1xuICAgICAgICB6aXAuY3JlYXRlUmVhZGVyKG5ldyB6aXAuQmxvYlJlYWRlcihmaWxlKSwgZnVuY3Rpb24oemlwUmVhZGVyKSB7XG4gICAgICAgICAgemlwUmVhZGVyLmdldEVudHJpZXMob25lbmQpO1xuICAgICAgICB9LCBvbmVycm9yKTtcbiAgICAgIH0sXG4gICAgICBnZXRFbnRyeUZpbGUgOiBmdW5jdGlvbihlbnRyeSwgY3JlYXRpb25NZXRob2QsIG9uZW5kLCBvbnByb2dyZXNzKSB7XG4gICAgICAgIHZhciB3cml0ZXIsIHppcEZpbGVFbnRyeTtcblxuICAgICAgICBmdW5jdGlvbiBnZXREYXRhKCkge1xuICAgICAgICAgIGVudHJ5LmdldERhdGEod3JpdGVyLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICB2YXIgYmxvYlVSTCA9IGNyZWF0aW9uTWV0aG9kID09PSAnQmxvYicgPyBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpIDogemlwRmlsZUVudHJ5LnRvVVJMKCk7XG4gICAgICAgICAgICBvbmVuZChibG9iVVJMKTtcbiAgICAgICAgICB9LCBvbnByb2dyZXNzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjcmVhdGlvbk1ldGhvZCA9PT0gJ0Jsb2InKSB7XG4gICAgICAgICAgd3JpdGVyID0gbmV3IHppcC5CbG9iV3JpdGVyKCk7XG4gICAgICAgICAgZ2V0RGF0YSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNyZWF0ZVRlbXBGaWxlKGZ1bmN0aW9uKGZpbGVFbnRyeSkge1xuICAgICAgICAgICAgemlwRmlsZUVudHJ5ID0gZmlsZUVudHJ5O1xuICAgICAgICAgICAgd3JpdGVyID0gbmV3IHppcC5GaWxlV3JpdGVyKHppcEZpbGVFbnRyeSk7XG4gICAgICAgICAgICBnZXREYXRhKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9KSgpO1xuXG4gIHppcC53b3JrZXJTY3JpcHRzUGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArICd2ZW5kb3IvJztcblxuICBmdW5jdGlvbiByZWFkQmxvYihibG9iLCBjYWxsYmFjaykge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG4gICAgICBjYWxsYmFjayhlLnRhcmdldC5yZXN1bHQpO1xuICAgIH07XG4gICAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYik7XG4gIH1cblxuICAvLyBmaWxlIHNlbGVjdGlvblxuICBmdW5jdGlvbiBmaWxlU2VsZWN0SGFuZGxlcihlKSB7XG4gICAgLy8gY2FuY2VsIGV2ZW50IGFuZCBob3ZlciBzdHlsaW5nXG4gICAgZmlsZURyYWdIb3ZlcihlKTtcblxuICAgIHZhciBkcm9wcGVkRmlsZXMgPSBlLnRhcmdldC5maWxlcyB8fCBlLmRhdGFUcmFuc2Zlci5maWxlcztcblxuICAgIHZhciBmaWxlID0gZHJvcHBlZEZpbGVzWzBdO1xuICAgIGZpbGVOYW1lID0gZmlsZS5uYW1lO1xuXG4gICAgbW9kZWwuZ2V0RW50cmllcyhmaWxlLCBmdW5jdGlvbihlbnRyaWVzKSB7XG5cbiAgICAgIHZhciBwcm9taXNlcyA9IGVudHJpZXMubWFwKGZ1bmN0aW9uKGVudHJ5KSB7XG5cbiAgICAgICAgLy8gdG9kbzogdXNlIHByb21pc2VzXG4gICAgICAgIHN3aXRjaCAoZW50cnkuZmlsZW5hbWUpIHtcbiAgICAgICAgICBjYXNlICdTa2lsbHMuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgZW50cnkuZ2V0RGF0YShuZXcgemlwLkJsb2JXcml0ZXIoJ3RleHQvcGxhaW4nKSwgZnVuY3Rpb24oYmxvYikge1xuICAgICAgICAgICAgICAgIHJlYWRCbG9iKGJsb2IsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgICBjb250ZW50cyA9IGNvbnRlbnRzLnJlcGxhY2UoL1wiL2csICcnKTtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNvbnRlbnRzLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0xKTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NTa2lsbHMoZWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2FzZSAnRWR1Y2F0aW9uLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICByZWFkQmxvYihibG9iLCBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cyk7XG4gICAgICAgICAgICAgICAgICB2YXIgZWR1Y2F0aW9uID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkubWFwKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICBzY2hvb2xOYW1lOiBlbGVtWzBdLFxuICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0RGF0ZTogZWxlbVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICBlbmREYXRlOiBlbGVtWzJdLFxuICAgICAgICAgICAgICAgICAgICAgIG5vdGVzOiBlbGVtWzNdLFxuICAgICAgICAgICAgICAgICAgICAgIGRlZ3JlZTogZWxlbVs0XSxcbiAgICAgICAgICAgICAgICAgICAgICBhY3Rpdml0aWVzOiBlbGVtWzVdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NFZHVjYXRpb24oZWR1Y2F0aW9uLnNvcnQoKGUxLGUyKSA9PlxuICAgICAgICAgICAgICAgICAgICAoK2UyLnN0YXJ0RGF0ZS55ZWFyIC0gK2UxLnN0YXJ0RGF0ZS55ZWFyKSB8fCAoK2UyLnN0YXJ0RGF0ZS5tb250aCAtICtlMS5zdGFydERhdGUubW9udGgpXG4gICAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNhc2UgJ1Bvc2l0aW9ucy5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMpO1xuICAgICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9ucyA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29tcGFueU5hbWU6IGVsZW1bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGVsZW1bMV0sXG4gICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246IGVsZW1bMl0sXG4gICAgICAgICAgICAgICAgICAgICAgc3RhcnREYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ZWFyOiBlbGVtWzNdLnNwbGl0KCcvJylbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aDogZWxlbVszXS5zcGxpdCgnLycpWzBdXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBlbmREYXRlOiBlbGVtWzRdID8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeWVhcjogZWxlbVs0XS5zcGxpdCgnLycpWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6IGVsZW1bNF0uc3BsaXQoJy8nKVswXVxuICAgICAgICAgICAgICAgICAgICAgIH0gOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBlbGVtWzVdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NQb3NpdGlvbihwb3NpdGlvbnMuc29ydCgocDEscDIpID0+IFxuICAgICAgICAgICAgICAgICAgICAoK3AyLnN0YXJ0RGF0ZS55ZWFyIC0gK3AxLnN0YXJ0RGF0ZS55ZWFyKSB8fCAoK3AyLnN0YXJ0RGF0ZS5tb250aCAtICtwMS5zdGFydERhdGUubW9udGgpXG4gICAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNhc2UgJ0xhbmd1YWdlcy5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMpO1xuICAgICAgICAgICAgICAgICAgdmFyIGxhbmd1YWdlcyA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogZWxlbVswXSxcbiAgICAgICAgICAgICAgICAgICAgICBwcm9maWNpZW5jeTogZWxlbVsxXVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzTGFuZ3VhZ2VzKGxhbmd1YWdlcyk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdSZWNvbW1lbmRhdGlvbnMgUmVjZWl2ZWQuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgZW50cnkuZ2V0RGF0YShuZXcgemlwLkJsb2JXcml0ZXIoJ3RleHQvcGxhaW4nKSwgZnVuY3Rpb24oYmxvYikge1xuICAgICAgICAgICAgICAgIHJlYWRCbG9iKGJsb2IsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBjc3ZUb0FycmF5KGNvbnRlbnRzLCAnXFx0Jyk7IC8vIHllcywgcmVjb21tZW5kYXRpb25zIHVzZSB0YWItZGVsaW1pdGVyXG4gICAgICAgICAgICAgICAgICB2YXIgcmVjb21tZW5kYXRpb25zID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkubWFwKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbkRhdGU6IGVsZW1bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25Cb2R5OiBlbGVtWzFdLFxuICAgICAgICAgICAgICAgICAgICAgIHJlY29tbWVuZGVyRmlyc3ROYW1lOiBlbGVtWzJdLFxuICAgICAgICAgICAgICAgICAgICAgIHJlY29tbWVuZGVyTGFzdE5hbWU6IGVsZW1bM10sXG4gICAgICAgICAgICAgICAgICAgICAgcmVjb21tZW5kZXJDb21wYW55OiBlbGVtWzRdLFxuICAgICAgICAgICAgICAgICAgICAgIHJlY29tbWVuZGVyVGl0bGU6IGVsZW1bNV0sXG4gICAgICAgICAgICAgICAgICAgICAgZGlzcGxheVN0YXR1czogZWxlbVs2XVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uKHJlY29tbWVuZGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNvbW1lbmRhdGlvbi5kaXNwbGF5U3RhdHVzID09PSAnU2hvd24nO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzUmVmZXJlbmNlcyhyZWNvbW1lbmRhdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2FzZSAnUHJvZmlsZS5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMpO1xuICAgICAgICAgICAgICAgICAgdmFyIHByb2ZpbGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0TmFtZTogZWxlbWVudHNbMV1bMF0sXG4gICAgICAgICAgICAgICAgICAgIGxhc3ROYW1lOiBlbGVtZW50c1sxXVsxXSxcbiAgICAgICAgICAgICAgICAgICAgbWFpZGVuTmFtZTogZWxlbWVudHNbMV1bMl0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZWREYXRlOiBlbGVtZW50c1sxXVszXSxcbiAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogZWxlbWVudHNbMV1bNF0sXG4gICAgICAgICAgICAgICAgICAgIGJpcnRoRGF0ZTogZWxlbWVudHNbMV1bNV0sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhY3RJbnN0cnVjdGlvbnM6IGVsZW1lbnRzWzFdWzZdLFxuICAgICAgICAgICAgICAgICAgICBtYXJpdGFsU3RhdHVzOiBlbGVtZW50c1sxXVs3XSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGxpbmU6IGVsZW1lbnRzWzFdWzhdLFxuICAgICAgICAgICAgICAgICAgICBzdW1tYXJ5OiBlbGVtZW50c1sxXVs5XSxcbiAgICAgICAgICAgICAgICAgICAgaW5kdXN0cnk6IGVsZW1lbnRzWzFdWzEwXSxcbiAgICAgICAgICAgICAgICAgICAgYXNzb2NpYXRpb246IGVsZW1lbnRzWzFdWzExXVxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NQcm9maWxlKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjYXNlICdFbWFpbCBBZGRyZXNzZXMuY3N2JzpcbiAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICAgIHJlYWRCbG9iKGJsb2IsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMsICdcXHQnKTsgLy8geWVzLCByZWNvbW1lbmRhdGlvbnMgdXNlIHRhYi1kZWxpbWl0ZXJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVtYWlsID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkubWFwKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogZWxlbVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogZWxlbVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUHJpbWFyeTogZWxlbVsyXSA9PSAnWWVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGVBZGRlZDogZWxlbVszXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGVSZW1vdmVkOiBlbGVtWzRdXG4gICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSkuZmlsdGVyKGVtYWlsID0+IGVtYWlsLmlzUHJpbWFyeSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbWFpbC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzRW1haWwoZW1haWxbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgZmlsZWRyYWcuaW5uZXJIVE1MID0gJ0Ryb3BwZWQhIFNlZSB0aGUgcmVzdWx0aW5nIEpTT04gUmVzdW1lIGF0IHRoZSBib3R0b20uJztcbiAgICAgICAgdmFyIG91dHB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdXRwdXQnKTtcbiAgICAgICAgb3V0cHV0LmlubmVySFRNTCA9IEpTT04uc3RyaW5naWZ5KGxpbmtlZGluVG9Kc29uUmVzdW1lLmdldE91dHB1dCgpLCB1bmRlZmluZWQsIDIpO1xuICAgICAgICBQcmlzbS5oaWdobGlnaHRFbGVtZW50KG91dHB1dCk7XG4gICAgICAgIGRvd25sb2FkQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0Jykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9XG5cbn0pKCk7XG4iXX0=
