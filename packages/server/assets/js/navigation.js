let browserId;

const $formNav = document.querySelector('.form-nav');
const $inputUrl = document.querySelector('input[name="url"]');
const $iframe = document.querySelector('iframe');
const $checkboxFonts = document.querySelector('.checkbox-fonts');
const $inputQuality = document.querySelector('input[name="quality"]');

$formNav.addEventListener('submit', function(e) {
  e.preventDefault();

  const { target } = e;
  const formUrl = target.getAttribute('action');
  const method = target.getAttribute('method');
  const headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  const viewport = { width, height };
  const fonts = $checkboxFonts.checked;
  const quality = parseInt($inputQuality.value, 10);
  const options = Object.assign({}, { viewport, fonts, screenshot: { quality } }, 
    {}//(browserId) ? { browserWSEndpoint: browserId } : {}
  );
  const url = $inputUrl.value;
  const body = JSON.stringify({ url, options });

  $iframe.parentElement.classList.add('loading');

  fetch(formUrl, { headers, method, body })
    .then(response => response.json())
    .then(json => {
      const { html, fonts, imgBackground, browserWSEndpoint } = json.locals;
      const doc = new DOMParser().parseFromString(html, 'text/html');

      browserId = browserWSEndpoint;
      buildBackground(imgBackground, doc);
      buildFontStyles(fonts, doc);

      $iframe.setAttribute('src', `data:text/html;charset=utf-8,${encodeURI(
        doc.documentElement.innerHTML
      )}`);
    })
    .finally(() => $iframe.parentElement.classList.remove('loading'));
});

function htmlToElement(html) {
  const template = document.createElement('template');

  template.innerHTML = html.trim();

  return template.content.firstChild;
}

function buildBackground(imgString, dom) {
  const $imgBackground = htmlToElement(imgString);

  dom.body.prepend($imgBackground);
}

function buildFontStyles(fonts, dom) {
  const $style = htmlToElement(`<style>${fonts}</style>`);

  dom.head.appendChild($style);
}