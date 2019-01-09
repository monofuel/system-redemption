import { ThreeSceneElement, UpdateLoop } from "./threeScene";
import { EventContextElement } from "./eventContext";
import { Entity } from "../mesh/entity";
import { HemisphereLight, DirectionalLight } from "three";
import { Unit } from "../types/SR";
import { info } from "../logging";
import { getPlanetObject } from "../mesh/tiles";

export class PlanetElement extends ThreeSceneElement {
    protected entities: { [key: string]: Entity } = {};
    protected animationLoop: UpdateLoop;
    constructor(ctx?: EventContextElement) {
        super(ctx);

        this.animationLoop = new UpdateLoop('animation', (delta: number): boolean => {
            for (const entity of Object.values(this.entities)) {
                entity.updateLoc();

            }
            return false;
        }, 40);
        this.animationLoop.start();

        this.camera.position.set(7, 5, 7);
        this.camera.lookAt(0, 0, 0);
        this.scene.add(new HemisphereLight(0xffffff, undefined, 0.6));

        const sun = new DirectionalLight(0xffffff, 1);
        sun.translateY(10);
        sun.translateX(10);
        sun.lookAt(0, 0, 0);
        this.scene.add(sun);

        this.ctx.queue.addListener('newFiniteMap', (event) => {
            for (const entity of Object.values(this.entities)) {
                entity.remove();
                this.entities = {};
            }
            this.loadMap();
        })
        this.ctx.queue.addListener('waterChange', (event) => {
            this.loadMap();
        });
        this.ctx.queue.addListener('mapEdit', (event) => {
            this.loadMap();
        });

        this.ctx.queue.addListener('moveUnit', (event) => {
            console.log(event);
            console.log(this.ctx.gameState.units[event.uuid]);
        })


        this.onAssetsLoaded = () => {
            this.ctx.queue.addListener('newUnit', (event) => {
                this.addUnit(this.ctx.gameState.units[event.unit.uuid]);
            });
            for (const unit of Object.values(this.ctx.gameState.units)) {
                this.addUnit(unit);
            }
        }
    }
    private addUnit(unit: Unit) {
        if (this.entities[unit.uuid]) {
            this.entities[unit.uuid]
        }
        const entity = new Entity(this, unit);
        this.entities[unit.uuid] = entity;
    }

    private loadMap() {
        const gameMap = this.ctx.gameState.planet;
        if (!gameMap) {
            throw new Error('game map not loaded');
        }
        info('loading map', { name: gameMap.name });
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
        // mapObj.rotateY(Math.PI);
        const offset = (gameMap.size * gameMap.chunkSize) / 2;

        mapObj.position.set(-offset, 0, -offset);
        this.scene.add(mapObj);
    }

}