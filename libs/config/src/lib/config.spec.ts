import config from './config.js';

describe('config', () => {
  it('should return application configuration', () => {
    expect(config()).toBeDefined();
    expect(config().app.environment).toBeDefined();
  });
});
