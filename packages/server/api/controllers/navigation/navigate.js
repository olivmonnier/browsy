const browserService = require('@browsy/browser-service');

module.exports = {


  friendlyName: 'Navigate',


  description: 'Navigate navigation.',


  inputs: {
    url: {
      type: 'string',
      required: true
    },
    options: {
      type: 'ref'
    }
  },


  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/navigate'
    }, 
    json: {
      responseType: '',
      statusCode: 200
    }
  },


  fn: async function (inputs, exits) {
    const { url, options } = inputs;
    const { html } = await browserService(url, options);

    // All done.
    return exits.json({
      locals: { html}
    });
  }
};
