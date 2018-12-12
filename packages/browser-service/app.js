const puppeteer = require('puppeteer');
const css = require('css');
const url = require('url');
const { backgroundQuality, getTextNodes, hideTextNodes } = require('./page');
const { renderLayout, renderFonts } = require('./renders');
const getFontFamily = require('./utils/getFontFamily');
const optionsDefault = require('./defaults');

module.exports = async function(link = '', options = {}) {
  let browser, browserWSEndpoint, FONTS = [], STYLESHEETS = [];

  process.on('uncaughtException', () => {
    if (browser) browser.close();
  });

  process.on('unhandledRejection', () => {
    if (browser) browser.close();
  });

  try {
    const newOptions = Object.assign({}, optionsDefault, options);
    const quality = newOptions.screenshot.quality / 100;
    const { protocol, hostname, pathname } = url.parse(link);
    const newUrl = url.format({ 
      protocol: protocol || 'http:', 
      hostname, 
      pathname 
    });

    if (options.browserWSEndpoint) {
      let { browserWSEndpoint } = newOptions;
      browser = await puppeteer.connect({ browserWSEndpoint });
    } else {
      browser = await puppeteer.launch(newOptions.puppeteer);
      browserWSEndpoint = browser.wsEndpoint();
    }

    const page = await browser.newPage();
  
    page.on('response', async resp => {
      const href = resp.url();
      const type = resp.request().resourceType();
      const headers = resp.headers();
  
      if (resp.ok()) {
        if (type === 'font' && newOptions.fonts) {
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
  
    await page.setViewport(newOptions.viewport);
    await page.goto(newUrl, { waitUntil: 'networkidle0' });
    const textNodes = await page.evaluate(getTextNodes) || [];
    if (newOptions.fonts) {
      FONTS = getFontFamily(FONTS, STYLESHEETS)
    }
    
    if (textNodes.length > 0) {
      await page.evaluate(hideTextNodes);
    }
    
    const pageRect = await page.evaluate(backgroundQuality, quality);

    const buffer = await page.screenshot({
      type: 'jpeg', 
      fullPage: false,
      clip: {
        x: pageRect.left,
        y: pageRect.top,
        width: pageRect.width,
        height: pageRect.height
      },
      quality: 90,
      encoding: 'base64'
    });
    const imgBackground = `<img src="data:image/jpeg;base64,${buffer}" style="width:${newOptions.viewport.width}px;height: auto;"/>`;
    const fonts = FONTS ? renderFonts(FONTS) : '';
    const html = renderLayout(textNodes);
    await browser.close();
    
    return { html, fonts, imgBackground, browserWSEndpoint };
    
  } catch (e) {
    console.error(e);
  }
}