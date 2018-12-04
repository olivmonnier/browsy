const fs = require('fs');
const service = require('./app');

(async function() {
  const { html } = await service('https://lemonde.fr');
  fs.writeFileSync('test.html', html, 'utf8');
})();
