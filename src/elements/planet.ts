import { ThreeSceneElement, UpdateLoop } from "./threeScene";
import { EventContextElement } from "./eventContext";
import { HemisphereLight, DirectionalLight } from "three";
import { Unit } from "../types/SR";
import { info } from "../logging";
import { getPlanetObject, invalidateChunkCache } from "../mesh/tiles";
import { ECS } from "./components";
import { unitGraphicalComp, hilightGraphicalComp } from "./components/graphical";
import { getChunkForTile } from "../planet";
import { getHilightMesh } from "../mesh/hilight";

export class PlanetElement extends ThreeSceneElement {
    protected ecsLoop: UpdateLoop;

    protected ecs: ECS;

    constructor(ctx?: EventContextElement) {
        super(ctx);

        this.ecs = new ECS(this);
        this.ecsLoop = new UpdateLoop('ecs', (delta: number): boolean => {
            this.ecs.update();
            return false;
        }, 40);
        this.ecsLoop.start();

        this.camera.position.set(6, 9, 6);
        this.camera.lookAt(0, 0, 0);
        this.scene.add(new HemisphereLight(0xffffff, undefined, 0.6));

        const sun = new DirectionalLight(0xffffff, 1);
        sun.translateY(10);
        sun.translateX(10);
        sun.lookAt(0, 0, 0);
        this.scene.add(sun);

        this.ctx.queue.addListener('newFiniteMap', (event) => {
            for (const key in this.ecs.graphical) {
                this.ecs.removeGraphicalComponent(key);
            }
            this.loadMap();
        })
        this.ctx.queue.addListener('waterChange', (event) => {
            this.loadMap();
        });
        this.ctx.queue.addListener('mapEdit', (event) => {
            invalidateChunkCache(getChunkForTile(this.ctx.gameState.planet!, event.x, event.y));
            this.loadMap();

            const hilight = this.ctx.gameState.hilight;
            if (hilight && hilight.loc) {
                const key = 'hilight';
                const comp = hilightGraphicalComp(this, key, hilight.loc, hilight.corner);
                this.ecs.addGraphicalComponent(comp);
            }
        });

        this.ctx.queue.addListener('moveUnit', (event) => {
            console.log(event);
            console.log(this.ctx.gameState.units[event.uuid]);
        })

        this.ctx.queue.addListener('hilightUpdate', (event) => {
            const key = 'hilight';
            if (!event.loc) {
                this.ecs.removeGraphicalComponent(key);
            } else {
                const comp = hilightGraphicalComp(this, key, event.loc, event.corner);
                this.ecs.addGraphicalComponent(comp);
            }
        });

        this.ctx.queue.addListener('selectUnits', (event) => {
            const planet = this.ctx.gameState.planet!;
            const uuids = event.uuids;
            const hilightColor = 0xba2b0e;

            for (const uuid of uuids) {
                const unit = this.ctx.gameState.units[uuid];
                const comp = this.ecs.graphical[unit.uuid];
                if (!comp) {
                    continue;
                }
                const hilight = getHilightMesh({
                    zScale: planet.zScale,
                    color: hilightColor,
                })

                comp.mesh.add(hilight);
            }

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

        const comp = unitGraphicalComp(this, unit);
        this.ecs.addGraphicalComponent(comp);
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
            cache: true,
            wireframe: false,
        });
        mapObj.rotateY(Math.PI);
        const offset = (gameMap.size * gameMap.chunkSize) / 2;

        mapObj.position.set(offset, 0, offset);
        this.scene.add(mapObj);
    }

}