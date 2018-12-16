import { Scene } from 'three';
import { loadComponents } from './components';
import { info } from './logging';
import './styles/main.scss';

loadComponents();

window.document.onload = function onLoad() {
    info('document loaded');
};
