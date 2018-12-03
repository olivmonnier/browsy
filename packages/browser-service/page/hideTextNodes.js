function hideTextNodes() {
  const textNodes = window.TEXT_NODES;

  textNodes.forEach(node => {
    node.el.parentElement.style.color = 'transparent';
    node.el.parentElement.style.textShadow = 'none';
  });
}

module.exports = hideTextNodes;