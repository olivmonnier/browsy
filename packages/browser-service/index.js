const puppeteer = require('puppeteer');
const fs = require('fs');
const css = require('css');
const { getTextNodes, hideTextNodes } = require('./page');
const { renderLayout } = require('./renders');

(async () => {
  try {
    let FONTS = [];
    let STYLESHEETS = [];
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
  
          FONTS.push({ href, data: fontContent });
        } 
        else if (type === 'stylesheet') {
          const stylesheetContent = await resp.text();
          const stylesheetContentParsed = css.parse(stylesheetContent, { silent: true });

          STYLESHEETS.push(stylesheetContentParsed.stylesheet);
        }
      }
    });
  
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://lalettrea.fr/', { waitUntil: 'networkidle2' });

    const fontsUsed = STYLESHEETS
      .map(stylesheet => stylesheet.rules)
      .reduce((acc, rules) => acc.concat(rules), [])
      .filter(rule => rule.type === 'font-face');
      
    const textNodes = await page.evaluate(getTextNodes) || [];

    if (textNodes.length > 0) {
      await page.evaluate(hideTextNodes);
    }
    const bg = await page.screenshot({ 
      type: 'jpeg', 
      fullPage: true,
      quality: 20,
      encoding: 'base64'
    });
    
    await browser.close();
    
    const fontsFace = FONTS.map(font => {
      const url = font.href;

      const fontSrc = fontsUsed.reduce((acc, f) => {
        return f.declarations
          .filter(d => d.property === 'src')
          .find(d => {
            const urlSplitted = url.split('/'); 
            const fontFileName = urlSplitted[urlSplitted.length - 1];

            return d.value.includes(fontFileName)
          }) ? f : acc;
      }, {});

      if (fontSrc && fontSrc.declarations) {
        const fontFamily = fontSrc.declarations
          .filter(d => d.property === 'font-family')
          .reduce((acc, d) => {
            return (d && d.value) ? d.value : acc
          }, '');
  
        return Object.assign({}, font, { fontFamily });
      } else return font;
    });

    const html = renderLayout(textNodes, fontsFace, bg);
    
    fs.writeFileSync('test.html', html, 'utf8');
    
  } catch (e) {
    console.error(e);
  }
})();