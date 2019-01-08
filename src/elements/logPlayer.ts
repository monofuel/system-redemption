import { ThreeSceneElement, UpdateLoop } from './threeScene';
import { DirectionalLight, HemisphereLight, Mesh, Scene, Object3D, Vector2, Vector3, OrbitControls } from 'three';
import { info } from '../logging';
import { getPlanetObject } from '../mesh/tiles';
import { EventContextElement } from './eventContext';
import { Unit, UnitType, ModelType, GameColors } from '../types/SR';
import { Asset, coloredModel } from '../mesh/models';
import { getTile } from '../planet';

export class LogPlayerElement extends ThreeSceneElement {
    private entities: { [key: string]: Entity } = {};
    animationLoop: UpdateLoop;
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

        const sun = new DirectionalLight(0xffffff, 2);
        sun.translateY(10);
        sun.translateX(10);
        sun.lookAt(0, 0, 0);
        this.scene.add(sun);

        const controls = new OrbitControls(this.camera, this);
        controls.target.set(0, 0, 0);
        controls.update();

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

class Entity {
    public unit: Unit;
    private mesh: Mesh;
    private sceneElement: ThreeSceneElement;
    constructor(sceneElement: ThreeSceneElement, unit: Unit) {
        this.sceneElement = sceneElement;
        this.unit = unit;
        this.mesh = assetForEntity(sceneElement.assets, unit.type, randomColor());
        sceneElement.scene.add(this.mesh);
        const map = this.getMap();
        map.add(this.mesh);

        this.updateLoc();
    }
    getMap() {
        return this.sceneElement.scene.getObjectByName(this.sceneElement.ctx.gameState.planet!.name)!
    }

    // TODO handle animating between tiles
    updateLoc() {
        const { x, y, facing } = this.unit;

        const tile = getTile(this.sceneElement.ctx.gameState.planet!, x, y);
        const height = (tile[0] + tile[1] + tile[2] + tile[3]) / 4;

        this.mesh.position.x = x + 0.5;
        this.mesh.position.y = height;
        this.mesh.position.z = y + 0.5;

        switch (facing) {
            case 'N':
                this.mesh.rotation.y = -Math.PI;
                break;
            case 'S':
                this.mesh.rotation.y = Math.PI;
                break;
            case 'E':
                this.mesh.rotation.y = Math.PI / 2;
                break;
            case 'W':
                this.mesh.rotation.y = -Math.PI / 2;
        }

    }
    remove() {
        this.getMap().remove(this.mesh);
    }
}

function assetForEntity(assets: Record<ModelType, Asset>, unit: UnitType, color: GameColors): Mesh {
    switch (unit) {
        case UnitType.tank:
            const model = coloredModel(assets[ModelType.LightTankLvl1], color);
            model.scale.copy(new Vector3(0.7, 0.7, 0.7));
            return model;
        default:
            throw new Error(`missing asset for ${unit}`)
    }
}

function randomColor(): GameColors {
    const num = Math.floor(Math.random() * Object.keys(GameColors).length);
    return (GameColors as any)[Object.keys(GameColors)[num]];

}