import dat from 'dat.gui';
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

import { getParentContext } from '.';
import { info } from '../logging';
import { EventContextElement } from './eventContext';
import './styles/threeScene.scss';

export class ThreeSceneElement extends HTMLElement {
  public renderer: WebGLRenderer;
  public scene: Scene;
  public camera: PerspectiveCamera;

  public dat: dat.GUI;
  protected root: ShadowRoot;
  protected ctx: EventContextElement;
  protected updateLoops: { [key: string]: UpdateLoop } = {};

  constructor() {
    super();
    this.ctx = getParentContext(this);

    this.renderer = new WebGLRenderer();
    const height = this.offsetHeight;
    const width = this.offsetWidth;

    this.renderer.setSize(height, width);
    this.scene = new Scene();
    const aspectRatio = this.offsetWidth / this.offsetHeight;
    this.camera = new PerspectiveCamera(45, aspectRatio, 1, 500);
    this.camera.position.set(0, 50, 100);
    this.camera.lookAt(0, 0, 0);

    this.dat = new dat.GUI();
    this.render();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.appendChild(this.renderer.domElement);
  }

  public addUpdateLoop(
    name: string,
    fn: (delta: number) => boolean,
    freq: number,
  ) {
    if (this.updateLoops[name]) {
      this.updateLoops[name].stop();
      info('replacing update loop', { name, freq });
    } else {
      info('attaching update loop', { name, freq });
    }

    const loop = new UpdateLoop(name, fn, freq);
    this.updateLoops[name] = loop;
    loop.start();
  }

  private resize() {
    const renderSize = this.renderer.getSize();
    if (
      renderSize.width === this.offsetWidth &&
      renderSize.height === this.offsetHeight
    ) {
      return;
    }

    this.dat.domElement.style.position = 'absolute';
    this.dat.domElement.style.top = `${this.offsetTop}px`;
    this.dat.domElement.style.left = `${this.offsetLeft +
      this.offsetWidth -
      this.dat.domElement.offsetWidth}px`;

    this.camera.aspect = this.offsetWidth / this.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.offsetWidth, this.offsetHeight);
  }

  private render() {
    this.resize();
    if (!this.isConnected) {
      info('detaching scene render');
      return;
    }
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.render());
  }
}

export class UpdateLoop {
  private name: string;
  private fn: (delta: number) => boolean;
  private freq: number;
  private stopFlag: boolean = false;

  constructor(name: string, fn: (delta: number) => boolean, freq: number) {
    this.name = name;
    this.fn = fn;
    this.freq = freq;
  }

  public start() {
    let lastTime = Date.now();
    const loopFn = () => {
      if (this.stopFlag) {
        info('detaching loop', { name: this.name });
        return;
      }
      const startTime = Date.now();
      const end = this.fn(startTime - lastTime);
      if (end) {
        info('detaching loop', { name: this.name });
        return;
      }
      lastTime = Date.now();
      setTimeout(loopFn, 1000 / this.freq - (lastTime - startTime));
    };
    loopFn();
  }

  public stop() {
    this.stopFlag = true;
  }
}
