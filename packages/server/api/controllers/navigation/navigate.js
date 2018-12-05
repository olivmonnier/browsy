const browserService = require('@browsy/browser-service');

module.exports = {


  friendlyName: 'Navigate',


  description: 'Navigate navigation.',


  inputs: {
    url: {
      type: 'string',
      required: true
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
    const { html } = await browserService(inputs.url);

    // All done.
    return exits.json({
      locals: { html}
    });
  }
};
