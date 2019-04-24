const puppeteer = require("puppeteer");
const url = require("url");
const utils = require("./utils");
const optionsDefault = require("./defaults");

module.exports = async function(link = "", options = {}) {
  let browser, browserWSEndpoint;

  process.on("uncaughtException", () => {
    if (browser) browser.close();
  });

  process.on("unhandledRejection", () => {
    if (browser) browser.close();
  });

  try {
    const opts = Object.assign({}, optionsDefault, options);
    const quality = opts.screenshot.quality / 100;
    const timeoutInSeconds = opts.timeout * 1000;
    const { protocol, hostname, pathname } = url.parse(link);
    const newUrl = url.format({
      protocol: protocol || "http:",
      hostname,
      pathname
    });

    if (options.browserWSEndpoint) {
      let { browserWSEndpoint } = opts;
      browser = await puppeteer.connect({ browserWSEndpoint });
    } else {
      browser = await puppeteer.launch(opts.puppeteer);
      browserWSEndpoint = browser.wsEndpoint();
    }

    const page = await browser.newPage();

    if (opts.debug) {
      page.on("console", message => {
        let { url, lineNumber, columnNumber } = message.location();
        lineNumber = lineNumber ? `:${lineNumber}` : "";
        columnNumber = columnNumber ? `:${columnNumber}` : "";
        const location = url ? ` (${url}${lineNumber}${columnNumber})` : "";
        console.log(`\nPage log:${location}\n${message.text()}\n`);
      });

      page.on("pageerror", error => {
        console.log("\nPage error:", error, "\n");
      });
    }

    if (opts.headers) {
      await page.setExtraHTTPHeaders(opts.headers);
    }

    if (opts.userAgent) {
      await page.setUserAgent(opts.userAgent);
    }

    await page.setViewport(opts.viewport);
    await page.goto(newUrl, {
      timeout: timeoutInSeconds,
      waitUntil: "networkidle0"
    });

    if (opts.hideElements) {
      await Promise.all(
        opts.hideElements.map(selector =>
          page.$$eval(selector, utils.hideElements)
        )
      );
    }

    if (opts.removeElements) {
      await Promise.all(
        opts.removeElements.map(selector =>
          page.$$eval(selector, utils.removeElements)
        )
      );
    }

    if (opts.clickElement) {
      await page.click(opts.clickElement);
    }

    if (opts.scripts) {
      await Promise.all(
        opts.scripts.map(script => {
          return page.addScriptTag({
            [utils.getInjectKey("js", script)]: script
          });
        })
      );
    }

    if (opts.styles) {
      await Promise.all(
        opts.styles.map(style => {
          return page.addStyleTag({
            [utils.getInjectKey("css", style)]: style
          });
        })
      );
    }

    await page.evaluate(utils.scaleBody, quality);
    const { x, y, width, height } = await page.evaluate(
      utils.getBodyBoundingClientRect
    );

    const buffer = await page.screenshot({
      type: "jpeg",
      fullPage: false,
      clip: {
        x,
        y,
        width,
        height
      },
      quality: 90,
      encoding: "base64"
    });
    const imgBase64 = `data:image/jpeg;base64,${buffer}`;
    await browser.close();

    return { imgBase64, browserWSEndpoint };
  } catch (e) {
    console.error(e);
  }
};
