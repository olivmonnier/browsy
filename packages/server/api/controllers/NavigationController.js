const browserService = require('@browsy/browser-service');

module.exports = {
  navigate: async function(req, res) {
    const { url, options } = req.allParams();
    const resp = await browserService(url, options);

    // All done.
    return res.json({
      locals: resp
    });
  }
}