module.exports = function () {
  var fonts = {};

  function getFonts (obj) {
      var o = obj || {},
          sheet = document.styleSheets,
          rule = null,
          i = sheet.length, j;
      while( 0 <= --i ){
          rule = sheet[i].rules || sheet[i].cssRules || [];
          j = rule.length;
          while( 0 <= --j ){
              if( rule[j].constructor.name === 'CSSFontFaceRule' ){ // rule[j].slice(0, 10).toLowerCase() === '@font-face'
                  o[ rule[j].style.fontFamily ] = rule[j].style.src;
              };
          }
      }
      return o;
  }
}