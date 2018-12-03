const puppeteer = require('puppeteer');
const fs = require('fs');
const { getTextNodes, hideTextNodes, getFonts } = require('./page');
const { renderLayout } = require('./renders');
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
    await page.goto('https://www.nytimes.com/');
    // await page.waitForNavigation({ waitUntil: 'networkidle2' });
    const fontsUsed = await page.evaluate(getFonts) || [];
    const textNodes = await page.evaluate(getTextNodes) || [];
    if (textNodes.length > 0) {
      await page.evaluate(hideTextNodes);
    }
    const bg = await page.screenshot({ 
      type: 'jpeg', 
      fullPage: true,
      quality: 65,
      encoding: 'base64'
    });
    
    await browser.close();
    
    const fontsFace = fonts.map(font => {
      return Object.assign({}, font, { 
        fontFamily: findFontFamilyByUrl(fontsUsed, font.href),
        format: findFormatFont(font.href)
      });
    });
    const html = renderLayout(textNodes, fontsFace, bg);
  
    fs.writeFileSync('test.html', html, 'utf8');
  } catch (e) {
    console.error(e)
  }
})();