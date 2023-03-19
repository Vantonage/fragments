// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a fragment by id info
 */
module.exports = async (req, res) => {

  try {
    logger.debug(`Getting fragment info for this user ${req.user}`);
    var fragment = await Fragment.byId(req.user, req.params.id);
    res.status(200).json(createSuccessResponse ({
        fragment: fragment,
    }))
  } catch (err) {
    logger.error(err);
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
