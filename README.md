# @CentralPing/express-joi

[![Build Status](https://travis-ci.org/CentralPing/express-joi.svg?branch=master)](https://travis-ci.org/CentralPing/express-joi)
[![Coverage Status](https://coveralls.io/repos/github/CentralPing/express-joi/badge.svg)](https://coveralls.io/github/CentralPing/express-joi)
[![Dependency Status](https://david-dm.org/CentralPing/express-joi.svg)](https://david-dm.org/CentralPing/express-joi)
[![Greenkeeper Status](https://badges.greenkeeper.io/CentralPing/express-joi.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/centralping/express-joi/badge.svg)](https://snyk.io/test/github/centralping/express-joi)

A slightly opinionated Express middleware for validation with Joi.

## Installation

`npm i --save https://github.com/CentralPing/express-joi`

## API Reference

<a name="module_express-joi..validate"></a>

### express-joi~validate([schema], [options], [config]) ⇒ <code>function</code>
Configures express middleware to validate request query, parameters or body.

**Kind**: inner method of [<code>express-joi</code>](#module_express-joi)  
**Returns**: <code>function</code> - Configured Express middleware.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [schema] | <code>Object</code> | <code>{}</code> | A Joi schema object. |
| [options] | <code>Object</code> | <code>{stripUnknown: true}</code> | A Joi validation options  object. |
| [config] | <code>Object</code> |  |  |
| [config.readFrom] | <code>String</code> | <code>query or body</code> | The path to read from  the request object (if undefined it will default to either the query or body  of the request object depending on the request method). |
| [config.writeTo] | <code>String</code> | <code>query or body</code> | The path to set the  validated/cast values on the response locals object (if undefined it will  default to either the query or body of the request object depending on the  request method). |

<a name="module_express-joi..body"></a>

### express-joi~body([schema], [options]) ⇒ <code>function</code>
Configures express middleware to validate request body. Reads from
 `req.body` and writes to `res.locals.body`.

**Kind**: inner method of [<code>express-joi</code>](#module_express-joi)  
**Returns**: <code>function</code> - Configured Express middleware.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [schema] | <code>Object</code> | <code>{}</code> | A Joi schema object. |
| [options] | <code>Object</code> | <code>{stripUnknown: true}</code> | A Joi validation options  object. |

<a name="module_express-joi..params"></a>

### express-joi~params([schema], [options]) ⇒ <code>function</code>
Configures express middleware to validate request params. Reads from
 `req.params` and writes to `res.locals.params`.

**Kind**: inner method of [<code>express-joi</code>](#module_express-joi)  
**Returns**: <code>function</code> - Configured Express middleware.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [schema] | <code>Object</code> | <code>{}</code> | A Joi schema object. |
| [options] | <code>Object</code> | <code>{stripUnknown: true}</code> | A Joi validation options  object. |

<a name="module_express-joi..query"></a>

### express-joi~query([schema], [options]) ⇒ <code>function</code>
Configures express middleware to validate request query parameters. Reads
 from `req.query` and writes to `res.locals.query`.

**Kind**: inner method of [<code>express-joi</code>](#module_express-joi)  
**Returns**: <code>function</code> - Configured Express middleware.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [schema] | <code>Object</code> | <code>{}</code> | A Joi schema object. |
| [options] | <code>Object</code> | <code>{stripUnknown: true}</code> | A Joi validation options  object. |


## Examples

### For Simple Body Validation

```js
const express = require('express');
const { body } = require('express-joi');

const app = express();

const schema = {
  foo: Joi.number(),
  bar: Joi.string()
};
const bodyMiddleware = body(schema);

app.all('/', bodyMiddleware);

/*
POST (JSON) request -> '{"foo":1,"bar":"hello"}'
res.locals would be set to: {body: {foo: 1, bar: 'hello'}}

POST (JSON) request -> '{"foo":"hello","bar":1}'
Error object would be a Boom error for a bad request with a message of '"foo" must be a number'

POST (FORM) request -> 'foo=1&bar=hello'
res.locals would be set to: {body: {foo: 1, bar: 'hello'}}

POST (FORM) request -> 'foo=hello&bar=1'
Error object would be a Boom error for a bad request with a message of '"foo" must be a number'
*/
```

### For Simple Param Validation

```js
const express = require('express');
const { params } = require('express-joi');

const app = express();

const schema = {
  foo: Joi.number(),
  bar: Joi.string()
};
const paramsMiddleware = params(schema);

app.all('/:foo/:bar', paramsMiddleware);

/*
GET request -> /1/hello
res.locals would be set to: {params: {foo: 1, bar: 'hello'}}

GET request -> /hello/1
Error object would be a Boom error for a bad request with a message of '"foo" must be a number'
*/
```

### For Simple Query Validation

```js
const express = require('express');
const { query } = require('express-joi');

const app = express();

const schema = {
  foo: Joi.number(),
  bar: Joi.string()
};
const queryMiddleware = query(schema);

app.all('/', queryMiddleware);

/*
GET request -> ?foo=1&bar=hello
res.locals would be set to: {query: {foo: 1, bar: 'hello'}}

GET request -> ?foo=hello&bar=1
Error object would be a Boom error for a bad request with a message of '"foo" must be a number'
*/
```

### For Custom Validation

```js
const express = require('express');
const { validate } = require('express-joi');

const app = express();

const schema = {
  foo: Joi.number(),
  bar: Joi.string()
};
const validateMiddleware = validate(schema, {stripUnknown: false}, {
  readFrom: 'query',
  writeTo: 'validated'
});

app.all('/', validateMiddleware);

/*
GET request -> ?foo=1&bar=hello
res.locals would be set to: {validated: {foo: 1, bar: 'hello'}}

GET request -> ?foo=hello&bar=1
Error object would be a Boom error for a bad request with a message of '"foo" must be a number'

GET request -> ?foo=1&bar=hello&far=true
Error object would be a Boom error for a bad request with a message of '"far" is not allowed'
*/
```

## License

MIT
