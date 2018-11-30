function hideTextNodes() {
  const textNodes = window.TEXT_NODES;

  textNodes.forEach(node => {
    node.el.parentElement.style.color = 'transparent';
  });
}

module.exports = hideTextNodes;