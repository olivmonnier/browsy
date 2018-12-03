module.exports = function(url) {
  const fontUrlSplitted = url.split('/');
  const fontFileName = fontUrlSplitted[fontUrlSplitted.length - 1];

  if (fontFileName.includes('woff2')) {
    return 'woff2'
  } else if (fontFileName.includes('woff')) {
    return 'woff'
  } else if (fontFileName.includes('eot?#iefix')) {
    return 'embedded-opentype'
  } else if (fontFileName.includes('ttf')) {
    return 'truetype'
  } else if (fontFileName.includes('svg')) {
    return 'svg'
  } else return ''
}