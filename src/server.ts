import 'source-map-support/register';
import { initWeb } from './http';
import { error } from './logging';

async function init() {
  process.on('unhandledRejection', (err, p) => {
    error('unhandled rejection', { err: JSON.stringify(err) });
  });

  // @ts-ignore
  global.window = {};
  await initWeb();
}

if (require.main === module) {
  init().catch((err) => {
    error('init failed', { msg: err.message });
  });
}
