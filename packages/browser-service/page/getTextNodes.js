module.exports = function() {
  function isHidden(el) {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const { width, height } = rect;

    if (width <= 1 || height <= 1) {
      return true;
    } else if (style.visibility === 'hidden' || style.opacity === 0) {
      return true;
    } else if (style.position === 'fixed') {
      return (style.display === 'none')
    } else return (el.offsetParent === null);
  }

  function getPositionsTextNode(node) {  
    const span = document.createElement('span');
    span.setAttribute('data-browsy-node', 'text');
    node.parentNode.insertBefore(span, node);
    span.appendChild(node); 
    const rect = node.parentElement.getBoundingClientRect();
    const { top, left, width, height } = rect;
    
    return { top, left, width: Math.ceil(width), height: Math.ceil(height) }
  }
  
  function getTextOfTextNode(node) {
    return node.textContent;
  }

  function getStylesText(node) {
    const styles = window.getComputedStyle(node)
    const { fontFamily, fontSize, fontWeight, color, textAlign, textTransform, lineHeight, whiteSpace, letterSpacing } = styles;

    return { fontFamily, fontSize, fontWeight, color, textAlign, textTransform, lineHeight, whiteSpace, letterSpacing }
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

    parentEl.setAttribute('data-browsy-node', 'parent');

    if (currentNode.textContent.trim() !== '') {
      const textNode = {
        styles: getStylesText(parentEl),
        positions: getPositionsTextNode(currentNode),
        text: getTextOfTextNode(currentNode),
        parentTagName: parentEl.tagName
      }

      nodeList.push(textNode);
    }
  }

  return nodeList;
}