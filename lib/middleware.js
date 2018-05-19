const {validate} = require('joi');
const {badRequest} = require('boom');

exports.middleware = middleware;

/**
 * Depending on the request method used, the validator will use the following
 *  defaults to read from the specified property of the request object
 *  (e.g. GET ==> req.query) and to write to a specified property of the
 *  response object (e.g. POST ==> res.locals.body).
 */
const readWriteDefaults = new Proxy({
  GET: 'query',
  POST: 'body',
  PUT: 'body',
  PATCH: 'body',
  DELETE: 'query'
}, {
  get(obj, key) {
    return key in obj ? obj[key] : 'query';
  }
});

/**
 * Express middleware to validate request query parameters, bodies, and headers.
 * @private
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @param {Object} [schema={}] A Joi schema object.
 * @param {Object} [options={stripUnknown: true}] A Joi validation options
 *  object.
 * @param {Object} [param6]
 * @param {String} [param6.readFrom=query or body] The path to read from
 *  the request object (if undefined it will default to either the query or body
 *  of the request object depending on the request method).
 * @param {String} [param6.writeTo=query or body] The path to set the
 *  validated/cast values on the response locals object (if undefined it will
 *  default to either the query or body of the request object depending on the
 *  request method).
 * @return {Promise}
 */
function middleware(
  req,
  {locals},
  next,
  schema = {},
  options = {},
  {
    readFrom = readWriteDefaults[req.method],
    writeTo = readWriteDefaults[req.method]
  } = {}
) {
  /* eslint-disable-next-line no-param-reassign */
  options = {
    stripUnknown: true,
    ...options
  };

  const {error, value} = validate(req[readFrom], schema, options);

  if (error !== null) {
    return next(badRequest(error.message, error.details));
  }

  // Set the validated and optionally cast values
  locals[writeTo] = {...locals[writeTo], ...value};

  next();
}
