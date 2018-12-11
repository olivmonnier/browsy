module.exports = function() {
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

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

  function isTextNode(node){
    return ( node.nodeType === 3 );
  }

  function isInline(el) {
    return window.getComputedStyle(el).getPropertyValue('display') === 'inline';
  }

  function offset(el) {
    const rect = el.getBoundingClientRect();  

    return { 
      top: (rect.top + scrollTop) + 'px', 
      left: (rect.left + scrollLeft) + 'px', 
      width: Math.ceil(rect.width) + 'px', 
      height: Math.ceil(rect.height) + 'px' 
    }
  }

  function getStylesText(node) {
    const styles = window.getComputedStyle(node)
    const { padding, fontFamily, fontSize, fontWeight, color, textAlign, textTransform, lineHeight, whiteSpace, letterSpacing } = styles;

    return { padding, fontFamily, fontSize, fontWeight, color, textAlign, textTransform, lineHeight, whiteSpace, letterSpacing }
  }
  
  const treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    { acceptNode: (node) => !isHidden(node.parentElement) },
    false
  );
  
  while(treeWalker.nextNode()) {
    const { currentNode } = treeWalker;
    const parentEl = currentNode.parentElement;
    const span = document.createElement('span');

    if (currentNode.textContent.trim() !== '') {
      span.setAttribute('data-browsy-node', 'text');
      currentNode.parentNode.insertBefore(span, currentNode);
      span.appendChild(currentNode); 
      
      parentEl.setAttribute('data-browsy-node', 'parent');
    }
  }

  const parentNodes = Array.from(document.querySelectorAll('[data-browsy-node="parent"]'));

  return parentNodes.map(parentNode => {
    const parentEl = parentNode.parentElement;

    if (parentEl.hasAttribute('data-browsy-node') && parentEl.getAttribute('data-browsy-node')) return null;

    const childNodes = Array.from(parentNode.childNodes)
      .filter(node => (
          node.textContent.trim() !== '' &&
          node.hasAttribute('data-browsy-node') && 
          node.getAttribute('data-browsy-node') === 'text'
        ) || (
          node.nodeType === 1 && isInline(node)
        )
      );

    return {
      tagName: parentNode.tagName,
      offset: offset(parentNode),
      styles: getStylesText(parentNode),
      text: childNodes.map(node => node.textContent).join('')
    }
  }).reduce((acc, curr) => curr ? [].concat(acc, curr) : acc, []);
}