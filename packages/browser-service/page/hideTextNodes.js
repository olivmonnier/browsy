function hideTextNodes() {
  const textNodes = Array.from(document.querySelectorAll('[data-browsy-node="text"] > span'));

  textNodes.forEach(node => {
    node.style.color = 'transparent';
    node.style.textShadow = 'none';
  });
}

module.exports = hideTextNodes;