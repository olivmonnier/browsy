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
    }
  },


  fn: async function (inputs, exits) {
    const { html } = await browserService(inputs.url);

    // All done.
    return exits.success({
      locals: { html}
    });
  }
};
