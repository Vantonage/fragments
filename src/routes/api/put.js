// src/routes/api/put.js
const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Update a fragment by id
 */
module.exports = async (req, res) => {


  try {
    logger.debug(`Updating fragment of this id ${req.params.id}`);
    
    const fragment = new Fragment(await Fragment.byId(req.user, req.params.id));
    if (fragment.type === req.get('Content-Type')){
        await fragment.setData(req.body);
        await fragment.save();
        res.status(201).json(createSuccessResponse({ fragment }));
    }
    else{
      return res.status(400).json(createErrorResponse({fragment}));
    }
  } catch (err) {
    logger.error(err);
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
