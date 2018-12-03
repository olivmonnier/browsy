module.exports = function(fonts) {
  return fonts.map(font => {
    if (font.fontFamily !== '') {
      return `@font-face { font-family: ${font.fontFamily}; src: url(${font.data}); }`
    } else return ''; 
  }).join('');
}