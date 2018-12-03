module.exports = function () {
  const arr = [];
  const sheets = Array.from(document.styleSheets);

  sheets.forEach(sheet => {
    try {
        const rules = Array.from(sheet.rules) || Array.from(sheet.cssRules) || [];

        rules.forEach(rule => {
            if (rule.constructor.name === 'CSSFontFaceRule') {
                arr.push([rule.style.fontFamily, rule.style.src])
            }
        })
    } catch (e) {
        return;
    }
  });

  window.FONTS = arr;

  return arr;
}