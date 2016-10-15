/* global URL, Blob  */
/* exported save */
const save = ((() => {
  // saveAs from https://gist.github.com/MrSwitch/3552985
  const saveAs = window.saveAs || (window.navigator.msSaveBlob ? (b, n) => window.navigator.msSaveBlob(b, n) : false) || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs || ((() => {

      // URL's
      window.URL = window.URL || window.webkitURL;

      if (!window.URL) {
        return false;
      }

      return (blob, name) => {
        const url = URL.createObjectURL(blob);

        // Test for download link support
        if ('download' in document.createElement('a')) {

          const a = document.createElement('a');
          a.setAttribute('href', url);
          a.setAttribute('download', name);

          // Create Click event
          const clickEvent = document.createEvent('MouseEvent');
          clickEvent.initMouseEvent('click', true, true, window, 0,
            0, 0, 0, 0, false, false, false, false, 0, null);

          // dispatch click event to simulate download
          a.dispatchEvent(clickEvent);

        } else {
          // fallover, open resource in new tab.
          window.open(url, '_blank', '');
        }
      };
    }))();

  function _save(text, fileName) {
    const blob = new Blob([text], {
      type: 'text/plain'
    });
    saveAs(blob, fileName || 'subtitle.srt');
  }

  return _save;
}))();

export default save;
