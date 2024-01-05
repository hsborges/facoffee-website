import nock from 'nock';
import * as Session from 'supertokens-auth-react/recipe/session';

import { httpClient } from './http-client';

describe('Testa httpClient', () => {
  httpClient.defaults.baseURL = 'http://localhost';

  let scope: nock.Scope | undefined = undefined;

  beforeAll(() => {
    scope = nock('http://localhost')
      .persist()
      .get('/any')
      .reply(function () {
        return [this.req.headers.authorization === 'Bearer token' ? 200 : 401];
      });
  });

  it('deve conter bearer token se usuario estiver logado', async () => {
    jest.spyOn(Session, 'getAccessToken').mockResolvedValue('token');
    await expect(httpClient.get('/any')).resolves.toHaveProperty('status', 200);
  });

  it('deve retornar não autorizado se token não estiver presente', async () => {
    jest.spyOn(Session, 'getAccessToken').mockResolvedValue(undefined);
    await expect(httpClient.get('/any')).rejects.toHaveProperty('response.status', 401);
  });
});
