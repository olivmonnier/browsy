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

  function offset(el) {
    const rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return { 
      top: (rect.top + scrollTop) + 'px', 
      left: (rect.left + scrollLeft) + 'px', 
      width: Math.ceil(rect.width) + 'px', 
      height: Math.ceil(rect.height) + 'px' 
    }
  }

  function getOffsetTextNode(node) {  
    const span = document.createElement('span');
    span.setAttribute('data-browsy-node', 'text');
    node.parentNode.insertBefore(span, node);

    const { left } = offset(span);

    span.appendChild(node); 
    
    const { top, width, height } = offset(node.parentElement);
    
    return { top, left, width, height }
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
        positions: getOffsetTextNode(currentNode),
        text: getTextOfTextNode(currentNode),
        parentTagName: parentEl.tagName
      }

      nodeList.push(textNode);
    }
  }

  return nodeList;
}