import { loadElements } from './elements';
import { info } from './logging';

loadElements();

window.document.onload = function onLoad() {
    info('document loaded');
};
