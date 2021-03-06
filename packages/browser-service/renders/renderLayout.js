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
  }
  body {
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  main {
    position: relative;
  }
  main *, img {
    position: absolute;
  }
  button {
    background: transparent;
    border: none;
    padding: 0;
  }
  li {
    list-style: none;
  }
  img {
    image-rendering: optimizeSpeed;             
    image-rendering: -moz-crisp-edges;          /* Firefox                        */
    image-rendering: -o-crisp-edges;            /* Opera                          */
    image-rendering: -webkit-optimize-contrast; /* Chrome (and eventually Safari) */
    image-rendering: pixelated; /* Chrome */
    image-rendering: optimize-contrast;         /* CSS3 Proposed                  */
    user-select: none;
  }
`;

module.exports = function(textNodes) {
  return '<html><head><meta charset="utf-8" /><style>' +
    styles.replace(/\n/g, '') + 
    '</style></head><body><main>' +
    renderTextNodes(textNodes) +
    '</main></body></html>';
}