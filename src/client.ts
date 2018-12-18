import { loadElements } from './elements';
import { info } from './logging';
import './styles/main.scss';

loadElements();

window.document.onload = function onLoad() {
    info('document loaded');
};
