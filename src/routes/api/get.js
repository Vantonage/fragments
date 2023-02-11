// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    logger.debug('Getting a response for GET v1/fragments');

    res.status(200).json(
      createSuccessResponse({
        fragments: await Fragment.byUser(req.user, req.query.expand),
      })
    );
  } catch (err) {
    res.status(404).json(createErrorResponse(404, err));
  }
};
