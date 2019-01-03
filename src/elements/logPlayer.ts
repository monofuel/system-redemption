import { ThreeSceneElement } from './threeScene';
import { DirectionalLight, HemisphereLight } from 'three';
import { info } from '../logging';
import { getPlanetObject } from '../mesh/tiles';
import { EventContextElement } from './eventContext';

export class LogPlayerElement extends ThreeSceneElement {
    constructor(ctx?: EventContextElement) {
        super(ctx);

        this.camera.position.set(-7, 5, -7);
        this.camera.lookAt(0, 0, 0);
        this.scene.add(new HemisphereLight(0xffffff, undefined, 0.3));

        this.ctx.queue.addListener('newFiniteMap', (event) => {
            this.loadMap();
        })
        this.ctx.queue.addListener('waterChange', (event) => {
            this.loadMap();
        });
        this.ctx.queue.addListener('mapEdit', (event) => {
            this.loadMap();
        })
    }
    private loadMap() {
        const gameMap = this.ctx.gameState.planets['testTilesMap'];
        info('loading map', { name });
        const sun = new DirectionalLight(gameMap.sunColor, 0.8);
        sun.name = 'gameMap-sun';
        sun.translateY(40);
        sun.translateX(50);
        sun.lookAt(0, 0, 0);
        let existing = this.scene.getObjectByName(sun.name);
        if (existing) {
            this.scene.remove(existing);
        }
        this.scene.add(sun);

        existing = this.scene.getObjectByName(gameMap.name);
        if (existing) {
            this.scene.remove(existing);
        }
        const mapObj = getPlanetObject({
            gameMap,
        });
        mapObj.rotateY(Math.PI);
        const offset = (gameMap.size * gameMap.chunkSize) / 2;

        mapObj.position.set(offset, 0, offset);
        this.scene.add(mapObj);
    }
}
