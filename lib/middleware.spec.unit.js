const Joi = require('joi');
const {middleware} = require('./middleware');

describe('[Unit] `middleware`', () => {
  it('should export a function', () => {
    expect(middleware).toBeInstanceOf(Function);
  });

  describe('with requests', () => {
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

    it('should validate with no schema', () => {
      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
      expect(res.locals).toMatchObject({query: {}});
    });

    it('should validate and cast with a schema', () => {
      const schema = {
        foo: Joi.number()
      };

      middleware(req, res, next, schema);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
      expect(res.locals).toMatchObject({query: {foo: 3}});
    });

    it('should invalidate with a schema', () => {
      const schema = {
        bar: Joi.boolean()
      };

      middleware(req, res, next, schema);

      expect(next).toHaveBeenCalledTimes(1);

      const arg = next.mock.calls[0][0];

      expect(arg).toBeInstanceOf(Error);
      /* eslint-disable-next-line max-len */
      expect(arg.message).toBe('child "bar" fails because ["bar" must be a boolean]');
      expect(res.locals).toMatchObject({});
    });

    describe('with options', () => {
      it('should override default options', () => {
        const options = {
          stripUnknown: false
        };

        middleware(req, res, next, {}, options);

        expect(next).toHaveBeenCalledTimes(1);

        const arg = next.mock.calls[0][0];

        expect(arg).toBeInstanceOf(Error);
        /* eslint-disable-next-line max-len */
        expect(arg.message).toBe('"foo" is not allowed. "bar" is not allowed');
        expect(res.locals).toMatchObject({});
      });

      it('should allow valid options', () => {
        const schema = {
          foo: Joi.number()
        };
        const options = {
          convert: false
        };

        middleware(req, res, next, schema, options);

        expect(next).toHaveBeenCalledTimes(1);

        const arg = next.mock.calls[0][0];

        expect(arg).toBeInstanceOf(Error);
        /* eslint-disable-next-line max-len */
        expect(arg.message).toBe('child "foo" fails because ["foo" must be a number]');
        expect(res.locals).toMatchObject({});
      });
    });

    describe('with `readFrom`', () => {
      let schema;

      beforeAll(() => {
        schema = {
          bar: Joi.string()
        };
      });

      it('should read from body', () => {
        middleware(
          req,
          res,
          next,
          schema,
          {},
          {readFrom: 'body'}
        );

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(res.locals).toMatchObject({query: {bar: 'body'}});
      });

      it('should read from query', () => {
        middleware(
          req,
          res,
          next,
          schema,
          {},
          {readFrom: 'query'}
        );

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(res.locals).toMatchObject({query: {bar: 'query'}});
      });

      it('should read from params', () => {
        middleware(
          req,
          res,
          next,
          schema,
          {},
          {readFrom: 'params'}
        );

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(res.locals).toMatchObject({query: {bar: 'params'}});
      });
    });


    describe('with `writeTo`', () => {
      let schema;

      beforeAll(() => {
        schema = {
          bar: Joi.string()
        };
      });

      it('should write to body', () => {
        middleware(
          req,
          res,
          next,
          schema,
          {},
          {writeTo: 'body'}
        );

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(res.locals).toMatchObject({body: {bar: 'query'}});
      });

      it('should write to params', () => {
        middleware(
          req,
          res,
          next,
          schema,
          {},
          {writeTo: 'params'}
        );

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(res.locals).toMatchObject({params: {bar: 'query'}});
      });
    });

    describe('with method defaults', () => {
      let schema;

      beforeAll(() => {
        schema = {
          bar: Joi.string()
        };
      });

      it('should read from and write to query with `GET`', () => {
        req.method = 'GET';

        middleware(
          req,
          res,
          next,
          schema,
        );

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(res.locals).toMatchObject({query: {bar: 'query'}});
      });

      it('should read from and write to body with `POST`', () => {
        req.method = 'POST';

        middleware(
          req,
          res,
          next,
          schema,
        );

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(res.locals).toMatchObject({body: {bar: 'body'}});
      });

      it('should read from and write to body with `PATCH`', () => {
        req.method = 'PATCH';

        middleware(
          req,
          res,
          next,
          schema,
        );

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(res.locals).toMatchObject({body: {bar: 'body'}});
      });

      it('should read from and write to body with `PUT`', () => {
        req.method = 'PUT';

        middleware(
          req,
          res,
          next,
          schema,
        );

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(res.locals).toMatchObject({body: {bar: 'body'}});
      });

      it('should read from and write to body with `DELETE`', () => {
        req.method = 'DELETE';

        middleware(
          req,
          res,
          next,
          schema,
        );

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(res.locals).toMatchObject({query: {bar: 'query'}});
      });
    });
  });
});
