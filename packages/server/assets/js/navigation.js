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
  const url = $inputUrl.value;
  const body = JSON.stringify({ url });

  fetch(formUrl, { headers, method, body })
    .then(response => response.json())
    .then(json => {
      const { html } = json.locals;

      $iframe.setAttribute('src', `data:text/html;charset=utf-8,${encodeURI(html)}`);
    });
});