const puppeteer = require('puppeteer');
const fs = require('fs');
const { getTextNodes, hideTextNodes, getFonts } = require('./page');
const { renderFonts, renderTextNodes } = require('./renders');
const findFontFamilyByUrl = require('./utils/findFontFamilyByUrl');
const findFormatFont = require('./utils/findFormatFont');

(async () => {
  try {
    let fonts = [];
    const puppeteerOptions = {
      headless: false
    }
    const browser = await puppeteer.launch(puppeteerOptions);
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
    await page.goto('https://medium.com/');
    // await page.waitForNavigation({ waitUntil: 'load' });
    const fontsUsed = await page.evaluate(getFonts);
    const textNodes = await page.evaluate(getTextNodes);
    await page.evaluate(hideTextNodes);
    await page.screenshot({path: 'capture.jpg', type: 'jpeg', fullPage: true});
    
    await browser.close();
    
    const fontsFace = fonts.map(font => {
      return Object.assign({}, font, { 
        fontFamily: findFontFamilyByUrl(fontsUsed, font.href),
        format: findFormatFont(font.href)
      });
    });
  
    let html = `<html><head><meta charset="utf-8" /><style>
  
      * {
        margin: 0;
        text-decoration: none;
      }
      html, body {
        margin: 0;
        width: 100%;
        height: 100%;
        overflow-y: 'auto';
        position: relative;
      }
      button {
        background: transparent;
        border: none;
        padding: 0;
      }
      .bg {
        width: 1920px;
        height: auto;
      }
    </style></head><body><img class="bg" src="./capture.jpg"/>${ renderTextNodes(textNodes) }</body></html>`;
  
    fs.writeFileSync('test.html', html, 'utf8');
  } catch (e) {
    console.error(e)
  }
})();