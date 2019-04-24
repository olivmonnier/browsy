const Koa = require("koa");
const koaBody = require("koa-body");
const compress = require("koa-compress");
const browser = require("@browsy/browser");

const PORT = process.env.PORT || 3000;

const app = new Koa();

app.use(compress());
app.use(koaBody());

app.use(async function(ctx) {
  const body = ctx.request.body;
  const { url, options } = body;
  const { imgBase64 } = await browser(url, options);
  const html = `
<html>
  <body>
    <img src="${imgBase64}"/>
  </body>
</html>`;

  ctx.body = html;
  ctx.compress = true;
  ctx.set("Content-Type", "text/plain");
});

const server = app.listen(PORT);

module.exports = server;
