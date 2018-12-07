module.exports = function(quality) {
  document.body.style.transform = `scale(${quality})`;
  document.body.style.transformOrigin = '0 0';

  const rect = document.body.getBoundingClientRect();
  const { top, left, width, height } = rect;

  return { top, left, width, height }
}