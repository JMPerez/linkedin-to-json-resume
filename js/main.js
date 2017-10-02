/* global zip, Prism */

import LinkedInToJsonResume from './converter.js';
import csvToArray from './csvtoarray.js';
import save from './file.js';
import moment from '../vendor/moment.js';

((() => {
  const filedrag = document.getElementById('filedrag');
  const fileselect = document.getElementById('fileselect');
  let fileName = null;

  // file drag hover
  function fileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = (e.type === 'dragover' ? 'hover' : '');
  }

  const linkedinToJsonResume = new LinkedInToJsonResume();

  const downloadButton = document.querySelector('.download');
  downloadButton.addEventListener('click', () => {
    save(JSON.stringify(linkedinToJsonResume.getOutput(), undefined, 2), 'resume.json');
  });
  downloadButton.style.display = 'none';

  // file selection
  function fileSelectHandler(e) {
    // cancel event and hover styling
    fileDragHover(e);

    const droppedFiles = e.target.files || e.dataTransfer.files;

    const file = droppedFiles[0];
    fileName = file.name;

    const readBlob = blob => {
      return new Promise(resolve => {
        let reader = new FileReader();
        reader.onload = e => {
          resolve(e.target.result);
        };
        reader.readAsText(blob);
      });
    };

    const readEntryContents = entry => {
      return new Promise(resolve => {
        entry.getData(new zip.BlobWriter('text/plain'), blob => {
          readBlob(blob).then(resolve);
        });
      });
    };

    const getEntries = (file, onend) => {
      zip.createReader(new zip.BlobReader(file), zipReader => {
        zipReader.getEntries(onend);
      }, onerror);
    };

    getEntries(file, entries => {

      const promises = entries.map(entry => {
        switch (true) {
          case (entry.filename.indexOf('Skills.csv') !== -1):
            return readEntryContents(entry).then(contents => {
              // console.log('Skills contents', contents);
              contents = contents.replace(/"/g, '');
              let elements = contents.split('\n');
              elements = elements.slice(1, elements.length -1);
              linkedinToJsonResume.processSkills(elements);
              return;
            });

          case (entry.filename.indexOf('Education.csv') !== -1):
            return readEntryContents(entry).then(contents => {
              const elements = csvToArray(contents);
              const education = elements.slice(1, elements.length - 1).map(elem => ({
                schoolName: elem[0],
                startDate: moment(elem[1]).format('YYYY-MM-DD'),
                endDate: moment(elem[2]).format('YYYY-MM-DD'),
                notes: elem[3],
                degree: elem[4],
                activities: elem[5]
              }));
              linkedinToJsonResume.processEducation(education.sort((e1,e2) =>
                (+e2.startDate.year - +e1.startDate.year) || (+e2.startDate.month - +e1.startDate.month)
              ));
              return;
            });

          case (entry.filename.indexOf('Positions.csv') !== -1):
            return readEntryContents(entry).then(contents => {
              const elements = csvToArray(contents);
              const positions = elements.slice(1, elements.length - 1).map(
                elem => {
                  return {
                    companyName: elem[0],
                    title: elem[1],
                    description: elem[2],
                    location: elem[3],

                    startDate: moment(elem[4]).format('YYYY-MM-DD'),

                    endDate: elem[5] ? moment(elem[5]).format('YYYY-MM-DD') : null,
                  };
                }
              );
              linkedinToJsonResume.processPosition(positions.sort((p1,p2) =>
                (+p2.startDate.year - +p1.startDate.year) || (+p2.startDate.month - +p1.startDate.month)
              ));
              return;
            });

          case (entry.filename.indexOf('Languages.csv') !== -1):
            return readEntryContents(entry).then(contents => {
              const elements = csvToArray(contents);
              const languages = elements.slice(1, elements.length - 1).map(elem => ({
                name: elem[0],
                proficiency: elem[1]
              }));
              linkedinToJsonResume.processLanguages(languages);
              return;
            });

          case (entry.filename.indexOf('Recommendations Received.csv') !== -1):
            return readEntryContents(entry).then(contents => {
              const elements = csvToArray(contents);
              const recommendations = elements.slice(1, elements.length - 1).map(elem => ({
                recommenderFirstName: elem[0],
                recommenderLastName: elem[1],
                recommendationDate: elem[2],
                recommendationBody: elem[3],
                recommenderCompany: elem[4],
                recommenderTitle: elem[5],
                displayStatus: elem[6]
              })).filter(recommendation => recommendation.displayStatus === 'VISIBLE');
              linkedinToJsonResume.processReferences(recommendations);
              return;
            });

          case (entry.filename.indexOf('Profile.csv') !== -1):
            return readEntryContents(entry).then(contents => {
              const elements = csvToArray(contents);
              const profile = {
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

            case (entry.filename.indexOf('Email Addresses.csv') !== -1):
              return readEntryContents(entry).then(contents => {
                const elements = csvToArray(contents, '\t'); // yes, recommendations use tab-delimiter
                const email = elements.slice(1, elements.length - 1).map(elem => ({
                  address: elem[0],
                  status: elem[1],
                  isPrimary: elem[2] === 'Yes',
                  dateAdded: elem[3],
                  dateRemoved: elem[4]
                })).filter(email => email.isPrimary);
                if (email.length) {
                  linkedinToJsonResume.processEmail(email[0]);
                }
                return;
              });

          case (entry.filename.indexOf('Interests.csv') !== -1):
            return readEntryContents(entry).then(contents => {
              const elements = csvToArray(contents);
              let interests = [];
              elements.slice(1, elements.length - 1).forEach(elem => {
               	 interests = interests.concat(elem[0].split(','));
              });
              linkedinToJsonResume.processInterests(interests);
              return;
            });

          case (entry.filename.indexOf('Projects.csv') !== -1):
            return readEntryContents(entry).then(contents => {
              const elements = csvToArray(contents);
              const projects = elements.slice(1, elements.length - 1).map(elem => ({
                title: elem[0],

                startDate: moment(elem[1]).format('YYYY-MM-DD'),

                endDate: elem[2] ? moment(elem[2]).format('YYYY-MM-DD') : null,

                description: elem[3],
                url: elem[4]
              }));
              linkedinToJsonResume.processProjects(projects.sort((p1,p2) =>
                (+p2.startDate.year - +p1.startDate.year) || (+p2.startDate.month - +p1.startDate.month)
              ));
              return;
            });

          default:
            return Promise.resolve([]);
        }
      });

      Promise.all(promises).then(() => {
        filedrag.innerHTML = 'Dropped! See the resulting JSON Resume at the bottom.';
        const output = document.getElementById('output');
        output.innerHTML = JSON.stringify(linkedinToJsonResume.getOutput(), undefined, 2);
        Prism.highlightElement(output);
        downloadButton.style.display = 'block';
        document.getElementById('result').style.display = 'block';
      });
    });
  }

  // file select
  fileselect.addEventListener('change', fileSelectHandler, false);

  const xhr = new XMLHttpRequest();
  if (xhr.upload) {
    // file drop
    filedrag.addEventListener('dragover', fileDragHover, false);
    filedrag.addEventListener('dragleave', fileDragHover, false);
    filedrag.addEventListener('drop', fileSelectHandler, false);
    filedrag.style.display = 'block';
  } else {
    filedrag.style.display = 'none';
  }

  document.getElementById('select-file').addEventListener('click', () => {
    fileselect.click();
  });

  zip.workerScriptsPath = `${window.location.pathname}vendor/`;
}))();
