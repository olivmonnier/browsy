const puppeteer = require('puppeteer');
const fs = require('fs');
const globalizeTextNodes = require('./page/globalizeTextNodes');
const hideTextNodes = require('./page/hideTextNodes');

(async () => {
  const fonts = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('response', async resp => {
    const href = resp.url();
    const type = resp.request().resourceType();
    const headers = resp.headers();

    if (resp.ok()) {
      if (type === 'font') {
        const buffer = await resp.buffer();
        const fontContent = `data:${headers['content-type']};charset=utf-8;base64,${buffer.toString('base64')}`;

        fonts.push({ href, data: fontContent });
      }
    }
  });

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://lalettrea.fr');
  await page.evaluate(globalizeTextNodes);
  const textNodes = await page.evaluate(() => {
    return window.TEXT_NODES
  });
  await page.evaluate(hideTextNodes);
  await page.screenshot({path: 'capture.jpg', type: 'jpeg', fullPage: true});

  await browser.close();

  const html = `<html><head><style>
    html, body {
      margin: 0;
      width: 100%;
      height: 100%;
      overflow-y: 'auto';
      position: relative;
    }
    .bg {
      width: 1920px;
      height: auto;
    }
  </style></head><body><img class="bg" src="./capture.jpg"/>
    ${ textNodes.map(node => {
      const { top, left, height, width } = node.positions;
      const { fontFamily, fontSize, fontWeight, color, textAlign, textTransform, textDecoration, lineHeight } = node.styles;
      const stylesString = `style="position:absolute;top:${top};left:${left};width:${width};height:${height};font-family:${fontFamily};font-size:${fontSize};font-weight:${fontWeight};color:${color};text-align:${textAlign};text-transform:${textTransform};text-decoration:${textDecoration};line-height:${lineHeight}"`
      return `<${node.parentTagName} ${stylesString}>${node.text}</${node.parentTagName}>`;
    }).join('') }
  </body></html>`;

  fs.writeFileSync('test.html', html);
})();