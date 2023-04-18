// src/routes/api/delete.js
const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Delete a fragment by id
 */
module.exports = async (req, res) => {
  try {
    logger.debug(`Deleting fragment of this id ${req.params.id}`);
    var id = req.params.id;
    await Fragment.delete(req.user, id);
    res.status(200).json(createSuccessResponse());
  } catch (err) {
    logger.error(err);
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
