module.exports = {
  puppeteer: {
    headless: true
  },
  viewport: {
    width: 1920,
    height: 2080
  },
  screenshot: {
    type: 'jpeg', 
    fullPage: true,
    quality: 1,
    encoding: 'base64'
  },
  fonts: false
}