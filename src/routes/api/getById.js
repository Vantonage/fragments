// src/routes/api/get.js
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('path');

/**
 * Get a fragment by id
 */
module.exports = async (req, res) => {
  var id = path.parse(req.url).name;

  try {
    logger.debug(`Getting fragment for this user ${req.user}`);
    var fragment = new Fragment(await Fragment.byId(req.user, id));
    var fragmentData = await fragment.getData();
    res.status(200).setHeader('content-type', fragment.type).send(fragmentData);
  } catch (err) {
    logger.error(err);
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
