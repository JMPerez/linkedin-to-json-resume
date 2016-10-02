/* global zip, createTempFile, Prism */

import LinkedInToJsonResume from './converter.js';
import csvToArray from './csvtoarray.js';
import save from './file.js';

(function() {
  'use strict';

  var linkedinToJsonResume = new LinkedInToJsonResume();

  var downloadButton = document.querySelector('.download');
  downloadButton.addEventListener('click', function() {
    save(JSON.stringify(linkedinToJsonResume.getOutput(), undefined, 2), 'resume.json');
  });
  downloadButton.style.display = 'none';

  // file selection
  function fileSelectHandler(e) {
    // cancel event and hover styling
    fileDragHover(e);

    var droppedFiles = e.target.files || e.dataTransfer.files;

    var file = droppedFiles[0];
    fileName = file.name;

    model.getEntries(file, function(entries) {

      var promises = entries.map(function(entry) {

        // todo: use promises
        switch (entry.filename) {
          case 'Skills.csv':
            return new Promise(function(resolve) {
              entry.getData(new zip.BlobWriter('text/plain'), function(blob) {
                readBlob(blob, function(contents) {
                  contents = contents.replace(/"/g, '');
                  var elements = contents.split('\n');
                  elements = elements.slice(1, elements.length -1);
                  linkedinToJsonResume.processSkills(elements);
                  resolve();
                });
              });
            });

          case 'Education.csv':
            return new Promise(function(resolve) {
              entry.getData(new zip.BlobWriter('text/plain'), function(blob) {
                readBlob(blob, function(contents) {
                  var elements = csvToArray(contents);
                  var education = elements.slice(1, elements.length - 1).map(function(elem) {
                    return {
                      schoolName: elem[0],
                      startDate: elem[1],
                      endDate: elem[2],
                      notes: elem[3],
                      degree: elem[4],
                      activities: elem[5]
                    };
                  });
                  linkedinToJsonResume.processEducation(education.sort((e1,e2) =>
                    (+e2.startDate.year - +e1.startDate.year) || (+e2.startDate.month - +e1.startDate.month)
                  ));
                  resolve();
                });
              });
            });

          case 'Positions.csv':
            return new Promise(function(resolve) {
              entry.getData(new zip.BlobWriter('text/plain'), function(blob) {
                readBlob(blob, function(contents) {
                  var elements = csvToArray(contents);
                  var positions = elements.slice(1, elements.length - 1).map(function(elem) {
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
                  linkedinToJsonResume.processPosition(positions.sort((p1,p2) =>
                    (+p2.startDate.year - +p1.startDate.year) || (+p2.startDate.month - +p1.startDate.month)
                  ));
                  resolve();
                });
              });
            });

          case 'Languages.csv':
            return new Promise(function(resolve) {
              entry.getData(new zip.BlobWriter('text/plain'), function(blob) {
                readBlob(blob, function(contents) {
                  var elements = csvToArray(contents);
                  var languages = elements.slice(1, elements.length - 1).map(function(elem) {
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
            return new Promise(function(resolve) {
              entry.getData(new zip.BlobWriter('text/plain'), function(blob) {
                readBlob(blob, function(contents) {
                  var elements = csvToArray(contents, '\t'); // yes, recommendations use tab-delimiter
                  var recommendations = elements.slice(1, elements.length - 1).map(function(elem) {
                    return {
                      recommendationDate: elem[0],
                      recommendationBody: elem[1],
                      recommenderFirstName: elem[2],
                      recommenderLastName: elem[3],
                      recommenderCompany: elem[4],
                      recommenderTitle: elem[5],
                      displayStatus: elem[6]
                    };
                  }).filter(function(recommendation) {
                    return recommendation.displayStatus === 'Shown';
                  });
                  linkedinToJsonResume.processReferences(recommendations);
                  resolve();
                });
              });
            });

          case 'Profile.csv':
            return new Promise(function(resolve) {
              entry.getData(new zip.BlobWriter('text/plain'), function(blob) {
                readBlob(blob, function(contents) {
                  var elements = csvToArray(contents);
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
              return new Promise(function(resolve) {
                entry.getData(new zip.BlobWriter('text/plain'), function(blob) {
                  readBlob(blob, function(contents) {
                    var elements = csvToArray(contents, '\t'); // yes, recommendations use tab-delimiter
                    var email = elements.slice(1, elements.length - 1).map(function(elem) {
                      return {
                        address: elem[0],
                        status: elem[1],
                        isPrimary: elem[2] === 'Yes',
                        dateAdded: elem[3],
                        dateRemoved: elem[4]
                      };
                    }).filter(email => email.isPrimary);
                    if (email.length) {
                      linkedinToJsonResume.processEmail(email[0]);
                    }
                    resolve();
                  });
                });
              });

          case 'Interests.csv':
            return new Promise(function(resolve) {
              entry.getData(new zip.BlobWriter('text/plain'), function(blob) {
                readBlob(blob, function(contents) {
                  var elements = csvToArray(contents);
                  var interests = [];
                  elements.slice(1, elements.length - 1).forEach(function(elem) {
                   	 interests.concat(elem[0].split(','));
                  });
                  linkedinToJsonResume.processLanguages(interests);
                  resolve();
                });
              });
            });

          case 'Projects.csv':
            return new Promise(function(resolve) {
              entry.getData(new zip.BlobWriter('text/plain'), function(blob) {
                readBlob(blob, function(contents) {
                  var elements = csvToArray(contents);
                  var projects = elements.slice(1, elements.length - 1).map(function(elem) {
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
                  linkedinToJsonResume.processProjects(projects.sort((p1,p2) =>
                    (+p2.startDate.year - +p1.startDate.year) || (+p2.startDate.month - +p1.startDate.month)
                  ));
                  resolve();
                });
              });
            });

          default:
            return Promise.resolve([]);
        }
      });

      Promise.all(promises).then(function() {
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
    e.target.className = (e.type === 'dragover' ? 'hover' : '');
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

  var model = (function() {
    var URL = window.webkitURL || window.mozURL || window.URL;

    return {
      getEntries : function(file, onend) {
        zip.createReader(new zip.BlobReader(file), function(zipReader) {
          zipReader.getEntries(onend);
        }, onerror);
      },
      getEntryFile : function(entry, creationMethod, onend, onprogress) {
        var writer, zipFileEntry;

        function getData() {
          entry.getData(writer, function(blob) {
            var blobURL = creationMethod === 'Blob' ? URL.createObjectURL(blob) : zipFileEntry.toURL();
            onend(blobURL);
          }, onprogress);
        }

        if (creationMethod === 'Blob') {
          writer = new zip.BlobWriter();
          getData();
        } else {
          createTempFile(function(fileEntry) {
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
    reader.onload = function(e) {
      callback(e.target.result);
    };
    reader.readAsText(blob);
  }

})();
