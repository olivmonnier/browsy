let isUrl;

exports.hideElements = elements => {
  for (const element of elements) {
    element.style.visibility = "hidden";
  }
};
exports.removeElements = elements => {
  for (const element of elements) {
    element.style.display = "none";
  }
};
exports.getBoundingClientRect = element => {
  const { height, width, x, y } = element.getBoundingClientRect();
  return { height, width, x, y };
};
exports.getBodyBoundingClientRect = () => {
  const { height, width, x, y } = document.body.getBoundingClientRect();
  return { height, width, x, y };
};
exports.scaleElements = ratio => elements => {
  for (const element of elements) {
    element.style.transform = `scale(${ratio})`;
    element.style.transformOrigin = "0 0";
  }
};
exports.scaleBody = ratio => {
  document.body.style.transform = `scale(${ratio})`;
  document.body.style.transformOrigin = "0 0";
};
exports.isUrl = isUrl = string => /^(https?|file):\/\/|^data:/.test(string);
exports.getInjectKey = (ext, value) =>
  isUrl(value) ? "url" : value.endsWith(`.${ext}`) ? "path" : "content";
