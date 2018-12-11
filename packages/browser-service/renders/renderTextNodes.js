module.exports = function(textNodes) {
  return textNodes.map(node => {
    const { top, left, height, width } = node.offset;
    const { padding, fontFamily, fontSize, fontWeight, color, textAlign, textTransform, lineHeight, whiteSpace, letterSpacing } = node.styles;
    const stylesString = `style='padding:${padding};top:${top};left:${left};width:${width};height:${height};font-family:${fontFamily};font-size:${fontSize};font-weight:${fontWeight};color:${color};text-align:${textAlign};text-transform:${textTransform};line-height:${lineHeight};white-space:${whiteSpace};letter-spacing:${letterSpacing};'`
    return `<${node.tagName.toLowerCase()} ${stylesString}>${node.text.trim()}</${node.tagName.toLowerCase()}>`;
  }).join('').replace(/\n/g, '')
}