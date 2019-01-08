import { ModelType, GameColors, Unit } from "../types/SR";
import { Asset, coloredModel } from "./models";
import { Mesh, Vector3 } from "three";
import { getTile } from "../planet";
import { ThreeSceneElement } from "../elements/threeScene";

export class Entity {
    public unit: Unit;
    private mesh?: Mesh;
    private sceneElement: ThreeSceneElement;
    constructor(sceneElement: ThreeSceneElement, unit: Unit) {
        this.sceneElement = sceneElement;
        this.unit = unit;
        const unitDefinition = sceneElement.ctx.gameState.unitDefinitions[unit.type];
        if (!unitDefinition) {
            throw new Error(`missing definition for unit type ${unit.type}`);
        }
        if (unitDefinition.graphical) {

            this.mesh = assetForEntity(sceneElement.assets, unitDefinition.graphical.model, unit.color || randomColor());
            this.mesh.name = unit.uuid;

            this.updateLoc();
        }
    }
    getMap() {
        return this.sceneElement.scene.getObjectByName(this.sceneElement.ctx.gameState.planet!.name)!
    }

    // TODO handle animating between tiles
    updateLoc() {
        const map = this.getMap();
        if (!map.getObjectByName(this.unit.uuid)) {
            map.add(this.mesh!);

        }
        const planet = this.sceneElement.ctx.gameState.planet!;
        if (!this.mesh) {
            return;
        }
        const { x, y, facing } = this.unit;

        const tile = getTile(planet, x, y);
        const height = (tile[0] + tile[1] + tile[2] + tile[3]) / 4;

        this.mesh.position.x = x + 0.5;
        this.mesh.position.y = height * planet.zScale;
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
        if (this.mesh) {
            this.getMap().remove(this.mesh);
        }
    }
}

function assetForEntity(assets: Record<ModelType, Asset>, modelType: ModelType, color: GameColors): Mesh {
    switch (modelType) {
        case ModelType.LightTankLvl1:
            const model = coloredModel(assets[modelType], color);
            model.scale.copy(new Vector3(0.7, 0.7, 0.7));
            return model;
        default:
            throw new Error(`missing asset for ${modelType}`)
    }
}

export function randomColor(): GameColors {
    const num = Math.floor(Math.random() * Object.keys(GameColors).length);
    return (GameColors as any)[Object.keys(GameColors)[num]];

}