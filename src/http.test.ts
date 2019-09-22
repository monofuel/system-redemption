import { initWeb, shutdownWeb } from './http';

describe('http server', () => {
  it('start server', async () => {
    await initWeb();
  });

  it('stop server', async () => {
    await shutdownWeb();
  });
});
