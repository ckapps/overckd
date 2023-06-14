import { ServerConfigToken } from './tokens';

describe('tokens', () => {
  test.each([['ServerConfigToken', ServerConfigToken]])(
    'should define token %p',
    (tokenName, token) => {
      expect(token).toBeDefined();
    },
  );
});
