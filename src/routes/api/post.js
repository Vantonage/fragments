const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const apiURL = process.env.API_URL;
const logger = require('../../logger');

module.exports = async (req, res) => {
  const type = req.get('Content-Type');
  if (Fragment.isSupportedType(type)) {
    try {
      logger.debug(`Creating a new request: ${req}`);
      const fragment = new Fragment({ ownerId: req.user, type: type });
      await fragment.setData(req.body);
      await fragment.save();

      res.setHeader('Content-Type', fragment.type);
      res.setHeader('Location', apiURL + '/v1/fragments/' + fragment.id);

      res.status(201).json(createSuccessResponse({ fragment }));
    } catch (err) {
      logger.warn(err);
      return res.status(401).json(createErrorResponse(401, err));
    }
  } else {
    res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
  }
};
