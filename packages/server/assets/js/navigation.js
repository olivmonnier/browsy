const $formNav = document.querySelector('.form-nav');
const $inputUrl = document.querySelector('input[name="url"]');
const $iframe = document.querySelector('iframe');

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
  const options = { viewport };
  const url = $inputUrl.value;
  const body = JSON.stringify({ url, options });

  fetch(formUrl, { headers, method, body })
    .then(response => response.json())
    .then(json => {
      const { html } = json.locals;

      $iframe.setAttribute('src', `data:text/html;charset=utf-8,${encodeURI(html)}`);
    });
});