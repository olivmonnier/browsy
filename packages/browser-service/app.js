const puppeteer = require('puppeteer');
const css = require('css');
const url = require('url');
const encode = require( 'hashcode' ).hashCode;
const { getTextNodes, hideTextNodes } = require('./page');
const { renderLayout } = require('./renders');
const getFontFamily = require('./utils/getFontFamily');
const optionsDefault = require('./defaults');
const fs = require('fs');

module.exports = async function(link = 'https://google.com', options = {}) {
  try {
    let browser, browserWSEndpoint, FONTS = [], STYLESHEETS = [];

    const newOptions = Object.assign({}, optionsDefault, options)
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

    const bg = await page.screenshot(Object.assign({
      type: 'jpeg', 
      fullPage: true,
      encoding: 'base64'
    }, newOptions.screenshot));
    const html = renderLayout(textNodes, FONTS, bg);
    const hash = encode().value(bg);

    await browser.close();
    
    return { html, hash, browserWSEndpoint };
    
  } catch (e) {
    console.error(e);
  }
}