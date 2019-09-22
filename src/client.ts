import { loadAsyncElements, loadElements } from './elements';
import { info } from './logging';

async function loadClient() {
  info('loading async elements');
  loadElements();
  await loadAsyncElements();
  info('document loaded');
}

if (require.main === module) {
  loadClient();
}
