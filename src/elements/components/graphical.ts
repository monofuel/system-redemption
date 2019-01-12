import { Component } from ".";
import { ThreeSceneElement } from "../threeScene";
import { Mesh, Vector3, Object3D } from "three";
import { Unit, GameColors, ModelType } from "../../types/SR";
import { Asset, coloredModel } from "../../mesh/models";
import { getTile } from "../../planet";

export interface GraphicalComponent extends Component {
    mesh: Mesh;
}

export function updateGraphicalComponent(sceneElement: ThreeSceneElement, comp: GraphicalComponent) {

    const map = getMap(sceneElement);
    if (!map.getObjectByName(comp.uuid)) {
        map.add(comp.mesh);

    }
    const planet = sceneElement.ctx.gameState.planet!;
    if (!comp.mesh) {
        return;
    }
    const { x, y, facing } = sceneElement.ctx.gameState.units[comp.uuid];

    const tile = getTile(planet, x, y);
    const height = (tile[0] + tile[1] + tile[2] + tile[3]) / 4;

    comp.mesh.position.x = x + 0.5;
    comp.mesh.position.y = height * planet.zScale;
    comp.mesh.position.z = y + 0.5;

    switch (facing) {
        case 'N':
            comp.mesh.rotation.y = -Math.PI;
            break;
        case 'S':
            comp.mesh.rotation.y = Math.PI;
            break;
        case 'E':
            comp.mesh.rotation.y = Math.PI / 2;
            break;
        case 'W':
            comp.mesh.rotation.y = -Math.PI / 2;
    }
}

export function dispose(comp: GraphicalComponent) {

}

export function getMap(sceneElement: ThreeSceneElement): Object3D {
    return sceneElement.scene.getObjectByName(sceneElement.ctx.gameState.planet!.name)!;
}

export function unitGraphicalComp(sceneElement: ThreeSceneElement, unit: Unit): GraphicalComponent {
    const unitDef = sceneElement.ctx.gameState.unitDefinitions[unit.type];
    if (!unitDef) {
        throw new Error(`missing definition for unit type ${unit.type}`);
    }
    if (!unitDef.graphical) {
        throw new Error(`missing definition for unit type ${unit.type}`);
    }
    const mesh = assetForEntity(sceneElement.assets, unitDef.graphical.model, unit.color || randomColor());
    mesh.name = unit.uuid;

    return {
        uuid: unit.uuid,
        mesh
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