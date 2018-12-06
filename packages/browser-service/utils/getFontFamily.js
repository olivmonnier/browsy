module.exports = function (fonts, stylesheets) {
  const fontsUsed = stylesheets
    .map(stylesheet => stylesheet.rules)
    .reduce((acc, rules) => acc.concat(rules), [])
    .filter(rule => rule.type === 'font-face');

  return fonts.map(font => {
    const url = font.href;

    const fontSrc = fontsUsed.reduce((acc, f) => {
      return f.declarations
        .filter(d => d.property === 'src')
        .find(d => {
          const urlSplitted = url.split('/'); 
          const fontFileName = urlSplitted[urlSplitted.length - 1];

          return d.value.includes(fontFileName)
        }) ? f : acc;
    }, {});

    if (fontSrc && fontSrc.declarations) {
      const fontFamily = fontSrc.declarations
        .filter(d => d.property === 'font-family')
        .reduce((acc, d) => {
          return (d && d.value) ? d.value : acc
        }, '');

      return Object.assign({}, font, { fontFamily });
    } else return font;
  });
}