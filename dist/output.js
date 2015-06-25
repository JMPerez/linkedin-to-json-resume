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
          company: position.company,
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

  zip.workerScriptsPath = '/vendor/';

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam1wZXJlei9naXRodWIvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvY29udmVydGVyLmpzIiwiL1VzZXJzL2ptcGVyZXovZ2l0aHViL2xpbmtlZGluLXRvLWpzb24tcmVzdW1lL2pzL2NzdnRvYXJyYXkuanMiLCIvVXNlcnMvam1wZXJlei9naXRodWIvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvZmlsZS5qcyIsIi9Vc2Vycy9qbXBlcmV6L2dpdGh1Yi9saW5rZWRpbi10by1qc29uLXJlc3VtZS9qcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0lNLG9CQUFvQjtBQUNiLFdBRFAsb0JBQW9CLEdBQ1Y7MEJBRFYsb0JBQW9COztBQUV0QixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztHQUNsQjs7ZUFIRyxvQkFBb0I7O1dBS2YscUJBQUc7O0FBRVYsVUFBSSxhQUFhLEdBQUcsQ0FDbEIsUUFBUSxFQUNSLE1BQU0sRUFDTixXQUFXLEVBQ1gsV0FBVyxFQUNYLFFBQVEsRUFDUixjQUFjLEVBQ2QsUUFBUSxFQUNSLFdBQVcsRUFDWCxXQUFXLEVBQ1gsWUFBWSxDQUNiLENBQUM7O0FBRUYsVUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFDdEIsNkJBQWMsYUFBYSw4SEFBRTtjQUFwQixDQUFDOztBQUNSLGNBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDcEIsd0JBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1dBQ2xDO1NBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDRCxhQUFPLFlBQVksQ0FBQztLQUNyQjs7O1dBRU0saUJBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtBQUN0QixZQUFNLEdBQUcs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SUFBSSxDQUFDLFlBQVc7QUFDcEMsZ0JBQVEsQ0FBQyxTQUFTLEdBQUcsdURBQXVELENBQUM7QUFDN0UsWUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQyxjQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsU0FBUyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xGLGFBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvQixzQkFBYyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZDLGdCQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO09BQzNELENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUVKO0NBRUYsQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIG1vZHVsZSAqL1xuLyogZXhwb3J0ZWQgb25MaW5rZWRJbkxvYWQgKi9cblxuLy8gdG9kbzogaW1wb3J0IHB1YmxpY2F0aW9ucywgYXdhcmRzLCB2b2x1bnRlZXJcbmNsYXNzIExpbmtlZEluVG9Kc29uUmVzdW1lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50YXJnZXQgPSB7fTtcbiAgfVxuXG4gIGdldE91dHB1dCgpIHtcbiAgICAvLyBzb3J0IHRoZSBvYmplY3RcbiAgICB2YXIgcHJvcGVydHlPcmRlciA9IFtcbiAgICAgICdiYXNpY3MnLFxuICAgICAgJ3dvcmsnLFxuICAgICAgJ3ZvbHVudGVlcicsXG4gICAgICAnZWR1Y2F0aW9uJyxcbiAgICAgICdhd2FyZHMnLFxuICAgICAgJ3B1YmxpY2F0aW9ucycsXG4gICAgICAnc2tpbGxzJyxcbiAgICAgICdsYW5ndWFnZXMnLFxuICAgICAgJ2ludGVyZXN0cycsXG4gICAgICAncmVmZXJlbmNlcydcbiAgICBdO1xuXG4gICAgdmFyIHNvcnRlZFRhcmdldCA9IHt9O1xuICAgIGZvciAodmFyIHAgb2YgcHJvcGVydHlPcmRlcikge1xuICAgICAgaWYgKHAgaW4gdGhpcy50YXJnZXQpIHtcbiAgICAgICAgc29ydGVkVGFyZ2V0W3BdID0gdGhpcy50YXJnZXRbcF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzb3J0ZWRUYXJnZXQ7XG4gIH1cblxuICBfZXh0ZW5kKHRhcmdldCwgc291cmNlKSB7XG4gICAgdGFyZ2V0ID0gdGFyZ2V0IHx8IHt9O1xuICAgIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChrZXkgPT4gdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XSk7XG4gIH1cblxuICBwcm9jZXNzUHJvZmlsZShzb3VyY2UpIHtcbiAgICB0aGlzLnRhcmdldC5iYXNpY3MgPSB0aGlzLnRhcmdldC5iYXNpY3MgfHwge307XG4gICAgdGhpcy5fZXh0ZW5kKHRoaXMudGFyZ2V0LmJhc2ljcywge1xuICAgICAgbmFtZTogc291cmNlLmZpcnN0TmFtZSArICcgJyArIHNvdXJjZS5sYXN0TmFtZSxcbiAgICAgIGxhYmVsOiBzb3VyY2UuaGVhZGxpbmUsXG4gICAgICBwaWN0dXJlOiBzb3VyY2UucGljdHVyZVVybCxcbiAgICAgIHBob25lOiBzb3VyY2UucGhvbmVOdW1iZXJzICYmIHNvdXJjZS5waG9uZU51bWJlcnMuX3RvdGFsID8gc291cmNlLnBob25lTnVtYmVycy52YWx1ZXNbMF0ucGhvbmVOdW1iZXIgOiAnJyxcbiAgICAgIHdlYnNpdGU6ICcnLFxuICAgICAgc3VtbWFyeTogc291cmNlLnN1bW1hcnksXG4gICAgICBsb2NhdGlvbjoge1xuICAgICAgICBhZGRyZXNzOiAnJyxcbiAgICAgICAgcG9zdGFsQ29kZTogJycsXG4gICAgICAgIGNpdHk6IHNvdXJjZS5sb2NhdGlvbiA/IHNvdXJjZS5sb2NhdGlvbi5uYW1lIDogJycsXG4gICAgICAgIGNvdW50cnlDb2RlOiBzb3VyY2UubG9jYXRpb24gPyBzb3VyY2UubG9jYXRpb24uY291bnRyeS5jb2RlLnRvVXBwZXJDYXNlKCkgOiAnJyxcbiAgICAgICAgcmVnaW9uOiAnJ1xuICAgICAgfSxcbiAgICAgIHByb2ZpbGVzOiBbXVxuICAgIH0pO1xuICB9XG5cbiAgcHJvY2Vzc0VtYWlsKHNvdXJjZSkge1xuICAgIHRoaXMudGFyZ2V0LmJhc2ljcyA9IHRoaXMudGFyZ2V0LmJhc2ljcyB8fCB7fTtcbiAgICB0aGlzLl9leHRlbmQodGhpcy50YXJnZXQuYmFzaWNzLCB7J2VtYWlsJzogc291cmNlLmFkZHJlc3N9KTtcbiAgfVxuXG4gIHByb2Nlc3NQb3NpdGlvbihzb3VyY2UpIHtcblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NQb3NpdGlvbihwb3NpdGlvbikge1xuICAgICAgbGV0IG9iamVjdCA9IHtcbiAgICAgICAgY29tcGFueTogcG9zaXRpb24uY29tcGFueSxcbiAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLnRpdGxlIHx8ICcnLFxuICAgICAgICB3ZWJzaXRlOiAnJyxcbiAgICAgICAgc3RhcnREYXRlOiBwb3NpdGlvbi5zdGFydERhdGUueWVhciArICctJyArIChwb3NpdGlvbi5zdGFydERhdGUubW9udGggPCAxMCA/ICcwJyA6ICcnKSArIHBvc2l0aW9uLnN0YXJ0RGF0ZS5tb250aCArICctMDEnLFxuICAgICAgICBzdW1tYXJ5OiBwb3NpdGlvbi5kZXNjcmlwdGlvbixcbiAgICAgICAgaGlnaGxpZ2h0czogW11cbiAgICAgIH07XG5cbiAgICAgIGlmIChwb3NpdGlvbi5lbmREYXRlKSB7XG4gICAgICAgIG9iamVjdC5lbmREYXRlID0gcG9zaXRpb24uZW5kRGF0ZS55ZWFyICsgJy0nICsgKHBvc2l0aW9uLmVuZERhdGUubW9udGggPCAxMCA/ICcwJyA6ICcnKSArIHBvc2l0aW9uLmVuZERhdGUubW9udGggKyAnLTAxJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICB0aGlzLnRhcmdldC53b3JrID0gc291cmNlLm1hcChwcm9jZXNzUG9zaXRpb24pO1xuICB9XG5cbiAgcHJvY2Vzc0VkdWNhdGlvbihzb3VyY2UpIHtcblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NFZHVjYXRpb24oZWR1Y2F0aW9uKSB7XG4gICAgICBsZXQgb2JqZWN0ID0ge1xuICAgICAgICBpbnN0aXR1dGlvbjogZWR1Y2F0aW9uLnNjaG9vbE5hbWUsXG4gICAgICAgIGFyZWE6ICcnLFxuICAgICAgICBzdHVkeVR5cGU6IGVkdWNhdGlvbi5kZWdyZWUsXG4gICAgICAgIHN0YXJ0RGF0ZTogJycgKyBlZHVjYXRpb24uc3RhcnREYXRlICsgJy0wMS0wMScsXG4gICAgICAgIGdwYTogJycsXG4gICAgICAgIGNvdXJzZXM6IFtdXG4gICAgICB9O1xuXG4gICAgICBpZiAoZWR1Y2F0aW9uLmVuZERhdGUpIHtcbiAgICAgICAgb2JqZWN0LmVuZERhdGUgPSBlZHVjYXRpb24uZW5kRGF0ZSArICctMDEtMDEnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIHRoaXMudGFyZ2V0LmVkdWNhdGlvbiA9IHNvdXJjZS5tYXAocHJvY2Vzc0VkdWNhdGlvbik7XG4gIH1cblxuICBwcm9jZXNzU2tpbGxzKHNraWxscykge1xuXG4gICAgdGhpcy50YXJnZXQuc2tpbGxzID0gc2tpbGxzLm1hcChza2lsbCA9PiAoe1xuICAgICAgICBuYW1lOiBza2lsbCxcbiAgICAgICAgbGV2ZWw6ICcnLFxuICAgICAgICBrZXl3b3JkczogW11cbiAgICAgIH0pKTtcbiAgfVxuXG4gIHByb2Nlc3NMYW5ndWFnZXMoc291cmNlKSB7XG5cbiAgICBmdW5jdGlvbiBjbGVhblByb2ZpY2llbmN5U3RyaW5nKHByb2ZpY2llbmN5KSB7XG4gICAgICBwcm9maWNpZW5jeSA9IHByb2ZpY2llbmN5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXy9nLCAnICcpO1xuICAgICAgcmV0dXJuIHByb2ZpY2llbmN5WzBdLnRvVXBwZXJDYXNlKCkgKyBwcm9maWNpZW5jeS5zdWJzdHIoMSk7XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXQubGFuZ3VhZ2VzID0gc291cmNlLm1hcChsYW5ndWFnZSA9PiAoe1xuICAgICAgbGFuZ3VhZ2U6IGxhbmd1YWdlLm5hbWUsXG4gICAgICBmbHVlbmN5OiBjbGVhblByb2ZpY2llbmN5U3RyaW5nKGxhbmd1YWdlLnByb2ZpY2llbmN5KVxuICAgIH0pKTtcbiAgfVxuXG4gIHByb2Nlc3NSZWZlcmVuY2VzKHNvdXJjZSkge1xuXG4gICAgdGhpcy50YXJnZXQucmVmZXJlbmNlcyA9IHNvdXJjZS5tYXAocmVmZXJlbmNlID0+ICh7XG4gICAgICBuYW1lOiByZWZlcmVuY2UucmVjb21tZW5kZXJGaXJzdE5hbWUgKyAnICcgKyByZWZlcmVuY2UucmVjb21tZW5kZXJMYXN0TmFtZSxcbiAgICAgIHJlZmVyZW5jZTogcmVmZXJlbmNlLnJlY29tbWVuZGF0aW9uQm9keVxuICAgIH0pKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmtlZEluVG9Kc29uUmVzdW1lOyIsIi8vIHJlZjogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTI5MzE2My8yMzQzXG4vLyBUaGlzIHdpbGwgcGFyc2UgYSBkZWxpbWl0ZWQgc3RyaW5nIGludG8gYW4gYXJyYXkgb2Zcbi8vIGFycmF5cy4gVGhlIGRlZmF1bHQgZGVsaW1pdGVyIGlzIHRoZSBjb21tYSwgYnV0IHRoaXNcbi8vIGNhbiBiZSBvdmVycmlkZW4gaW4gdGhlIHNlY29uZCBhcmd1bWVudC5cbmZ1bmN0aW9uIENTVlRvQXJyYXkoIHN0ckRhdGEsIHN0ckRlbGltaXRlciApe1xuICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZGVsaW1pdGVyIGlzIGRlZmluZWQuIElmIG5vdCxcbiAgICAvLyB0aGVuIGRlZmF1bHQgdG8gY29tbWEuXG4gICAgc3RyRGVsaW1pdGVyID0gKHN0ckRlbGltaXRlciB8fCBcIixcIik7XG5cbiAgICAvLyBDcmVhdGUgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gcGFyc2UgdGhlIENTViB2YWx1ZXMuXG4gICAgdmFyIG9ialBhdHRlcm4gPSBuZXcgUmVnRXhwKFxuICAgICAgICAoXG4gICAgICAgICAgICAvLyBEZWxpbWl0ZXJzLlxuICAgICAgICAgICAgXCIoXFxcXFwiICsgc3RyRGVsaW1pdGVyICsgXCJ8XFxcXHI/XFxcXG58XFxcXHJ8XilcIiArXG5cbiAgICAgICAgICAgIC8vIFF1b3RlZCBmaWVsZHMuXG4gICAgICAgICAgICBcIig/OlxcXCIoW15cXFwiXSooPzpcXFwiXFxcIlteXFxcIl0qKSopXFxcInxcIiArXG5cbiAgICAgICAgICAgIC8vIFN0YW5kYXJkIGZpZWxkcy5cbiAgICAgICAgICAgIFwiKFteXFxcIlxcXFxcIiArIHN0ckRlbGltaXRlciArIFwiXFxcXHJcXFxcbl0qKSlcIlxuICAgICAgICApLFxuICAgICAgICBcImdpXCJcbiAgICAgICAgKTtcblxuXG4gICAgLy8gQ3JlYXRlIGFuIGFycmF5IHRvIGhvbGQgb3VyIGRhdGEuIEdpdmUgdGhlIGFycmF5XG4gICAgLy8gYSBkZWZhdWx0IGVtcHR5IGZpcnN0IHJvdy5cbiAgICB2YXIgYXJyRGF0YSA9IFtbXV07XG5cbiAgICAvLyBDcmVhdGUgYW4gYXJyYXkgdG8gaG9sZCBvdXIgaW5kaXZpZHVhbCBwYXR0ZXJuXG4gICAgLy8gbWF0Y2hpbmcgZ3JvdXBzLlxuICAgIHZhciBhcnJNYXRjaGVzID0gbnVsbDtcblxuXG4gICAgLy8gS2VlcCBsb29waW5nIG92ZXIgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBtYXRjaGVzXG4gICAgLy8gdW50aWwgd2UgY2FuIG5vIGxvbmdlciBmaW5kIGEgbWF0Y2guXG4gICAgd2hpbGUgKGFyck1hdGNoZXMgPSBvYmpQYXR0ZXJuLmV4ZWMoIHN0ckRhdGEgKSl7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBkZWxpbWl0ZXIgdGhhdCB3YXMgZm91bmQuXG4gICAgICAgIHZhciBzdHJNYXRjaGVkRGVsaW1pdGVyID0gYXJyTWF0Y2hlc1sgMSBdO1xuXG4gICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZ2l2ZW4gZGVsaW1pdGVyIGhhcyBhIGxlbmd0aFxuICAgICAgICAvLyAoaXMgbm90IHRoZSBzdGFydCBvZiBzdHJpbmcpIGFuZCBpZiBpdCBtYXRjaGVzXG4gICAgICAgIC8vIGZpZWxkIGRlbGltaXRlci4gSWYgaWQgZG9lcyBub3QsIHRoZW4gd2Uga25vd1xuICAgICAgICAvLyB0aGF0IHRoaXMgZGVsaW1pdGVyIGlzIGEgcm93IGRlbGltaXRlci5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgc3RyTWF0Y2hlZERlbGltaXRlci5sZW5ndGggJiZcbiAgICAgICAgICAgIHN0ck1hdGNoZWREZWxpbWl0ZXIgIT09IHN0ckRlbGltaXRlclxuICAgICAgICAgICAgKXtcblxuICAgICAgICAgICAgLy8gU2luY2Ugd2UgaGF2ZSByZWFjaGVkIGEgbmV3IHJvdyBvZiBkYXRhLFxuICAgICAgICAgICAgLy8gYWRkIGFuIGVtcHR5IHJvdyB0byBvdXIgZGF0YSBhcnJheS5cbiAgICAgICAgICAgIGFyckRhdGEucHVzaCggW10gKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0ck1hdGNoZWRWYWx1ZTtcblxuICAgICAgICAvLyBOb3cgdGhhdCB3ZSBoYXZlIG91ciBkZWxpbWl0ZXIgb3V0IG9mIHRoZSB3YXksXG4gICAgICAgIC8vIGxldCdzIGNoZWNrIHRvIHNlZSB3aGljaCBraW5kIG9mIHZhbHVlIHdlXG4gICAgICAgIC8vIGNhcHR1cmVkIChxdW90ZWQgb3IgdW5xdW90ZWQpLlxuICAgICAgICBpZiAoYXJyTWF0Y2hlc1sgMiBdKXtcblxuICAgICAgICAgICAgLy8gV2UgZm91bmQgYSBxdW90ZWQgdmFsdWUuIFdoZW4gd2UgY2FwdHVyZVxuICAgICAgICAgICAgLy8gdGhpcyB2YWx1ZSwgdW5lc2NhcGUgYW55IGRvdWJsZSBxdW90ZXMuXG4gICAgICAgICAgICBzdHJNYXRjaGVkVmFsdWUgPSBhcnJNYXRjaGVzWyAyIF0ucmVwbGFjZShcbiAgICAgICAgICAgICAgICBuZXcgUmVnRXhwKCBcIlxcXCJcXFwiXCIsIFwiZ1wiICksXG4gICAgICAgICAgICAgICAgXCJcXFwiXCJcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIFdlIGZvdW5kIGEgbm9uLXF1b3RlZCB2YWx1ZS5cbiAgICAgICAgICAgIHN0ck1hdGNoZWRWYWx1ZSA9IGFyck1hdGNoZXNbIDMgXTtcblxuICAgICAgICB9XG5cblxuICAgICAgICAvLyBOb3cgdGhhdCB3ZSBoYXZlIG91ciB2YWx1ZSBzdHJpbmcsIGxldCdzIGFkZFxuICAgICAgICAvLyBpdCB0byB0aGUgZGF0YSBhcnJheS5cbiAgICAgICAgYXJyRGF0YVsgYXJyRGF0YS5sZW5ndGggLSAxIF0ucHVzaCggc3RyTWF0Y2hlZFZhbHVlID8gc3RyTWF0Y2hlZFZhbHVlLnRyaW0oKSA6IHN0ck1hdGNoZWRWYWx1ZSApO1xuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgcGFyc2VkIGRhdGEuXG4gICAgcmV0dXJuKCBhcnJEYXRhICk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IENTVlRvQXJyYXk7IiwiLyogZ2xvYmFsIFVSTCwgQmxvYiwgbW9kdWxlICovXG4vKiBleHBvcnRlZCBzYXZlICovXG52YXIgc2F2ZSA9IChmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIHNhdmVBcyBmcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL01yU3dpdGNoLzM1NTI5ODVcbiAgdmFyIHNhdmVBcyA9IHdpbmRvdy5zYXZlQXMgfHwgKHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlQmxvYiA/IGZ1bmN0aW9uIChiLCBuKSB7XG4gICAgICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci5tc1NhdmVCbG9iKGIsIG4pO1xuICAgIH0gOiBmYWxzZSkgfHwgd2luZG93LndlYmtpdFNhdmVBcyB8fCB3aW5kb3cubW96U2F2ZUFzIHx8IHdpbmRvdy5tc1NhdmVBcyB8fCAoZnVuY3Rpb24gKCkge1xuXG4gICAgICAvLyBVUkwnc1xuICAgICAgd2luZG93LlVSTCA9IHdpbmRvdy5VUkwgfHwgd2luZG93LndlYmtpdFVSTDtcblxuICAgICAgaWYgKCF3aW5kb3cuVVJMKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChibG9iLCBuYW1lKSB7XG4gICAgICAgIHZhciB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG4gICAgICAgIC8vIFRlc3QgZm9yIGRvd25sb2FkIGxpbmsgc3VwcG9ydFxuICAgICAgICBpZiAoJ2Rvd25sb2FkJyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJykpIHtcblxuICAgICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdocmVmJywgdXJsKTtcbiAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBuYW1lKTtcblxuICAgICAgICAgIC8vIENyZWF0ZSBDbGljayBldmVudFxuICAgICAgICAgIHZhciBjbGlja0V2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ01vdXNlRXZlbnQnKTtcbiAgICAgICAgICBjbGlja0V2ZW50LmluaXRNb3VzZUV2ZW50KCdjbGljaycsIHRydWUsIHRydWUsIHdpbmRvdywgMCxcbiAgICAgICAgICAgIDAsIDAsIDAsIDAsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCAwLCBudWxsKTtcblxuICAgICAgICAgIC8vIGRpc3BhdGNoIGNsaWNrIGV2ZW50IHRvIHNpbXVsYXRlIGRvd25sb2FkXG4gICAgICAgICAgYS5kaXNwYXRjaEV2ZW50KGNsaWNrRXZlbnQpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZmFsbG92ZXIsIG9wZW4gcmVzb3VyY2UgaW4gbmV3IHRhYi5cbiAgICAgICAgICB3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnLCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkoKTtcblxuICBmdW5jdGlvbiBfc2F2ZSAodGV4dCwgZmlsZU5hbWUpIHtcbiAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKFt0ZXh0XSwge1xuICAgICAgdHlwZTogJ3RleHQvcGxhaW4nXG4gICAgfSk7XG4gICAgc2F2ZUFzKGJsb2IsIGZpbGVOYW1lIHx8ICdzdWJ0aXRsZS5zcnQnKTtcbiAgfVxuXG4gIHJldHVybiBfc2F2ZTtcblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzYXZlOyIsIi8qIGdsb2JhbCB6aXAsIGNyZWF0ZVRlbXBGaWxlLCBQcmlzbSAqL1xuXG5pbXBvcnQgTGlua2VkSW5Ub0pzb25SZXN1bWUgZnJvbSAnLi9jb252ZXJ0ZXIuanMnO1xuaW1wb3J0IGNzdlRvQXJyYXkgZnJvbSAnLi9jc3Z0b2FycmF5LmpzJztcbmltcG9ydCBzYXZlIGZyb20gJy4vZmlsZS5qcyc7XG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBsaW5rZWRpblRvSnNvblJlc3VtZSA9IG5ldyBMaW5rZWRJblRvSnNvblJlc3VtZSgpO1xuXG4gIHZhciBkb3dubG9hZEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kb3dubG9hZCcpO1xuICBkb3dubG9hZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIHNhdmUoSlNPTi5zdHJpbmdpZnkobGlua2VkaW5Ub0pzb25SZXN1bWUuZ2V0T3V0cHV0KCksIHVuZGVmaW5lZCwgMiksICdyZXN1bWUuanNvbicpO1xuICB9KTtcbiAgZG93bmxvYWRCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICB2YXIgZmlsZWRyYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZWRyYWcnKSxcbiAgICAgIGZpbGVzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZXNlbGVjdCcpLFxuICAgICAgZmlsZU5hbWUgPSBudWxsO1xuICAgLy8gZmlsZSBzZWxlY3RcbiAgZmlsZXNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmaWxlU2VsZWN0SGFuZGxlciwgZmFsc2UpO1xuXG4gIC8vIGZpbGUgZHJhZyBob3ZlclxuICBmdW5jdGlvbiBmaWxlRHJhZ0hvdmVyKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnRhcmdldC5jbGFzc05hbWUgPSAoZS50eXBlID09PSAnZHJhZ292ZXInID8gJ2hvdmVyJyA6ICcnKTtcbiAgfVxuXG4gIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgaWYgKHhoci51cGxvYWQpIHtcbiAgICAvLyBmaWxlIGRyb3BcbiAgICBmaWxlZHJhZy5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGZpbGVEcmFnSG92ZXIsIGZhbHNlKTtcbiAgICBmaWxlZHJhZy5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBmaWxlRHJhZ0hvdmVyLCBmYWxzZSk7XG4gICAgZmlsZWRyYWcuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGZpbGVTZWxlY3RIYW5kbGVyLCBmYWxzZSk7XG4gICAgZmlsZWRyYWcuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gIH0gZWxzZSB7XG4gICAgZmlsZWRyYWcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3QtZmlsZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIGZpbGVzZWxlY3QuY2xpY2soKTtcbiAgfSk7XG5cbiAgdmFyIG1vZGVsID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBVUkwgPSB3aW5kb3cud2Via2l0VVJMIHx8IHdpbmRvdy5tb3pVUkwgfHwgd2luZG93LlVSTDtcblxuICAgIHJldHVybiB7XG4gICAgICBnZXRFbnRyaWVzIDogZnVuY3Rpb24oZmlsZSwgb25lbmQpIHtcbiAgICAgICAgemlwLmNyZWF0ZVJlYWRlcihuZXcgemlwLkJsb2JSZWFkZXIoZmlsZSksIGZ1bmN0aW9uKHppcFJlYWRlcikge1xuICAgICAgICAgIHppcFJlYWRlci5nZXRFbnRyaWVzKG9uZW5kKTtcbiAgICAgICAgfSwgb25lcnJvcik7XG4gICAgICB9LFxuICAgICAgZ2V0RW50cnlGaWxlIDogZnVuY3Rpb24oZW50cnksIGNyZWF0aW9uTWV0aG9kLCBvbmVuZCwgb25wcm9ncmVzcykge1xuICAgICAgICB2YXIgd3JpdGVyLCB6aXBGaWxlRW50cnk7XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0RGF0YSgpIHtcbiAgICAgICAgICBlbnRyeS5nZXREYXRhKHdyaXRlciwgZnVuY3Rpb24oYmxvYikge1xuICAgICAgICAgICAgdmFyIGJsb2JVUkwgPSBjcmVhdGlvbk1ldGhvZCA9PT0gJ0Jsb2InID8gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSA6IHppcEZpbGVFbnRyeS50b1VSTCgpO1xuICAgICAgICAgICAgb25lbmQoYmxvYlVSTCk7XG4gICAgICAgICAgfSwgb25wcm9ncmVzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3JlYXRpb25NZXRob2QgPT09ICdCbG9iJykge1xuICAgICAgICAgIHdyaXRlciA9IG5ldyB6aXAuQmxvYldyaXRlcigpO1xuICAgICAgICAgIGdldERhdGEoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjcmVhdGVUZW1wRmlsZShmdW5jdGlvbihmaWxlRW50cnkpIHtcbiAgICAgICAgICAgIHppcEZpbGVFbnRyeSA9IGZpbGVFbnRyeTtcbiAgICAgICAgICAgIHdyaXRlciA9IG5ldyB6aXAuRmlsZVdyaXRlcih6aXBGaWxlRW50cnkpO1xuICAgICAgICAgICAgZ2V0RGF0YSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSkoKTtcblxuICB6aXAud29ya2VyU2NyaXB0c1BhdGggPSAnL3ZlbmRvci8nO1xuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iKGJsb2IsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGNhbGxiYWNrKGUudGFyZ2V0LnJlc3VsdCk7XG4gICAgfTtcbiAgICByZWFkZXIucmVhZEFzVGV4dChibG9iKTtcbiAgfVxuXG4gIC8vIGZpbGUgc2VsZWN0aW9uXG4gIGZ1bmN0aW9uIGZpbGVTZWxlY3RIYW5kbGVyKGUpIHtcbiAgICAvLyBjYW5jZWwgZXZlbnQgYW5kIGhvdmVyIHN0eWxpbmdcbiAgICBmaWxlRHJhZ0hvdmVyKGUpO1xuXG4gICAgdmFyIGRyb3BwZWRGaWxlcyA9IGUudGFyZ2V0LmZpbGVzIHx8IGUuZGF0YVRyYW5zZmVyLmZpbGVzO1xuXG4gICAgdmFyIGZpbGUgPSBkcm9wcGVkRmlsZXNbMF07XG4gICAgZmlsZU5hbWUgPSBmaWxlLm5hbWU7XG5cbiAgICBtb2RlbC5nZXRFbnRyaWVzKGZpbGUsIGZ1bmN0aW9uKGVudHJpZXMpIHtcblxuICAgICAgdmFyIHByb21pc2VzID0gZW50cmllcy5tYXAoZnVuY3Rpb24oZW50cnkpIHtcblxuICAgICAgICAvLyB0b2RvOiB1c2UgcHJvbWlzZXNcbiAgICAgICAgc3dpdGNoIChlbnRyeS5maWxlbmFtZSkge1xuICAgICAgICAgIGNhc2UgJ1NraWxscy5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnRlbnRzID0gY29udGVudHMucmVwbGFjZSgvXCIvZywgJycpO1xuICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY29udGVudHMuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgICAgICAgZWxlbWVudHMgPSBlbGVtZW50cy5zbGljZSgxLCBlbGVtZW50cy5sZW5ndGggLTEpO1xuICAgICAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc1NraWxscyhlbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdFZHVjYXRpb24uY3N2JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgZW50cnkuZ2V0RGF0YShuZXcgemlwLkJsb2JXcml0ZXIoJ3RleHQvcGxhaW4nKSwgZnVuY3Rpb24oYmxvYikge1xuICAgICAgICAgICAgICAgIHJlYWRCbG9iKGJsb2IsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBjc3ZUb0FycmF5KGNvbnRlbnRzKTtcbiAgICAgICAgICAgICAgICAgIHZhciBlZHVjYXRpb24gPSBlbGVtZW50cy5zbGljZSgxLCBlbGVtZW50cy5sZW5ndGggLSAxKS5tYXAoZnVuY3Rpb24oZWxlbSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgIHNjaG9vbE5hbWU6IGVsZW1bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgc3RhcnREYXRlOiBlbGVtWzFdLFxuICAgICAgICAgICAgICAgICAgICAgIGVuZERhdGU6IGVsZW1bMl0sXG4gICAgICAgICAgICAgICAgICAgICAgbm90ZXM6IGVsZW1bM10sXG4gICAgICAgICAgICAgICAgICAgICAgZGVncmVlOiBlbGVtWzRdLFxuICAgICAgICAgICAgICAgICAgICAgIGFjdGl2aXRpZXM6IGVsZW1bNV1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc0VkdWNhdGlvbihlZHVjYXRpb24uc29ydCgoZTEsZTIpID0+XG4gICAgICAgICAgICAgICAgICAgICgrZTIuc3RhcnREYXRlLnllYXIgLSArZTEuc3RhcnREYXRlLnllYXIpIHx8ICgrZTIuc3RhcnREYXRlLm1vbnRoIC0gK2UxLnN0YXJ0RGF0ZS5tb250aClcbiAgICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2FzZSAnUG9zaXRpb25zLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICByZWFkQmxvYihibG9iLCBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cyk7XG4gICAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb25zID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkubWFwKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb21wYW55TmFtZTogZWxlbVswXSxcbiAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZWxlbVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjogZWxlbVsyXSxcbiAgICAgICAgICAgICAgICAgICAgICBzdGFydERhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHllYXI6IGVsZW1bM10uc3BsaXQoJy8nKVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoOiBlbGVtWzNdLnNwbGl0KCcvJylbMF1cbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIGVuZERhdGU6IGVsZW1bNF0gPyB7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ZWFyOiBlbGVtWzRdLnNwbGl0KCcvJylbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aDogZWxlbVs0XS5zcGxpdCgnLycpWzBdXG4gICAgICAgICAgICAgICAgICAgICAgfSA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGVsZW1bNV1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc1Bvc2l0aW9uKHBvc2l0aW9ucy5zb3J0KChwMSxwMikgPT4gXG4gICAgICAgICAgICAgICAgICAgICgrcDIuc3RhcnREYXRlLnllYXIgLSArcDEuc3RhcnREYXRlLnllYXIpIHx8ICgrcDIuc3RhcnREYXRlLm1vbnRoIC0gK3AxLnN0YXJ0RGF0ZS5tb250aClcbiAgICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2FzZSAnTGFuZ3VhZ2VzLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICByZWFkQmxvYihibG9iLCBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cyk7XG4gICAgICAgICAgICAgICAgICB2YXIgbGFuZ3VhZ2VzID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkubWFwKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBlbGVtWzBdLFxuICAgICAgICAgICAgICAgICAgICAgIHByb2ZpY2llbmN5OiBlbGVtWzFdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NMYW5ndWFnZXMobGFuZ3VhZ2VzKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNhc2UgJ1JlY29tbWVuZGF0aW9ucyBSZWNlaXZlZC5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMsICdcXHQnKTsgLy8geWVzLCByZWNvbW1lbmRhdGlvbnMgdXNlIHRhYi1kZWxpbWl0ZXJcbiAgICAgICAgICAgICAgICAgIHZhciByZWNvbW1lbmRhdGlvbnMgPSBlbGVtZW50cy5zbGljZSgxLCBlbGVtZW50cy5sZW5ndGggLSAxKS5tYXAoZnVuY3Rpb24oZWxlbSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgIHJlY29tbWVuZGF0aW9uRGF0ZTogZWxlbVswXSxcbiAgICAgICAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbkJvZHk6IGVsZW1bMV0sXG4gICAgICAgICAgICAgICAgICAgICAgcmVjb21tZW5kZXJGaXJzdE5hbWU6IGVsZW1bMl0sXG4gICAgICAgICAgICAgICAgICAgICAgcmVjb21tZW5kZXJMYXN0TmFtZTogZWxlbVszXSxcbiAgICAgICAgICAgICAgICAgICAgICByZWNvbW1lbmRlckNvbXBhbnk6IGVsZW1bNF0sXG4gICAgICAgICAgICAgICAgICAgICAgcmVjb21tZW5kZXJUaXRsZTogZWxlbVs1XSxcbiAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5U3RhdHVzOiBlbGVtWzZdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICB9KS5maWx0ZXIoZnVuY3Rpb24ocmVjb21tZW5kYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlY29tbWVuZGF0aW9uLmRpc3BsYXlTdGF0dXMgPT09ICdTaG93bic7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NSZWZlcmVuY2VzKHJlY29tbWVuZGF0aW9ucyk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdQcm9maWxlLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICByZWFkQmxvYihibG9iLCBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cyk7XG4gICAgICAgICAgICAgICAgICB2YXIgcHJvZmlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3ROYW1lOiBlbGVtZW50c1sxXVswXSxcbiAgICAgICAgICAgICAgICAgICAgbGFzdE5hbWU6IGVsZW1lbnRzWzFdWzFdLFxuICAgICAgICAgICAgICAgICAgICBtYWlkZW5OYW1lOiBlbGVtZW50c1sxXVsyXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZERhdGU6IGVsZW1lbnRzWzFdWzNdLFxuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiBlbGVtZW50c1sxXVs0XSxcbiAgICAgICAgICAgICAgICAgICAgYmlydGhEYXRlOiBlbGVtZW50c1sxXVs1XSxcbiAgICAgICAgICAgICAgICAgICAgY29udGFjdEluc3RydWN0aW9uczogZWxlbWVudHNbMV1bNl0sXG4gICAgICAgICAgICAgICAgICAgIG1hcml0YWxTdGF0dXM6IGVsZW1lbnRzWzFdWzddLFxuICAgICAgICAgICAgICAgICAgICBoZWFkbGluZTogZWxlbWVudHNbMV1bOF0sXG4gICAgICAgICAgICAgICAgICAgIHN1bW1hcnk6IGVsZW1lbnRzWzFdWzldLFxuICAgICAgICAgICAgICAgICAgICBpbmR1c3RyeTogZWxlbWVudHNbMV1bMTBdLFxuICAgICAgICAgICAgICAgICAgICBhc3NvY2lhdGlvbjogZWxlbWVudHNbMV1bMTFdXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc1Byb2ZpbGUocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNhc2UgJ0VtYWlsIEFkZHJlc3Nlcy5jc3YnOlxuICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgZW50cnkuZ2V0RGF0YShuZXcgemlwLkJsb2JXcml0ZXIoJ3RleHQvcGxhaW4nKSwgZnVuY3Rpb24oYmxvYikge1xuICAgICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cywgJ1xcdCcpOyAvLyB5ZXMsIHJlY29tbWVuZGF0aW9ucyB1c2UgdGFiLWRlbGltaXRlclxuICAgICAgICAgICAgICAgICAgICB2YXIgZW1haWwgPSBlbGVtZW50cy5zbGljZSgxLCBlbGVtZW50cy5sZW5ndGggLSAxKS5tYXAoZnVuY3Rpb24oZWxlbSkge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiBlbGVtWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBlbGVtWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNQcmltYXJ5OiBlbGVtWzJdID09ICdZZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZUFkZGVkOiBlbGVtWzNdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZVJlbW92ZWQ6IGVsZW1bNF1cbiAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9KS5maWx0ZXIoZW1haWwgPT4gZW1haWwuaXNQcmltYXJ5KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVtYWlsLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NFbWFpbChlbWFpbFswXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBmaWxlZHJhZy5pbm5lckhUTUwgPSAnRHJvcHBlZCEgU2VlIHRoZSByZXN1bHRpbmcgSlNPTiBSZXN1bWUgYXQgdGhlIGJvdHRvbS4nO1xuICAgICAgICB2YXIgb3V0cHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ291dHB1dCcpO1xuICAgICAgICBvdXRwdXQuaW5uZXJIVE1MID0gSlNPTi5zdHJpbmdpZnkobGlua2VkaW5Ub0pzb25SZXN1bWUuZ2V0T3V0cHV0KCksIHVuZGVmaW5lZCwgMik7XG4gICAgICAgIFByaXNtLmhpZ2hsaWdodEVsZW1lbnQob3V0cHV0KTtcbiAgICAgICAgZG93bmxvYWRCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gIH1cblxufSkoKTsiXX0=
