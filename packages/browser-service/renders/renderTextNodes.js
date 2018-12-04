module.exports = function(textNodes) {
  return textNodes.map(node => {
    const { top, left, height, width } = node.positions;
    const { fontFamily, fontSize, fontWeight, color, textAlign, textTransform, lineHeight, whiteSpace, letterSpacing } = node.styles;
    const stylesString = `style='position:absolute;top:${top};left:${left};width:${width};height:${height};font-family:${fontFamily};font-size:${fontSize};font-weight:${fontWeight};color:${color};text-align:${textAlign};text-transform:${textTransform};line-height:${lineHeight};white-space:${whiteSpace};letter-spacing:${letterSpacing};'`
    return `<${node.parentTagName} ${stylesString}>${node.text}</${node.parentTagName}>`;
  }).join('')
}