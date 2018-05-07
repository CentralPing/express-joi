const Joi = require('joi');

const {validate, body, params, query} = require('./main');

describe('[Unit] `main`', () => {
  let req;
  let res;
  let next;

  beforeAll(() => {
    next = jest.fn().mockName('next');
  });

  beforeEach(() => {
    req = {
      body: {foo: 1, bar: 'body'},
      params: {foo: '2', bar: 'params'},
      query: {foo: '3', bar: 'query'}
    };
    res = {locals: {}};
    next.mockClear();
  });

  describe('with `validate', () => {
    it('should export a function', () => {
      expect(validate).toBeInstanceOf(Function);
      expect(validate).toHaveLength(3);
    });

    it('should return middleware', () => {
      const middleware = validate();

      expect(middleware).toBeInstanceOf(Function);
      expect(middleware).toHaveLength(3);
    });

    describe('with configured middleware', () => {
      it('should validate from and write to specified locations', () => {
        const schema = {
          bar: Joi.string()
        };

        const middleware = validate(
          schema,
          {},
          {readFrom: 'query', writeTo: 'body'}
        );

        middleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(res.locals).toMatchObject({body: {bar: 'query'}});
      });
    });
  });

  describe('with `body', () => {
    it('should export a function', () => {
      expect(body).toBeInstanceOf(Function);
      expect(body).toHaveLength(2);
    });

    it('should return middleware', () => {
      const middleware = body();

      expect(middleware).toBeInstanceOf(Function);
      expect(middleware).toHaveLength(3);
    });

    describe('with configured middleware', () => {
      it('should validate body and write to `res.locals.body`', () => {
        const schema = {
          bar: Joi.string()
        };

        const middleware = body(schema);

        middleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(res.locals).toMatchObject({body: {bar: 'body'}});
      });
    });
  });

  describe('with `params', () => {
    it('should export a function', () => {
      expect(params).toBeInstanceOf(Function);
      expect(params).toHaveLength(2);
    });

    it('should return middleware', () => {
      const middleware = params();

      expect(middleware).toBeInstanceOf(Function);
      expect(middleware).toHaveLength(3);
    });

    describe('with configured middleware', () => {
      it('should validate parameters and write to `res.locals.params`', () => {
        const schema = {
          bar: Joi.string()
        };

        const middleware = params(schema);

        middleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(res.locals).toMatchObject({params: {bar: 'params'}});
      });
    });
  });

  describe('with `query', () => {
    it('should export a function', () => {
      expect(query).toBeInstanceOf(Function);
      expect(query).toHaveLength(2);
    });

    it('should return middleware', () => {
      const middleware = query();

      expect(middleware).toBeInstanceOf(Function);
      expect(middleware).toHaveLength(3);
    });

    describe('with configured middleware', () => {
      it('should validate query and write to `res.locals.query`', () => {
        const schema = {
          bar: Joi.string()
        };

        const middleware = query(schema);

        middleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(res.locals).toMatchObject({query: {bar: 'query'}});
      });
    });
  });
});
