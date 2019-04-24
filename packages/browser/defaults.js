module.exports = {
  puppeteer: {
    headless: true,
    args: ["--no-sandbox"]
  },
  viewport: {
    width: 1920,
    height: 2080
  },
  screenshot: {
    quality: 30
  },
  timeout: 60,
  debug: true
};
