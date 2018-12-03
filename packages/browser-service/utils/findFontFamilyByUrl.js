/**
 * styles: [fontFamily, src]
 */
module.exports = function(styles, url) {
  const fontUrlSplitted = url.split('/');
  const fontFileName = fontUrlSplitted[fontUrlSplitted.length - 1];
  const fontFamily = styles.find(f => f[1].includes(fontFileName));

  return Array.isArray(fontFamily) ? fontFamily[0] : '';
}