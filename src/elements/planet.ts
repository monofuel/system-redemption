import { ThreeSceneElement, UpdateLoop } from "./threeScene";
import { EventContextElement } from "./eventContext";
import { HemisphereLight, DirectionalLight, Vector2, Raycaster, Vector3, DirectionalLightHelper } from "three";
import { Unit, Loc } from "../types/SR";
import { info } from "../logging";
import { getPlanetObject, invalidateChunkCache } from "../mesh/tiles";
import { ECS } from "./components";
import { unitGraphicalComp, hilightGraphicalComp, GraphicalType } from "./components/graphical";
import { getChunkForTile } from "../planet";
import { getHilightMesh } from "../mesh/hilight";

export class PlanetElement extends ThreeSceneElement {
    protected ecsLoop: UpdateLoop;

    protected ecs: ECS;
    protected usePlanetCache: boolean = false;

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
        sun.translateY(5);
        sun.translateX(5);
        sun.translateZ(3);
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
                const comp = this.ecs.graphical[uuid];
                if (!comp || comp.type !== GraphicalType.unit) {
                    continue;
                }
                const hilight = getHilightMesh({
                    zScale: planet.zScale,
                    color: hilightColor,
                })
                hilight.name = 'selection';
                comp.mesh.add(hilight);
            }

            for (const uuid in this.ecs.graphical) {
                const comp = this.ecs.graphical[uuid];
                const selection = comp.mesh.getObjectByName('selection');
                if (selection && !event.uuids.includes(comp.key)) {
                    comp.mesh.remove(selection);
                }
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

    protected getTileAtRay(screenLoc: Vector2, ignoreWater: boolean): Loc | null {
        const vec = this.getPointAtRay(screenLoc, ignoreWater);
        if (!vec) {
            return null;
        }
        let x = Math.floor(vec.x);
        let y = Math.floor(vec.z);
        return [x, y];

    }

    protected getPointAtRay(screenLoc: Vector2, ignoreWater: boolean): Vector3 | null {
        const raycaster = new Raycaster();
        raycaster.setFromCamera(screenLoc, this.camera);

        const mapObj = this.scene.getObjectByName('foobar');
        if (!mapObj) {
            return null;
        }

        const intersects = raycaster.intersectObjects(mapObj.children);
        let intersection = intersects.length > 0 ? intersects[0] : null;
        // HACK for ignoring water, ignore transparent faces
        if (ignoreWater) {
            for (const inter of intersects) {
                const face = inter.face;
                if (face && face.materialIndex === 2) {
                    intersection = null;
                    continue;
                } else {
                    intersection = inter;
                    break;
                }
            }
        }
        if (intersection) {



            const vec = intersection.point.applyMatrix4(mapObj.matrix);
            // fudge the number over a little to prevent flickering over cliffs
            vec.add(new Vector3(0.001, 0.001, 0.001));
            let { x, y } = vec;
            const maxSize = this.ctx.gameState.planet!.size * this.ctx.gameState.planet!.chunkSize;
            if (x < 0) {
                vec.x = 0;
            }
            if (y < 0) {
                vec.z = 0;
            }
            if (x > maxSize - 0.002) {
                vec.x = maxSize - 0.002;
            }
            if (y > maxSize - 0.002) {
                vec.z = maxSize - 0.002;
            }
            return vec;
        } else {
            return null;
        }
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
            cache: this.usePlanetCache,
            wireframe: false,
        });
        mapObj.rotateY(Math.PI);
        const offset = (gameMap.size * gameMap.chunkSize) / 2;

        mapObj.position.set(offset, 0, offset);
        this.scene.add(mapObj);
    }

}