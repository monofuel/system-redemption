import dat from 'dat.gui';
import { PerspectiveCamera, Scene, WebGLRenderer, OrbitControls } from 'three';

import { getParentContext, RollingStats } from '.';
import { info } from '../logging';
import { EventContextElement } from './eventContext';
import './styles/threeScene.scss';
import { Asset, loadAssets } from '../mesh/models';
import { ModelType } from '../types/SR';

export class ThreeSceneElement extends HTMLElement {
  public renderer: WebGLRenderer;
  public scene: Scene;
  public camera: PerspectiveCamera;

  public dat: dat.GUI;
  public ctx: EventContextElement;
  protected updateLoops: { [key: string]: UpdateLoop } = {};

  public frameTimeStats: RollingStats;
  public frameDeltaStats: RollingStats;

  public lastFrameTime: number = 0;

  protected perfText: HTMLUListElement;
  protected frameRateLi: HTMLLIElement;
  protected frameTimeLi: HTMLLIElement;
  protected frameDeltaLi: HTMLLIElement;

  protected afterRender?: () => void;

  // assets is null until onAssetsLoaded is called
  public assets!: Record<ModelType, Asset>;
  public onAssetsLoaded?: () => void;

  constructor(ctx?: EventContextElement) {
    super();

    this.ctx = ctx || getParentContext(this);

    this.renderer = new WebGLRenderer({ alpha: true });
    this.renderer.autoClear = false;
    const height = this.offsetHeight;
    const width = this.offsetWidth;

    this.renderer.setSize(height, width);
    this.scene = new Scene();
    const aspectRatio = this.offsetWidth / this.offsetHeight;
    this.camera = new PerspectiveCamera(45, aspectRatio, 1, 500);
    this.camera.position.set(0, 50, 100);
    this.camera.lookAt(0, 0, 0);

    this.frameTimeStats = new RollingStats(60);
    this.frameDeltaStats = new RollingStats(60);

    this.dat = new dat.GUI();
    this.appendChild(this.renderer.domElement);
    this.renderer.setAnimationLoop(this.render.bind(this));

    this.perfText = document.createElement('ul');
    this.perfText.classList.add('hover-text');
    this.frameRateLi = document.createElement('li');
    this.frameTimeLi = document.createElement('li');
    this.frameDeltaLi = document.createElement('li');
    this.perfText.appendChild(this.frameRateLi);
    this.perfText.appendChild(this.frameTimeLi);
    this.perfText.appendChild(this.frameDeltaLi);
    const perfFolder = this.dat.addFolder('Performance');
    (perfFolder as any).__ul.appendChild(this.perfText);

    this.addUpdateLoop('stats', (delta: number) => {
      this.updateHoverText();
      return false;
    }, 1);

    loadAssets((current: number, total: number) => {
      console.log(`ASSETS: ${current}/${total}`);
    }).then((assets) => {
      this.assets = assets;
      if (this.onAssetsLoaded) {
        this.onAssetsLoaded();
      }
    })
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

  protected render() {

    // @ts-ignore
    if (this.renderer.xr && this.renderer.xr.sessionActive) {
      return;
    }

    if (this.isConnected) {
      this.resize();
      const start = Date.now();
      this.renderer.render(this.scene, this.camera);
      const end = Date.now();
      this.frameTimeStats.add(end - start);
      if (this.lastFrameTime !== 0) {
        this.frameDeltaStats.add(end - this.lastFrameTime);
      }
      this.lastFrameTime = end;
      if (this.afterRender) {
        this.afterRender();
      }
    }
    // window.requestAnimationFrame(() => this.render());
  }
  private updateHoverText() {

    const delta = this.frameDeltaStats.get();
    this.frameRateLi.innerText = `FrameRate: ${(1000 / delta).toFixed(3)}fps`;
    this.frameTimeLi.innerText = `FrameTime: ${this.frameTimeStats.get().toFixed(3)}ms`;
    this.frameDeltaLi.innerText = `FrameDelta: ${delta.toFixed(3)}ms`;

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
