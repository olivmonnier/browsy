const renderFonts = require('./renderFonts');
const renderTextNodes = require('./renderTextNodes');
const styles = `
  * {
    margin: 0;
    text-decoration: none;
  }
  html, body {
    margin: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: relative;
  }
  button {
    background: transparent;
    border: none;
    padding: 0;
  }
  body * {
    position: absolute;
  }
  .bg {
    width: 100%;
    height: auto;
    image-rendering: optimizeSpeed;             
    image-rendering: -moz-crisp-edges;          /* Firefox                        */
    image-rendering: -o-crisp-edges;            /* Opera                          */
    image-rendering: -webkit-optimize-contrast; /* Chrome (and eventually Safari) */
    image-rendering: pixelated; /* Chrome */
    image-rendering: optimize-contrast;         /* CSS3 Proposed                  */
  }
`;

module.exports = function(textNodes, fonts, bg) {
  return '<html><head><meta charset="utf-8" /><style>' + 
    (fonts ? renderFonts(fonts) : '') +
    styles.replace(/\n/g, '') + 
    '</style></head><body>' +
    '<img class="bg" src="data:image/jpeg;base64,' + bg + '"/>' + 
    renderTextNodes(textNodes) +
    '</body></html>';
}