// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

const logger = require('../logger');

// convert to markdown
const md = require('markdown-it')();
// convert images
const sharp = require('sharp');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    this.id = id ? id : randomUUID();

    if (!ownerId && !type) {
      throw new Error('Owner id and type are incorrect');
    } else if (!ownerId) {
      throw new Error('Id incorrect');
    } else if (!type) {
      throw new Error('Type is incorrect');
    } else {
      this.ownerId = ownerId;
      if (Fragment.isSupportedType(type)) {
        this.type = type;
      } else {
        throw new Error('Not supported type');
      }
    }

    if (created) {
      this.created = created;
    } else {
      this.created = new Date().toISOString();
    }

    if (updated) {
      this.updated = updated;
    } else {
      this.updated = new Date().toISOString();
    }

    if (typeof size != 'number') {
      throw new Error('Size needs to be a number');
    } else if (size < 0) {
      throw new Error('Size cannot be negative');
    } else {
      this.size = size;
    }
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    try {
      logger.debug({ ownerId, expand }, 'Fragment.byUser()');
      return await listFragments(ownerId, expand);
    } catch (err) {
      return [];
    }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    try {
      logger.debug(`Searching Fragment data of ${ownerId} for their id: ${id}`);

      const fragment = await readFragment(ownerId, id);
      if (!fragment) {
        logger.warn('No Fragment found');
        throw new Error('Fragment not found');
      }

      return fragment;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    logger.info(`Deleting fragment ${id} from owner ${ownerId}`);
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    logger.info(`Saving fragment ${this} to the database`);
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    logger.info(`Getting fragment data ${this.id} from owner ${this.ownerId}`);
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    try {
      logger.debug('Getting data');
      if (!Buffer.isBuffer(data)) {
        logger.warn(`Wrong data. It is a ${data}`);
        throw new Error('data is not a buffer. Check log for details');
      }
      logger.debug('Setting data');
      this.updated = new Date().toISOString();
      this.size = Buffer.byteLength(data);
      return writeFragmentData(this.ownerId, this.id, data);
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.mimeType.startsWith('text');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    if (this.mimeType === 'text/plain') {
      return ['text/plain'];
    } 
    else if (this.mimeType === 'text/markdown'){
      return ['text/markdown'];
    }
    else if (this.mimeType === 'text/html'){
      return ['text/html'];
    }
    else if (this.mimeType === 'application/json'){
      return ['application/json'];
    }
    else if (this.mimeType === 'image/png'){
      return ['image/png'];
    }
    else if (this.mimeType === 'image/jpeg'){
      return ['image/jpeg'];
    }
    else if (this.mimeType === 'image/gif'){
      return ['image/gif'];
    }
    else if (this.mimeType === 'image/webp'){
      return ['image/webp'];
    }
    else {
      throw new Error('Cannot be supported');
    }
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    if (value == 'text/plain' || value == 'text/plain; charset=utf-8') {
      return true;
    }
    else if (value == 'text/markdown'){
      return true;
    }
    else if (value == 'text/html'){
      return true;
    }
    else if (value == 'application/json'){
      return true;
    }
    else if (value == 'image/png'){
      return true;
    }
    else if (value == 'image/jpeg'){
      return true;
    }
    else if (value == 'image/webp'){
      return true;
    }
    else if (value == 'image/gif'){
      return true;
    }
    return false;
  }

  validConversion(ext){
    var value = false;
    if (this.type == 'text/plain'){
      if (ext == '.txt'){
        value = true;
      }
    }
    else if(this.type == 'text/markdown'){
      if (ext == '.md' || ext == '.html' || ext == '.txt'){
        value = true;
      }
    }
    else if (this.type == 'text/html'){
      if (ext == '.html' || ext == '.txt'){
        value = true;
      }
    }
    else if (this.type == 'application/json'){
      if (ext == '.json' || ext == '.txt'){
        value = true;
      }
    }
    else if (this.type == 'image/png' || this.type == 'image/jpeg' || this.type == 'image/webp' || this.type == 'image/gif'){
      if (ext == '.png' || ext == '.jpg' || ext == '.webp' || ext == '.gif'){
        value = true;
      }
    }
    return value;
  }

  convertContentType(extension) {
    if (extension == '.txt') {
      return 'text/plain';
    } 
    else if (extension == '.md') {
      return 'text/markdown';
    } 
    else if (extension == '.html') {
      return 'text/html';
    } 
    else if (extension == '.json') {
      return 'application/json';
    } 
    else if (extension == '.png') {
      return 'image/png';
    } 
    else if (extension == '.jpg') {
      return 'image/jpeg';
    } 
    else if (extension == '.webp') {
      return 'image/webp';
    } 
    else if (extension == '.gif') {
      return 'image/gif';
    } 
    else {
      return this.mimeType;
    }
  }
  
  convertFragmentData(data, ext){
    if (ext == '.txt'){
      return data.toString();
    }
    else if (this.mimeType == "text/markdown" && ext == '.html'){
      return md.render(data.toString());
    }
    else if (ext == '.png'){
      return sharp(data).toFormat('png').png().toBuffer();
    }
    else if (ext == '.jpeg'){
      return sharp(data).toFormat('jpeg').jpeg({quality: 100, force: true,}).toBuffer();
    }
    else if (ext == '.gif'){
      return sharp(data).toFormat('gif').gif().toBuffer();
    }
    else if (ext == '.webp'){
      return sharp(data).toFormat('webp').webp().toBuffer();
    }
    else{
      return data;
    }
  }
}

module.exports.Fragment = Fragment;
