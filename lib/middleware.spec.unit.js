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
      return middleware(req, res, next).then(() => {
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(res.locals).toMatchObject({query: {}});
      });
    });

    it('should validate and cast with a schema', () => {
      const schema = {
        foo: Joi.number()
      };

      return middleware(req, res, next, schema).then(() => {
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(res.locals).toMatchObject({query: {foo: 3}});
      });
    });

    it('should invalidate with a schema', () => {
      const schema = {
        bar: Joi.boolean()
      };

      return middleware(req, res, next, schema).then(() => {
        expect(next).toHaveBeenCalledTimes(1);

        const arg = next.mock.calls[0][0];

        expect(arg).toBeInstanceOf(Error);
        /* eslint-disable-next-line max-len */
        expect(arg.message).toBe('child "bar" fails because ["bar" must be a boolean]');
        expect(res.locals).toMatchObject({});
      });
    });

    describe('with options', () => {
      it('should override default options', () => {
        const options = {
          stripUnknown: false
        };

        return middleware(req, res, next, {}, options).then(() => {
          expect(next).toHaveBeenCalledTimes(1);

          const arg = next.mock.calls[0][0];

          expect(arg).toBeInstanceOf(Error);
          /* eslint-disable-next-line max-len */
          expect(arg.message).toBe('"foo" is not allowed. "bar" is not allowed');
          expect(res.locals).toMatchObject({});
        });
      });

      it('should allow valid options', () => {
        const schema = {
          foo: Joi.number()
        };
        const options = {
          convert: false
        };

        return middleware(req, res, next, schema, options).then(() => {
          expect(next).toHaveBeenCalledTimes(1);

          const arg = next.mock.calls[0][0];

          expect(arg).toBeInstanceOf(Error);
          /* eslint-disable-next-line max-len */
          expect(arg.message).toBe('child "foo" fails because ["foo" must be a number]');
          expect(res.locals).toMatchObject({});
        });
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
        return middleware(
          req,
          res,
          next,
          schema,
          {},
          {readFrom: 'body'}
        ).then(() => {
          expect(next).toHaveBeenCalledTimes(1);
          expect(next).toHaveBeenCalledWith();
          expect(res.locals).toMatchObject({query: {bar: 'body'}});
        });
      });

      it('should read from query', () => {
        return middleware(
          req,
          res,
          next,
          schema,
          {},
          {readFrom: 'query'}
        ).then(() => {
          expect(next).toHaveBeenCalledTimes(1);
          expect(next).toHaveBeenCalledWith();
          expect(res.locals).toMatchObject({query: {bar: 'query'}});
        });
      });

      it('should read from params', () => {
        return middleware(
          req,
          res,
          next,
          schema,
          {},
          {readFrom: 'params'}
        ).then(() => {
          expect(next).toHaveBeenCalledTimes(1);
          expect(next).toHaveBeenCalledWith();
          expect(res.locals).toMatchObject({query: {bar: 'params'}});
        });
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
        return middleware(
          req,
          res,
          next,
          schema,
          {},
          {writeTo: 'body'}
        ).then(() => {
          expect(next).toHaveBeenCalledTimes(1);
          expect(next).toHaveBeenCalledWith();
          expect(res.locals).toMatchObject({body: {bar: 'query'}});
        });
      });

      it('should write to params', () => {
        return middleware(
          req,
          res,
          next,
          schema,
          {},
          {writeTo: 'params'}
        ).then(() => {
          expect(next).toHaveBeenCalledTimes(1);
          expect(next).toHaveBeenCalledWith();
          expect(res.locals).toMatchObject({params: {bar: 'query'}});
        });
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

        return middleware(
          req,
          res,
          next,
          schema,
        ).then(() => {
          expect(next).toHaveBeenCalledTimes(1);
          expect(next).toHaveBeenCalledWith();
          expect(res.locals).toMatchObject({query: {bar: 'query'}});
        });
      });

      it('should read from and write to body with `POST`', () => {
        req.method = 'POST';

        return middleware(
          req,
          res,
          next,
          schema,
        ).then(() => {
          expect(next).toHaveBeenCalledTimes(1);
          expect(next).toHaveBeenCalledWith();
          expect(res.locals).toMatchObject({body: {bar: 'body'}});
        });
      });

      it('should read from and write to body with `PATCH`', () => {
        req.method = 'PATCH';

        return middleware(
          req,
          res,
          next,
          schema,
        ).then(() => {
          expect(next).toHaveBeenCalledTimes(1);
          expect(next).toHaveBeenCalledWith();
          expect(res.locals).toMatchObject({body: {bar: 'body'}});
        });
      });

      it('should read from and write to body with `PUT`', () => {
        req.method = 'PUT';

        return middleware(
          req,
          res,
          next,
          schema,
        ).then(() => {
          expect(next).toHaveBeenCalledTimes(1);
          expect(next).toHaveBeenCalledWith();
          expect(res.locals).toMatchObject({body: {bar: 'body'}});
        });
      });

      it('should read from and write to body with `DELETE`', () => {
        req.method = 'DELETE';

        return middleware(
          req,
          res,
          next,
          schema,
        ).then(() => {
          expect(next).toHaveBeenCalledTimes(1);
          expect(next).toHaveBeenCalledWith();
          expect(res.locals).toMatchObject({query: {bar: 'query'}});
        });
      });
    });
  });
});
