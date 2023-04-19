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
  var extension = path.extname(req.url);
  
  try {
    logger.debug(`Getting fragment ${req.user}`);
    var fragment = new Fragment(await Fragment.byId(req.user, id));
    var type = fragment.type;
    var fragmentData = await fragment.getData();
    if (extension){
      logger.debug(`Conversion in progress`);
      if (fragment.validConversion(extension)){
        logger.debug(`Valid conversion extension`);
        type = fragment.convertContentType(extension);
        logger.debug(type);
        var data = fragment.convertFragmentData(fragmentData, extension);

        logger.debug(type);
        res.setHeader('Content-type', type);
        logger.debug(data);
        res.status(200).send(data);
      }
    }
    else{
        logger.debug(`NO CONVERSION ALLOWED`);
        res.status(200).setHeader('content-type', type).send(fragmentData);
    }
    
  } catch (err) {
    logger.error(err);
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
