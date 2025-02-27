import { processors } from './converter';

const filedrag = document.getElementById("filedrag");
const fileselect = document.getElementById("fileselect");
let fileName = null;

interface FileReaderEventTarget extends EventTarget {
  result: string;
}

interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage(): string;
}

interface Window {
  ga: any;
  Prism: { highlightElement(elem: HTMLElement): void };
}

// file drag hover
function fileDragHover(e) {
  e.stopPropagation();
  e.preventDefault();
  e.target.className = e.type === "dragover" ? "hover" : "";
}

let linkedinToJsonResume;

const downloadButton = <HTMLElement>document.querySelector(".download");
downloadButton.addEventListener("click", () => {
  import("./file").then((save) => {
    save.default(
      JSON.stringify(linkedinToJsonResume.getOutput(), undefined, 2),
      "resume.json"
    );
    if (window.ga) {
      window.ga("send", "event", "linkedin-to-json-resume", "download-resume");
    }
  });
});
downloadButton.style.display = "none";

// file selection
function fileSelectHandler(e) {
  if (window.ga) {
    window.ga("send", "event", "linkedin-to-json-resume", "file-selected");
  }
  Promise.all([
    import("./converter"),
    import("moment"),
    import("isomorphic-unzip/zip-browser"),
    import("./csvtoarray"),
  ]).then((modules) => {
    const [LinkedInToJsonResume, Moment, Unzip, CsvToArray] = modules;
    const csvToArray = CsvToArray.default;
    const moment = Moment.default;
    linkedinToJsonResume = new LinkedInToJsonResume.default();

    // cancel event and hover styling
    fileDragHover(e);

    const droppedFiles = e.target.files || e.dataTransfer.files;

    const file = droppedFiles[0];
    fileName = file.name;

    const readBlob = (blob: Blob): Promise<string> => {
      return new Promise((resolve) => {
        let reader = new FileReader();
        reader.onload = (e: FileReaderEvent) => {
          resolve(e.target.result);
        };
        reader.readAsText(blob);
      });
    };

    const readEntryContents = (entry: any): Promise<string> => {
      return new Promise((resolve) => {
        Unzip.default.getEntryData(entry, (error, blob) => {
          readBlob(blob).then(resolve);
        });
      });
    };

    let unzip = null;
    const getEntries = (file, onend) => {
      unzip = new Unzip.default(file);
      unzip.getEntries(function (error, entries) {
        onend(entries);
      });
    };

    getEntries(file, (entries) => {
      // Ensuring that "Profile.csv" is the first file in the zip
      // Solving the phone number being processed before the profile
      // Find the index of "Profile.csv", move it to the beginning
      const profileIndex = entries.findIndex(
        (entry) => entry.filename === "Profile.csv"
      );
      if (profileIndex !== -1) {
        const [profileEntry] = entries.splice(profileIndex, 1);
        entries.unshift(profileEntry);
      }

      const promises = entries.map((entry) => {
        return readEntryContents(entry).then((content) => {
          for (const [csvName, processor] of Object.entries(processors)) {
            if (entry.filename.indexOf(csvName) !== -1) {
              processor({ content, linkedinToJsonResume });
              return;
            }
          }
        });
      });

      Promise.all(promises).then(() => {
        if (window.ga) {
          window.ga(
            "send",
            "event",
            "linkedin-to-json-resume",
            "file-parsed-success"
          );
        }
        filedrag.innerHTML =
          "Dropped! See the resulting JSON Resume at the bottom.";
        const output = document.getElementById("output");
        output.innerHTML = JSON.stringify(
          linkedinToJsonResume.getOutput(),
          undefined,
          2
        );
        window.Prism.highlightElement(output);
        downloadButton.style.display = "block";
        document.getElementById("result").style.display = "block";
      });
    });
  });
}

// file select
fileselect.addEventListener("change", fileSelectHandler, false);

const xhr = new XMLHttpRequest();
if (xhr.upload) {
  // file drop
  filedrag.addEventListener("dragover", fileDragHover, false);
  filedrag.addEventListener("dragleave", fileDragHover, false);
  filedrag.addEventListener("drop", fileSelectHandler, false);
  filedrag.style.display = "block";
} else {
  filedrag.style.display = "none";
}

document.getElementById("select-file").addEventListener("click", () => {
  fileselect.click();
});
