const Joi = require('joi');
const express = require('express');
const request = require('supertest');
const bodyParser = require('body-parser');

const {validate, body, params, query} = require('./main');

describe('[Func] `main`', () => {
  let app;

  beforeAll(() => {
    const schema = {
      foo: Joi.number(),
      bar: Joi.string()
    };

    const validateMiddleware = validate(schema);
    const bodyMiddleware = body(schema);
    const paramsMiddleware = params(schema);
    const queryMiddleware = query(schema);

    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.all('/validate', validateMiddleware);
    app.all('/body', bodyMiddleware);
    app.all('/params/:foo/:bar', paramsMiddleware);
    app.all('/query', queryMiddleware);
    app.use((req, res, next) => {
      res.status(200).json({path: req.path, ...res.locals});
      next();
    });
    app.use((error, req, res, next) => {
      res.status(200).json({path: req.path, ...error.output.payload});
      next();
    });
  });

  describe('with `validate`', () => {
    it('should validate with query', () => {
      return request(app).get('/validate')
        .query({foo: 1, bar: 'query'})
        .then((res) => {
          expect(res.body).toEqual({
            path: '/validate',
            query: {foo: 1, bar: 'query'}
          });
        });
    });

    it('should not validate with query', () => {
      return request(app).get('/validate')
        .query({foo: 'query', bar: 1})
        .then((res) => {
          expect(res.body).toEqual({
            path: '/validate',
            error: 'Bad Request',
            message: 'child "foo" fails because ["foo" must be a number]',
            statusCode: 400
          });
        });
    });

    it('should validate with JSON body', () => {
      return request(app).post('/validate')
        .set('Content-Type', 'application/json')
        .send({foo: 1, bar: 'post'})
        .then((res) => {
          expect(res.body).toEqual({
            path: '/validate',
            body: {foo: 1, bar: 'post'}
          });
        });
    });

    it('should not validate with JSON body', () => {
      return request(app).post('/validate')
        .set('Content-Type', 'application/json')
        .send({foo: 'post', bar: 1})
        .then((res) => {
          expect(res.body).toEqual({
            path: '/validate',
            error: 'Bad Request',
            message: 'child "foo" fails because ["foo" must be a number]',
            statusCode: 400
          });
        });
    });

    it('should validate with form body', () => {
      return request(app).put('/validate')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({foo: 1, bar: 'put'})
        .then((res) => {
          expect(res.body).toEqual({
            path: '/validate',
            body: {foo: 1, bar: 'put'}
          });
        });
    });

    it('should not validate with form body', () => {
      return request(app).put('/validate')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({foo: 'post', bar: 1})
        .then((res) => {
          expect(res.body).toEqual({
            path: '/validate',
            error: 'Bad Request',
            message: 'child "foo" fails because ["foo" must be a number]',
            statusCode: 400
          });
        });
    });
  });

  describe('with `body`', () => {
    it('should validate JSON', () => {
      return request(app).post('/body')
        .set('Content-Type', 'application/json')
        .send({foo: 1, bar: 'body'})
        .then((res) => {
          expect(res.body).toEqual({
            path: '/body',
            body: {foo: 1, bar: 'body'}
          });
        });
    });

    it('should not validate JSON', () => {
      return request(app).post('/body')
        .set('Content-Type', 'application/json')
        .send({foo: 'post', bar: 1})
        .then((res) => {
          expect(res.body).toEqual({
            path: '/body',
            error: 'Bad Request',
            message: 'child "foo" fails because ["foo" must be a number]',
            statusCode: 400
          });
        });
    });

    it('should validate form', () => {
      return request(app).post('/body')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({foo: 1, bar: 'body'})
        .then((res) => {
          expect(res.body).toEqual({
            path: '/body',
            body: {foo: 1, bar: 'body'}
          });
        });
    });

    it('should not validate form', () => {
      return request(app).put('/body')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({foo: 'post', bar: 1})
        .then((res) => {
          expect(res.body).toEqual({
            path: '/body',
            error: 'Bad Request',
            message: 'child "foo" fails because ["foo" must be a number]',
            statusCode: 400
          });
        });
    });
  });

  describe('with `params`', () => {
    it('should validate', () => {
      return request(app).get('/params/1/params')
        .then((res) => {
          expect(res.body).toEqual({
            path: '/params/1/params',
            params: {foo: 1, bar: 'params'}
          });
        });
    });

    it('should not validate', () => {
      return request(app).get('/params/params/1')
        .then((res) => {
          expect(res.body).toEqual({
            path: '/params/params/1',
            error: 'Bad Request',
            message: 'child "foo" fails because ["foo" must be a number]',
            statusCode: 400
          });
        });
    });
  });

  describe('with `query`', () => {
    it('should validate', () => {
      return request(app).get('/query?foo=1&bar=query')
        .then((res) => {
          expect(res.body).toEqual({
            path: '/query',
            query: {foo: 1, bar: 'query'}
          });
        });
    });

    it('should not validate', () => {
      return request(app).get('/query?foo=query&bar=1')
        .then((res) => {
          expect(res.body).toEqual({
            path: '/query',
            error: 'Bad Request',
            message: 'child "foo" fails because ["foo" must be a number]',
            statusCode: 400
          });
        });
    });
  });
});
