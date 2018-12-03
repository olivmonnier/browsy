module.exports = function() {
  function isHidden(el) {
    const style = window.getComputedStyle(el);
    
    if (style.visibility === 'hidden' || style.opacity === 0) {
      return true;
    } else if (style.position === 'fixed') {
      return (style.display === 'none')
    } else return (el.offsetParent === null);
  }

  function getPositionsTextNode(node) {  
    const span = document.createElement('span');
    node.parentNode.insertBefore(span, node);
    span.appendChild(node); 
    const { top, left, right, bottom, height, width } = span.getBoundingClientRect();

    return { top, left, right, bottom, height, width }
  }
  
  function getTextOfTextNode(node) {
    return node.textContent
    // return node.textContent.split('').map((char) => {
    //   return char === ' ' ? '\u00A0' : char
    // }).join('');
  }

  function getStylesText(node) {
    const styles = window.getComputedStyle(node)
    const { fontFamily, fontSize, fontWeight, color, textAlign, textTransform, lineHeight, whiteSpace } = styles;

    return { fontFamily, fontSize, fontWeight, color, textAlign, textTransform, lineHeight, whiteSpace }
  }
  
  const nodeList = [];
  const treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    { acceptNode: (node) => !isHidden(node.parentElement) },
    false
  );
  
  while(treeWalker.nextNode()) {
    const { currentNode } = treeWalker;
    const parentEl = currentNode.parentElement;

    if (currentNode.textContent.trim() !== '') {

      const textNode = {
        el: currentNode,
        parentEl,
        styles: getStylesText(parentEl),
        positions: getPositionsTextNode(currentNode),
        text: getTextOfTextNode(currentNode),
        parentTagName: parentEl.tagName
      }

      nodeList.push(textNode);
    }
  }
  window.TEXT_NODES = nodeList;

  return nodeList;
}