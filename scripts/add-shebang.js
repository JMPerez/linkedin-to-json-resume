const fs = require('fs');
const path = 'dist-cli/cli.js';
let content = fs.readFileSync(path, 'utf8');
if (!content.startsWith('#!/usr/bin/env node')) {
  content = '#!/usr/bin/env node\n' + content;
  fs.writeFileSync(path, content);
  console.log('Shebang added to', path);
} else {
  console.log('Shebang already present');
}
