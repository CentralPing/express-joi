const {validate, body, params, query} = require('./index');

describe('[Unit] `index`', () => {
  it('should export a `validate` function', () => {
    expect(validate).toBeInstanceOf(Function);
    expect(validate).toHaveLength(3);
  });

  it('should export a `body` function', () => {
    expect(body).toBeInstanceOf(Function);
    expect(body).toHaveLength(2);
  });

  it('should export a `params` function', () => {
    expect(params).toBeInstanceOf(Function);
    expect(params).toHaveLength(2);
  });

  it('should export a `query` function', () => {
    expect(query).toBeInstanceOf(Function);
    expect(query).toHaveLength(2);
  });
});
