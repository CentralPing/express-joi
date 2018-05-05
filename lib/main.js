// ESM syntax is supported.
// export {};

/**
 * @module express-joi
*/

const {middleware} = require('./middleware');

/**
 * Configures express middleware to validate request query, parameters or body.
 * @param {Object} [schema={}] A Joi schema object.
 * @param {Object} [options={stripUnknown: true}] A Joi validation options
 *  object.
 * @param {Object} [config]
 * @param {String} [config.readFrom=query or body] The path to read from
 *  the request object (if undefined it will default to either the query or body
 *  of the request object depending on the request method).
 * @param {String} [config.writeTo=query or body] The path to set the
 *  validated/cast values on the response locals object (if undefined it will
 *  default to either the query or body of the request object depending on the
 *  request method).
 * @return {Function} Configured Express middleware.
 */
const validate = (schema, options, config) =>
  (req, res, next) =>
    middleware(req, res, next, schema, options, config);

/**
 * Configures express middleware to validate request body. Reads from
 *  `req.body` and writes to `res.locals.body`.
 * @param {Object} [schema={}] A Joi schema object.
 * @param {Object} [options={stripUnknown: true}] A Joi validation options
 *  object.
 * @return {Function} Configured Express middleware.
 */
const body = (schema, options) =>
  validate(schema, options, {readFrom: 'body', writeTo: 'body'});

/**
 * Configures express middleware to validate request params. Reads from
 *  `req.params` and writes to `res.locals.params`.
 * @param {Object} [schema={}] A Joi schema object.
 * @param {Object} [options={stripUnknown: true}] A Joi validation options
 *  object.
 * @return {Function} Configured Express middleware.
 */
const params = (schema, options) =>
  validate(schema, options, {readFrom: 'params', writeTo: 'params'});

/**
 * Configures express middleware to validate request query parameters. Reads
 *  from `req.query` and writes to `res.locals.query`.
 * @param {Object} [schema={}] A Joi schema object.
 * @param {Object} [options={stripUnknown: true}] A Joi validation options
 *  object.
 * @return {Function} Configured Express middleware.
 */
const query = (schema, options) =>
  validate(schema, options, {readFrom: 'query', writeTo: 'query'});

exports.validate = validate;
exports.body = body;
exports.params = params;
exports.query = query;
