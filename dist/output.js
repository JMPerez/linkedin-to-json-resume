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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam1wZXJlei9naXRodWIvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvY29udmVydGVyLmpzIiwiL1VzZXJzL2ptcGVyZXovZ2l0aHViL2xpbmtlZGluLXRvLWpzb24tcmVzdW1lL2pzL2NzdnRvYXJyYXkuanMiLCIvVXNlcnMvam1wZXJlei9naXRodWIvbGlua2VkaW4tdG8tanNvbi1yZXN1bWUvanMvZmlsZS5qcyIsIi9Vc2Vycy9qbXBlcmV6L2dpdGh1Yi9saW5rZWRpbi10by1qc29uLXJlc3VtZS9qcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0lNLG9CQUFvQjtBQUNiLFdBRFAsb0JBQW9CLEdBQ1Y7MEJBRFYsb0JBQW9COztBQUV0QixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztHQUNsQjs7ZUFIRyxvQkFBb0I7O1dBS2YscUJBQUc7O0FBRVYsVUFBSSxhQUFhLEdBQUcsQ0FDbEIsUUFBUSxFQUNSLE1BQU0sRUFDTixXQUFXLEVBQ1gsV0FBVyxFQUNYLFFBQVEsRUFDUixjQUFjLEVBQ2QsUUFBUSxFQUNSLFdBQVcsRUFDWCxXQUFXLEVBQ1gsWUFBWSxDQUNiLENBQUM7O0FBRUYsVUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFDdEIsNkJBQWMsYUFBYSw4SEFBRTtjQUFwQixDQUFDOztBQUNSLGNBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDcEIsd0JBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1dBQ2xDO1NBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDRCxhQUFPLFlBQVksQ0FBQztLQUNyQjs7O1dBRU0saUJBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtBQUN0QixZQUFNLEdBQUcs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Q1gsTUFBTTtBQUNMLHdCQUFjLENBQUMsVUFBUyxTQUFTLEVBQUU7QUFDakMsd0JBQVksR0FBRyxTQUFTLENBQUM7QUFDekIsa0JBQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDMUMsbUJBQU8sRUFBRSxDQUFDO1dBQ1gsQ0FBQyxDQUFDO1NBQ0o7T0FDRjtLQUNGLENBQUM7R0FDSCxDQUFBLEVBQUcsQ0FBQzs7QUFFTCxLQUFHLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDOztBQUU3RCxXQUFTLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQ2hDLFFBQUksTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7QUFDOUIsVUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMxQixjQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMzQixDQUFDO0FBQ0YsVUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUN6QjtDQUVGLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCBtb2R1bGUgKi9cbi8qIGV4cG9ydGVkIG9uTGlua2VkSW5Mb2FkICovXG5cbi8vIHRvZG86IGltcG9ydCBwdWJsaWNhdGlvbnMsIGF3YXJkcywgdm9sdW50ZWVyXG5jbGFzcyBMaW5rZWRJblRvSnNvblJlc3VtZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudGFyZ2V0ID0ge307XG4gIH1cblxuICBnZXRPdXRwdXQoKSB7XG4gICAgLy8gc29ydCB0aGUgb2JqZWN0XG4gICAgdmFyIHByb3BlcnR5T3JkZXIgPSBbXG4gICAgICAnYmFzaWNzJyxcbiAgICAgICd3b3JrJyxcbiAgICAgICd2b2x1bnRlZXInLFxuICAgICAgJ2VkdWNhdGlvbicsXG4gICAgICAnYXdhcmRzJyxcbiAgICAgICdwdWJsaWNhdGlvbnMnLFxuICAgICAgJ3NraWxscycsXG4gICAgICAnbGFuZ3VhZ2VzJyxcbiAgICAgICdpbnRlcmVzdHMnLFxuICAgICAgJ3JlZmVyZW5jZXMnXG4gICAgXTtcblxuICAgIHZhciBzb3J0ZWRUYXJnZXQgPSB7fTtcbiAgICBmb3IgKHZhciBwIG9mIHByb3BlcnR5T3JkZXIpIHtcbiAgICAgIGlmIChwIGluIHRoaXMudGFyZ2V0KSB7XG4gICAgICAgIHNvcnRlZFRhcmdldFtwXSA9IHRoaXMudGFyZ2V0W3BdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc29ydGVkVGFyZ2V0O1xuICB9XG5cbiAgX2V4dGVuZCh0YXJnZXQsIHNvdXJjZSkge1xuICAgIHRhcmdldCA9IHRhcmdldCB8fCB7fTtcbiAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goa2V5ID0+IHRhcmdldFtrZXldID0gc291cmNlW2tleV0pO1xuICB9XG5cbiAgcHJvY2Vzc1Byb2ZpbGUoc291cmNlKSB7XG4gICAgdGhpcy50YXJnZXQuYmFzaWNzID0gdGhpcy50YXJnZXQuYmFzaWNzIHx8IHt9O1xuICAgIHRoaXMuX2V4dGVuZCh0aGlzLnRhcmdldC5iYXNpY3MsIHtcbiAgICAgIG5hbWU6IHNvdXJjZS5maXJzdE5hbWUgKyAnICcgKyBzb3VyY2UubGFzdE5hbWUsXG4gICAgICBsYWJlbDogc291cmNlLmhlYWRsaW5lLFxuICAgICAgcGljdHVyZTogc291cmNlLnBpY3R1cmVVcmwsXG4gICAgICBwaG9uZTogc291cmNlLnBob25lTnVtYmVycyAmJiBzb3VyY2UucGhvbmVOdW1iZXJzLl90b3RhbCA/IHNvdXJjZS5waG9uZU51bWJlcnMudmFsdWVzWzBdLnBob25lTnVtYmVyIDogJycsXG4gICAgICB3ZWJzaXRlOiAnJyxcbiAgICAgIHN1bW1hcnk6IHNvdXJjZS5zdW1tYXJ5LFxuICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgYWRkcmVzczogc291cmNlLmFkZHJlc3MsXG4gICAgICAgIHBvc3RhbENvZGU6ICcnLFxuICAgICAgICBjaXR5OiBzb3VyY2UubG9jYXRpb24gPyBzb3VyY2UubG9jYXRpb24ubmFtZSA6ICcnLFxuICAgICAgICBjb3VudHJ5Q29kZTogc291cmNlLmxvY2F0aW9uID8gc291cmNlLmxvY2F0aW9uLmNvdW50cnkuY29kZS50b1VwcGVyQ2FzZSgpIDogJycsXG4gICAgICAgIHJlZ2lvbjogJydcbiAgICAgIH0sXG4gICAgICBwcm9maWxlczogW11cbiAgICB9KTtcbiAgfVxuXG4gIHByb2Nlc3NFbWFpbChzb3VyY2UpIHtcbiAgICB0aGlzLnRhcmdldC5iYXNpY3MgPSB0aGlzLnRhcmdldC5iYXNpY3MgfHwge307XG4gICAgdGhpcy5fZXh0ZW5kKHRoaXMudGFyZ2V0LmJhc2ljcywgeydlbWFpbCc6IHNvdXJjZS5hZGRyZXNzfSk7XG4gIH1cblxuICBwcm9jZXNzUG9zaXRpb24oc291cmNlKSB7XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzUG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICAgIGxldCBvYmplY3QgPSB7XG4gICAgICAgIGNvbXBhbnk6IHBvc2l0aW9uLmNvbXBhbnlOYW1lLFxuICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24udGl0bGUgfHwgJycsXG4gICAgICAgIHdlYnNpdGU6ICcnLFxuICAgICAgICBzdGFydERhdGU6IHBvc2l0aW9uLnN0YXJ0RGF0ZS55ZWFyICsgJy0nICsgKHBvc2l0aW9uLnN0YXJ0RGF0ZS5tb250aCA8IDEwID8gJzAnIDogJycpICsgcG9zaXRpb24uc3RhcnREYXRlLm1vbnRoICsgJy0wMScsXG4gICAgICAgIHN1bW1hcnk6IHBvc2l0aW9uLmRlc2NyaXB0aW9uLFxuICAgICAgICBoaWdobGlnaHRzOiBbXVxuICAgICAgfTtcblxuICAgICAgaWYgKHBvc2l0aW9uLmVuZERhdGUpIHtcbiAgICAgICAgb2JqZWN0LmVuZERhdGUgPSBwb3NpdGlvbi5lbmREYXRlLnllYXIgKyAnLScgKyAocG9zaXRpb24uZW5kRGF0ZS5tb250aCA8IDEwID8gJzAnIDogJycpICsgcG9zaXRpb24uZW5kRGF0ZS5tb250aCArICctMDEnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIHRoaXMudGFyZ2V0LndvcmsgPSBzb3VyY2UubWFwKHByb2Nlc3NQb3NpdGlvbik7XG4gIH1cblxuICBwcm9jZXNzRWR1Y2F0aW9uKHNvdXJjZSkge1xuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc0VkdWNhdGlvbihlZHVjYXRpb24pIHtcbiAgICAgIGxldCBvYmplY3QgPSB7XG4gICAgICAgIGluc3RpdHV0aW9uOiBlZHVjYXRpb24uc2Nob29sTmFtZSxcbiAgICAgICAgYXJlYTogJycsXG4gICAgICAgIHN0dWR5VHlwZTogZWR1Y2F0aW9uLmRlZ3JlZSxcbiAgICAgICAgc3RhcnREYXRlOiAnJyArIGVkdWNhdGlvbi5zdGFydERhdGUgKyAnLTAxLTAxJyxcbiAgICAgICAgZ3BhOiAnJyxcbiAgICAgICAgY291cnNlczogW11cbiAgICAgIH07XG5cbiAgICAgIGlmIChlZHVjYXRpb24uZW5kRGF0ZSkge1xuICAgICAgICBvYmplY3QuZW5kRGF0ZSA9IGVkdWNhdGlvbi5lbmREYXRlICsgJy0wMS0wMSc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXQuZWR1Y2F0aW9uID0gc291cmNlLm1hcChwcm9jZXNzRWR1Y2F0aW9uKTtcbiAgfVxuXG4gIHByb2Nlc3NTa2lsbHMoc2tpbGxzKSB7XG5cbiAgICB0aGlzLnRhcmdldC5za2lsbHMgPSBza2lsbHMubWFwKHNraWxsID0+ICh7XG4gICAgICAgIG5hbWU6IHNraWxsLFxuICAgICAgICBsZXZlbDogJycsXG4gICAgICAgIGtleXdvcmRzOiBbXVxuICAgICAgfSkpO1xuICB9XG5cbiAgcHJvY2Vzc0xhbmd1YWdlcyhzb3VyY2UpIHtcblxuICAgIGZ1bmN0aW9uIGNsZWFuUHJvZmljaWVuY3lTdHJpbmcocHJvZmljaWVuY3kpIHtcbiAgICAgIHByb2ZpY2llbmN5ID0gcHJvZmljaWVuY3kudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9fL2csICcgJyk7XG4gICAgICByZXR1cm4gcHJvZmljaWVuY3lbMF0udG9VcHBlckNhc2UoKSArIHByb2ZpY2llbmN5LnN1YnN0cigxKTtcbiAgICB9XG5cbiAgICB0aGlzLnRhcmdldC5sYW5ndWFnZXMgPSBzb3VyY2UubWFwKGxhbmd1YWdlID0+ICh7XG4gICAgICBsYW5ndWFnZTogbGFuZ3VhZ2UubmFtZSxcbiAgICAgIGZsdWVuY3k6IGNsZWFuUHJvZmljaWVuY3lTdHJpbmcobGFuZ3VhZ2UucHJvZmljaWVuY3kpXG4gICAgfSkpO1xuICB9XG5cbiAgcHJvY2Vzc1JlZmVyZW5jZXMoc291cmNlKSB7XG5cbiAgICB0aGlzLnRhcmdldC5yZWZlcmVuY2VzID0gc291cmNlLm1hcChyZWZlcmVuY2UgPT4gKHtcbiAgICAgIG5hbWU6IHJlZmVyZW5jZS5yZWNvbW1lbmRlckZpcnN0TmFtZSArICcgJyArIHJlZmVyZW5jZS5yZWNvbW1lbmRlckxhc3ROYW1lLFxuICAgICAgcmVmZXJlbmNlOiByZWZlcmVuY2UucmVjb21tZW5kYXRpb25Cb2R5XG4gICAgfSkpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGlua2VkSW5Ub0pzb25SZXN1bWU7XG4iLCIvKiBnbG9iYWwgbW9kdWxlICovXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLy8gcmVmOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMjkzMTYzLzIzNDNcbiAgLy8gVGhpcyB3aWxsIHBhcnNlIGEgZGVsaW1pdGVkIHN0cmluZyBpbnRvIGFuIGFycmF5IG9mXG4gIC8vIGFycmF5cy4gVGhlIGRlZmF1bHQgZGVsaW1pdGVyIGlzIHRoZSBjb21tYSwgYnV0IHRoaXNcbiAgLy8gY2FuIGJlIG92ZXJyaWRlbiBpbiB0aGUgc2Vjb25kIGFyZ3VtZW50LlxuICBmdW5jdGlvbiBDU1ZUb0FycmF5KCBzdHJEYXRhLCBzdHJEZWxpbWl0ZXIgKXtcbiAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGRlbGltaXRlciBpcyBkZWZpbmVkLiBJZiBub3QsXG4gICAgLy8gdGhlbiBkZWZhdWx0IHRvIGNvbW1hLlxuICAgIHN0ckRlbGltaXRlciA9IChzdHJEZWxpbWl0ZXIgfHwgJywnKTtcblxuICAgIC8vIENyZWF0ZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBwYXJzZSB0aGUgQ1NWIHZhbHVlcy5cbiAgICB2YXIgb2JqUGF0dGVybiA9IG5ldyBSZWdFeHAoXG4gICAgICAgIChcbiAgICAgICAgICAgIC8vIERlbGltaXRlcnMuXG4gICAgICAgICAgICAnKFxcXFwnICsgc3RyRGVsaW1pdGVyICsgJ3xcXFxccj9cXFxcbnxcXFxccnxeKScgK1xuXG4gICAgICAgICAgICAvLyBRdW90ZWQgZmllbGRzLlxuICAgICAgICAgICAgJyg/OlxcXCIoW15cXFwiXSooPzpcXFwiXFxcIlteXFxcIl0qKSopXFxcInwnICtcblxuICAgICAgICAgICAgLy8gU3RhbmRhcmQgZmllbGRzLlxuICAgICAgICAgICAgJyhbXlxcXCJcXFxcJyArIHN0ckRlbGltaXRlciArICdcXFxcclxcXFxuXSopKSdcbiAgICAgICAgKSxcbiAgICAgICAgJ2dpJ1xuICAgICAgICApO1xuXG5cbiAgICAvLyBDcmVhdGUgYW4gYXJyYXkgdG8gaG9sZCBvdXIgZGF0YS4gR2l2ZSB0aGUgYXJyYXlcbiAgICAvLyBhIGRlZmF1bHQgZW1wdHkgZmlyc3Qgcm93LlxuICAgIHZhciBhcnJEYXRhID0gW1tdXTtcblxuICAgIC8vIENyZWF0ZSBhbiBhcnJheSB0byBob2xkIG91ciBpbmRpdmlkdWFsIHBhdHRlcm5cbiAgICAvLyBtYXRjaGluZyBncm91cHMuXG4gICAgdmFyIGFyck1hdGNoZXMgPSBudWxsO1xuXG4gICAgLy8gS2VlcCBsb29waW5nIG92ZXIgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBtYXRjaGVzXG4gICAgLy8gdW50aWwgd2UgY2FuIG5vIGxvbmdlciBmaW5kIGEgbWF0Y2guXG4gICAgZG8ge1xuICAgICAgYXJyTWF0Y2hlcyA9IG9ialBhdHRlcm4uZXhlYyggc3RyRGF0YSApO1xuICAgICAgaWYgKCFhcnJNYXRjaGVzKSB7IGJyZWFrOyB9XG5cbiAgICAgICAgLy8gR2V0IHRoZSBkZWxpbWl0ZXIgdGhhdCB3YXMgZm91bmQuXG4gICAgICAgIHZhciBzdHJNYXRjaGVkRGVsaW1pdGVyID0gYXJyTWF0Y2hlc1sgMSBdO1xuXG4gICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZ2l2ZW4gZGVsaW1pdGVyIGhhcyBhIGxlbmd0aFxuICAgICAgICAvLyAoaXMgbm90IHRoZSBzdGFydCBvZiBzdHJpbmcpIGFuZCBpZiBpdCBtYXRjaGVzXG4gICAgICAgIC8vIGZpZWxkIGRlbGltaXRlci4gSWYgaWQgZG9lcyBub3QsIHRoZW4gd2Uga25vd1xuICAgICAgICAvLyB0aGF0IHRoaXMgZGVsaW1pdGVyIGlzIGEgcm93IGRlbGltaXRlci5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgc3RyTWF0Y2hlZERlbGltaXRlci5sZW5ndGggJiZcbiAgICAgICAgICAgIHN0ck1hdGNoZWREZWxpbWl0ZXIgIT09IHN0ckRlbGltaXRlclxuICAgICAgICAgICAgKXtcblxuICAgICAgICAgICAgLy8gU2luY2Ugd2UgaGF2ZSByZWFjaGVkIGEgbmV3IHJvdyBvZiBkYXRhLFxuICAgICAgICAgICAgLy8gYWRkIGFuIGVtcHR5IHJvdyB0byBvdXIgZGF0YSBhcnJheS5cbiAgICAgICAgICAgIGFyckRhdGEucHVzaCggW10gKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0ck1hdGNoZWRWYWx1ZTtcblxuICAgICAgICAvLyBOb3cgdGhhdCB3ZSBoYXZlIG91ciBkZWxpbWl0ZXIgb3V0IG9mIHRoZSB3YXksXG4gICAgICAgIC8vIGxldCdzIGNoZWNrIHRvIHNlZSB3aGljaCBraW5kIG9mIHZhbHVlIHdlXG4gICAgICAgIC8vIGNhcHR1cmVkIChxdW90ZWQgb3IgdW5xdW90ZWQpLlxuICAgICAgICBpZiAoYXJyTWF0Y2hlc1sgMiBdKXtcblxuICAgICAgICAgICAgLy8gV2UgZm91bmQgYSBxdW90ZWQgdmFsdWUuIFdoZW4gd2UgY2FwdHVyZVxuICAgICAgICAgICAgLy8gdGhpcyB2YWx1ZSwgdW5lc2NhcGUgYW55IGRvdWJsZSBxdW90ZXMuXG4gICAgICAgICAgICBzdHJNYXRjaGVkVmFsdWUgPSBhcnJNYXRjaGVzWyAyIF0ucmVwbGFjZShcbiAgICAgICAgICAgICAgICBuZXcgUmVnRXhwKCAnXFxcIlxcXCInLCAnZycgKSxcbiAgICAgICAgICAgICAgICAnXFxcIidcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIFdlIGZvdW5kIGEgbm9uLXF1b3RlZCB2YWx1ZS5cbiAgICAgICAgICAgIHN0ck1hdGNoZWRWYWx1ZSA9IGFyck1hdGNoZXNbIDMgXTtcblxuICAgICAgICB9XG5cblxuICAgICAgICAvLyBOb3cgdGhhdCB3ZSBoYXZlIG91ciB2YWx1ZSBzdHJpbmcsIGxldCdzIGFkZFxuICAgICAgICAvLyBpdCB0byB0aGUgZGF0YSBhcnJheS5cbiAgICAgICAgYXJyRGF0YVsgYXJyRGF0YS5sZW5ndGggLSAxIF0ucHVzaCggc3RyTWF0Y2hlZFZhbHVlID8gc3RyTWF0Y2hlZFZhbHVlLnRyaW0oKSA6IHN0ck1hdGNoZWRWYWx1ZSApO1xuICAgICAgfSB3aGlsZSAodHJ1ZSk7XG5cbiAgICAvLyBSZXR1cm4gdGhlIHBhcnNlZCBkYXRhLlxuICAgIHJldHVybiBhcnJEYXRhO1xuICB9XG4gIG1vZHVsZS5leHBvcnRzID0gQ1NWVG9BcnJheTtcbn0pKCk7XG4iLCIvKiBnbG9iYWwgVVJMLCBCbG9iLCBtb2R1bGUgKi9cbi8qIGV4cG9ydGVkIHNhdmUgKi9cbnZhciBzYXZlID0gKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gc2F2ZUFzIGZyb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vTXJTd2l0Y2gvMzU1Mjk4NVxuICB2YXIgc2F2ZUFzID0gd2luZG93LnNhdmVBcyB8fCAod2luZG93Lm5hdmlnYXRvci5tc1NhdmVCbG9iID8gZnVuY3Rpb24gKGIsIG4pIHtcbiAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZUJsb2IoYiwgbik7XG4gICAgfSA6IGZhbHNlKSB8fCB3aW5kb3cud2Via2l0U2F2ZUFzIHx8IHdpbmRvdy5tb3pTYXZlQXMgfHwgd2luZG93Lm1zU2F2ZUFzIHx8IChmdW5jdGlvbiAoKSB7XG5cbiAgICAgIC8vIFVSTCdzXG4gICAgICB3aW5kb3cuVVJMID0gd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMO1xuXG4gICAgICBpZiAoIXdpbmRvdy5VUkwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGJsb2IsIG5hbWUpIHtcbiAgICAgICAgdmFyIHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cbiAgICAgICAgLy8gVGVzdCBmb3IgZG93bmxvYWQgbGluayBzdXBwb3J0XG4gICAgICAgIGlmICgnZG93bmxvYWQnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSkge1xuXG4gICAgICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB1cmwpO1xuICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIG5hbWUpO1xuXG4gICAgICAgICAgLy8gQ3JlYXRlIENsaWNrIGV2ZW50XG4gICAgICAgICAgdmFyIGNsaWNrRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnTW91c2VFdmVudCcpO1xuICAgICAgICAgIGNsaWNrRXZlbnQuaW5pdE1vdXNlRXZlbnQoJ2NsaWNrJywgdHJ1ZSwgdHJ1ZSwgd2luZG93LCAwLFxuICAgICAgICAgICAgMCwgMCwgMCwgMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIG51bGwpO1xuXG4gICAgICAgICAgLy8gZGlzcGF0Y2ggY2xpY2sgZXZlbnQgdG8gc2ltdWxhdGUgZG93bmxvYWRcbiAgICAgICAgICBhLmRpc3BhdGNoRXZlbnQoY2xpY2tFdmVudCk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBmYWxsb3Zlciwgb3BlbiByZXNvdXJjZSBpbiBuZXcgdGFiLlxuICAgICAgICAgIHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycsICcnKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KSgpO1xuXG4gIGZ1bmN0aW9uIF9zYXZlICh0ZXh0LCBmaWxlTmFtZSkge1xuICAgIHZhciBibG9iID0gbmV3IEJsb2IoW3RleHRdLCB7XG4gICAgICB0eXBlOiAndGV4dC9wbGFpbidcbiAgICB9KTtcbiAgICBzYXZlQXMoYmxvYiwgZmlsZU5hbWUgfHwgJ3N1YnRpdGxlLnNydCcpO1xuICB9XG5cbiAgcmV0dXJuIF9zYXZlO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNhdmU7IiwiLyogZ2xvYmFsIHppcCwgY3JlYXRlVGVtcEZpbGUsIFByaXNtICovXG5cbmltcG9ydCBMaW5rZWRJblRvSnNvblJlc3VtZSBmcm9tICcuL2NvbnZlcnRlci5qcyc7XG5pbXBvcnQgY3N2VG9BcnJheSBmcm9tICcuL2NzdnRvYXJyYXkuanMnO1xuaW1wb3J0IHNhdmUgZnJvbSAnLi9maWxlLmpzJztcblxuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGxpbmtlZGluVG9Kc29uUmVzdW1lID0gbmV3IExpbmtlZEluVG9Kc29uUmVzdW1lKCk7XG5cbiAgdmFyIGRvd25sb2FkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRvd25sb2FkJyk7XG4gIGRvd25sb2FkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgc2F2ZShKU09OLnN0cmluZ2lmeShsaW5rZWRpblRvSnNvblJlc3VtZS5nZXRPdXRwdXQoKSwgdW5kZWZpbmVkLCAyKSwgJ3Jlc3VtZS5qc29uJyk7XG4gIH0pO1xuICBkb3dubG9hZEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gIC8vIGZpbGUgc2VsZWN0aW9uXG4gIGZ1bmN0aW9uIGZpbGVTZWxlY3RIYW5kbGVyKGUpIHtcbiAgICAvLyBjYW5jZWwgZXZlbnQgYW5kIGhvdmVyIHN0eWxpbmdcbiAgICBmaWxlRHJhZ0hvdmVyKGUpO1xuXG4gICAgdmFyIGRyb3BwZWRGaWxlcyA9IGUudGFyZ2V0LmZpbGVzIHx8IGUuZGF0YVRyYW5zZmVyLmZpbGVzO1xuXG4gICAgdmFyIGZpbGUgPSBkcm9wcGVkRmlsZXNbMF07XG4gICAgZmlsZU5hbWUgPSBmaWxlLm5hbWU7XG5cbiAgICBtb2RlbC5nZXRFbnRyaWVzKGZpbGUsIGZ1bmN0aW9uKGVudHJpZXMpIHtcblxuICAgICAgdmFyIHByb21pc2VzID0gZW50cmllcy5tYXAoZnVuY3Rpb24oZW50cnkpIHtcblxuICAgICAgICAvLyB0b2RvOiB1c2UgcHJvbWlzZXNcbiAgICAgICAgc3dpdGNoIChlbnRyeS5maWxlbmFtZSkge1xuICAgICAgICAgIGNhc2UgJ1NraWxscy5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgZW50cnkuZ2V0RGF0YShuZXcgemlwLkJsb2JXcml0ZXIoJ3RleHQvcGxhaW4nKSwgZnVuY3Rpb24oYmxvYikge1xuICAgICAgICAgICAgICAgIHJlYWRCbG9iKGJsb2IsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgICBjb250ZW50cyA9IGNvbnRlbnRzLnJlcGxhY2UoL1wiL2csICcnKTtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNvbnRlbnRzLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0xKTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NTa2lsbHMoZWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2FzZSAnRWR1Y2F0aW9uLmNzdic6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgICBlbnRyeS5nZXREYXRhKG5ldyB6aXAuQmxvYldyaXRlcigndGV4dC9wbGFpbicpLCBmdW5jdGlvbihibG9iKSB7XG4gICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGNzdlRvQXJyYXkoY29udGVudHMpO1xuICAgICAgICAgICAgICAgICAgdmFyIGVkdWNhdGlvbiA9IGVsZW1lbnRzLnNsaWNlKDEsIGVsZW1lbnRzLmxlbmd0aCAtIDEpLm1hcChmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgc2Nob29sTmFtZTogZWxlbVswXSxcbiAgICAgICAgICAgICAgICAgICAgICBzdGFydERhdGU6IGVsZW1bMV0sXG4gICAgICAgICAgICAgICAgICAgICAgZW5kRGF0ZTogZWxlbVsyXSxcbiAgICAgICAgICAgICAgICAgICAgICBub3RlczogZWxlbVszXSxcbiAgICAgICAgICAgICAgICAgICAgICBkZWdyZWU6IGVsZW1bNF0sXG4gICAgICAgICAgICAgICAgICAgICAgYWN0aXZpdGllczogZWxlbVs1XVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzRWR1Y2F0aW9uKGVkdWNhdGlvbi5zb3J0KChlMSxlMikgPT5cbiAgICAgICAgICAgICAgICAgICAgKCtlMi5zdGFydERhdGUueWVhciAtICtlMS5zdGFydERhdGUueWVhcikgfHwgKCtlMi5zdGFydERhdGUubW9udGggLSArZTEuc3RhcnREYXRlLm1vbnRoKVxuICAgICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdQb3NpdGlvbnMuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICByZWFkQmxvYihibG9iLCBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cyk7XG4gICAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb25zID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkubWFwKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb21wYW55TmFtZTogZWxlbVswXSxcbiAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZWxlbVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjogZWxlbVsyXSxcbiAgICAgICAgICAgICAgICAgICAgICBzdGFydERhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHllYXI6IGVsZW1bM10uc3BsaXQoJy8nKVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoOiBlbGVtWzNdLnNwbGl0KCcvJylbMF1cbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIGVuZERhdGU6IGVsZW1bNF0gPyB7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ZWFyOiBlbGVtWzRdLnNwbGl0KCcvJylbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aDogZWxlbVs0XS5zcGxpdCgnLycpWzBdXG4gICAgICAgICAgICAgICAgICAgICAgfSA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGVsZW1bNV1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgbGlua2VkaW5Ub0pzb25SZXN1bWUucHJvY2Vzc1Bvc2l0aW9uKHBvc2l0aW9ucy5zb3J0KChwMSxwMikgPT5cbiAgICAgICAgICAgICAgICAgICAgKCtwMi5zdGFydERhdGUueWVhciAtICtwMS5zdGFydERhdGUueWVhcikgfHwgKCtwMi5zdGFydERhdGUubW9udGggLSArcDEuc3RhcnREYXRlLm1vbnRoKVxuICAgICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjYXNlICdMYW5ndWFnZXMuY3N2JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgICAgIGVudHJ5LmdldERhdGEobmV3IHppcC5CbG9iV3JpdGVyKCd0ZXh0L3BsYWluJyksIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgICAgICByZWFkQmxvYihibG9iLCBmdW5jdGlvbihjb250ZW50cykge1xuICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cyk7XG4gICAgICAgICAgICAgICAgICB2YXIgbGFuZ3VhZ2VzID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkubWFwKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBlbGVtWzBdLFxuICAgICAgICAgICAgICAgICAgICAgIHByb2ZpY2llbmN5OiBlbGVtWzFdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIGxpbmtlZGluVG9Kc29uUmVzdW1lLnByb2Nlc3NMYW5ndWFnZXMobGFuZ3VhZ2VzKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNhc2UgJ1JlY29tbWVuZGF0aW9ucyBSZWNlaXZlZC5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgZW50cnkuZ2V0RGF0YShuZXcgemlwLkJsb2JXcml0ZXIoJ3RleHQvcGxhaW4nKSwgZnVuY3Rpb24oYmxvYikge1xuICAgICAgICAgICAgICAgIHJlYWRCbG9iKGJsb2IsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBjc3ZUb0FycmF5KGNvbnRlbnRzLCAnXFx0Jyk7IC8vIHllcywgcmVjb21tZW5kYXRpb25zIHVzZSB0YWItZGVsaW1pdGVyXG4gICAgICAgICAgICAgICAgICB2YXIgcmVjb21tZW5kYXRpb25zID0gZWxlbWVudHMuc2xpY2UoMSwgZWxlbWVudHMubGVuZ3RoIC0gMSkubWFwKGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICByZWNvbW1lbmRhdGlvbkRhdGU6IGVsZW1bMF0sXG4gICAgICAgICAgICAgICAgICAgICAgcmVjb21tZW5kYXRpb25Cb2R5OiBlbGVtWzFdLFxuICAgICAgICAgICAgICAgICAgICAgIHJlY29tbWVuZGVyRmlyc3ROYW1lOiBlbGVtWzJdLFxuICAgICAgICAgICAgICAgICAgICAgIHJlY29tbWVuZGVyTGFzdE5hbWU6IGVsZW1bM10sXG4gICAgICAgICAgICAgICAgICAgICAgcmVjb21tZW5kZXJDb21wYW55OiBlbGVtWzRdLFxuICAgICAgICAgICAgICAgICAgICAgIHJlY29tbWVuZGVyVGl0bGU6IGVsZW1bNV0sXG4gICAgICAgICAgICAgICAgICAgICAgZGlzcGxheVN0YXR1czogZWxlbVs2XVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uKHJlY29tbWVuZGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNvbW1lbmRhdGlvbi5kaXNwbGF5U3RhdHVzID09PSAnU2hvd24nO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzUmVmZXJlbmNlcyhyZWNvbW1lbmRhdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2FzZSAnUHJvZmlsZS5jc3YnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgZW50cnkuZ2V0RGF0YShuZXcgemlwLkJsb2JXcml0ZXIoJ3RleHQvcGxhaW4nKSwgZnVuY3Rpb24oYmxvYikge1xuICAgICAgICAgICAgICAgIHJlYWRCbG9iKGJsb2IsIGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBjc3ZUb0FycmF5KGNvbnRlbnRzKTtcbiAgICAgICAgICAgICAgICAgIHZhciBwcm9maWxlID0ge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdE5hbWU6IGVsZW1lbnRzWzFdWzBdLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TmFtZTogZWxlbWVudHNbMV1bMV0sXG4gICAgICAgICAgICAgICAgICAgIG1haWRlbk5hbWU6IGVsZW1lbnRzWzFdWzJdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkRGF0ZTogZWxlbWVudHNbMV1bM10sXG4gICAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IGVsZW1lbnRzWzFdWzRdLFxuICAgICAgICAgICAgICAgICAgICBiaXJ0aERhdGU6IGVsZW1lbnRzWzFdWzVdLFxuICAgICAgICAgICAgICAgICAgICBjb250YWN0SW5zdHJ1Y3Rpb25zOiBlbGVtZW50c1sxXVs2XSxcbiAgICAgICAgICAgICAgICAgICAgbWFyaXRhbFN0YXR1czogZWxlbWVudHNbMV1bN10sXG4gICAgICAgICAgICAgICAgICAgIGhlYWRsaW5lOiBlbGVtZW50c1sxXVs4XSxcbiAgICAgICAgICAgICAgICAgICAgc3VtbWFyeTogZWxlbWVudHNbMV1bOV0sXG4gICAgICAgICAgICAgICAgICAgIGluZHVzdHJ5OiBlbGVtZW50c1sxXVsxMF0sXG4gICAgICAgICAgICAgICAgICAgIGFzc29jaWF0aW9uOiBlbGVtZW50c1sxXVsxMV1cbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzUHJvZmlsZShwcm9maWxlKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY2FzZSAnRW1haWwgQWRkcmVzc2VzLmNzdic6XG4gICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgICAgICAgZW50cnkuZ2V0RGF0YShuZXcgemlwLkJsb2JXcml0ZXIoJ3RleHQvcGxhaW4nKSwgZnVuY3Rpb24oYmxvYikge1xuICAgICAgICAgICAgICAgICAgcmVhZEJsb2IoYmxvYiwgZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gY3N2VG9BcnJheShjb250ZW50cywgJ1xcdCcpOyAvLyB5ZXMsIHJlY29tbWVuZGF0aW9ucyB1c2UgdGFiLWRlbGltaXRlclxuICAgICAgICAgICAgICAgICAgICB2YXIgZW1haWwgPSBlbGVtZW50cy5zbGljZSgxLCBlbGVtZW50cy5sZW5ndGggLSAxKS5tYXAoZnVuY3Rpb24oZWxlbSkge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiBlbGVtWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBlbGVtWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNQcmltYXJ5OiBlbGVtWzJdID09PSAnWWVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGVBZGRlZDogZWxlbVszXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGVSZW1vdmVkOiBlbGVtWzRdXG4gICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSkuZmlsdGVyKGVtYWlsID0+IGVtYWlsLmlzUHJpbWFyeSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbWFpbC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICBsaW5rZWRpblRvSnNvblJlc3VtZS5wcm9jZXNzRW1haWwoZW1haWxbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgZmlsZWRyYWcuaW5uZXJIVE1MID0gJ0Ryb3BwZWQhIFNlZSB0aGUgcmVzdWx0aW5nIEpTT04gUmVzdW1lIGF0IHRoZSBib3R0b20uJztcbiAgICAgICAgdmFyIG91dHB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdXRwdXQnKTtcbiAgICAgICAgb3V0cHV0LmlubmVySFRNTCA9IEpTT04uc3RyaW5naWZ5KGxpbmtlZGluVG9Kc29uUmVzdW1lLmdldE91dHB1dCgpLCB1bmRlZmluZWQsIDIpO1xuICAgICAgICBQcmlzbS5oaWdobGlnaHRFbGVtZW50KG91dHB1dCk7XG4gICAgICAgIGRvd25sb2FkQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0Jykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBmaWxlZHJhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlZHJhZycpLFxuICAgICAgZmlsZXNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlc2VsZWN0JyksXG4gICAgICBmaWxlTmFtZSA9IG51bGw7XG4gIC8vIGZpbGUgc2VsZWN0XG4gIGZpbGVzZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZmlsZVNlbGVjdEhhbmRsZXIsIGZhbHNlKTtcblxuICAvLyBmaWxlIGRyYWcgaG92ZXJcbiAgZnVuY3Rpb24gZmlsZURyYWdIb3ZlcihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS50YXJnZXQuY2xhc3NOYW1lID0gKGUudHlwZSA9PT0gJ2RyYWdvdmVyJyA/ICdob3ZlcicgOiAnJyk7XG4gIH1cblxuICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIGlmICh4aHIudXBsb2FkKSB7XG4gICAgLy8gZmlsZSBkcm9wXG4gICAgZmlsZWRyYWcuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBmaWxlRHJhZ0hvdmVyLCBmYWxzZSk7XG4gICAgZmlsZWRyYWcuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgZmlsZURyYWdIb3ZlciwgZmFsc2UpO1xuICAgIGZpbGVkcmFnLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBmaWxlU2VsZWN0SGFuZGxlciwgZmFsc2UpO1xuICAgIGZpbGVkcmFnLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICB9IGVsc2Uge1xuICAgIGZpbGVkcmFnLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH1cblxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0LWZpbGUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBmaWxlc2VsZWN0LmNsaWNrKCk7XG4gIH0pO1xuXG4gIHZhciBtb2RlbCA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgVVJMID0gd2luZG93LndlYmtpdFVSTCB8fCB3aW5kb3cubW96VVJMIHx8IHdpbmRvdy5VUkw7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0RW50cmllcyA6IGZ1bmN0aW9uKGZpbGUsIG9uZW5kKSB7XG4gICAgICAgIHppcC5jcmVhdGVSZWFkZXIobmV3IHppcC5CbG9iUmVhZGVyKGZpbGUpLCBmdW5jdGlvbih6aXBSZWFkZXIpIHtcbiAgICAgICAgICB6aXBSZWFkZXIuZ2V0RW50cmllcyhvbmVuZCk7XG4gICAgICAgIH0sIG9uZXJyb3IpO1xuICAgICAgfSxcbiAgICAgIGdldEVudHJ5RmlsZSA6IGZ1bmN0aW9uKGVudHJ5LCBjcmVhdGlvbk1ldGhvZCwgb25lbmQsIG9ucHJvZ3Jlc3MpIHtcbiAgICAgICAgdmFyIHdyaXRlciwgemlwRmlsZUVudHJ5O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldERhdGEoKSB7XG4gICAgICAgICAgZW50cnkuZ2V0RGF0YSh3cml0ZXIsIGZ1bmN0aW9uKGJsb2IpIHtcbiAgICAgICAgICAgIHZhciBibG9iVVJMID0gY3JlYXRpb25NZXRob2QgPT09ICdCbG9iJyA/IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYikgOiB6aXBGaWxlRW50cnkudG9VUkwoKTtcbiAgICAgICAgICAgIG9uZW5kKGJsb2JVUkwpO1xuICAgICAgICAgIH0sIG9ucHJvZ3Jlc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNyZWF0aW9uTWV0aG9kID09PSAnQmxvYicpIHtcbiAgICAgICAgICB3cml0ZXIgPSBuZXcgemlwLkJsb2JXcml0ZXIoKTtcbiAgICAgICAgICBnZXREYXRhKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3JlYXRlVGVtcEZpbGUoZnVuY3Rpb24oZmlsZUVudHJ5KSB7XG4gICAgICAgICAgICB6aXBGaWxlRW50cnkgPSBmaWxlRW50cnk7XG4gICAgICAgICAgICB3cml0ZXIgPSBuZXcgemlwLkZpbGVXcml0ZXIoemlwRmlsZUVudHJ5KTtcbiAgICAgICAgICAgIGdldERhdGEoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH0pKCk7XG5cbiAgemlwLndvcmtlclNjcmlwdHNQYXRoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgJ3ZlbmRvci8nO1xuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iKGJsb2IsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGNhbGxiYWNrKGUudGFyZ2V0LnJlc3VsdCk7XG4gICAgfTtcbiAgICByZWFkZXIucmVhZEFzVGV4dChibG9iKTtcbiAgfVxuXG59KSgpO1xuIl19
